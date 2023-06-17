import React, { useEffect, useState, useRef } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Button, message, Upload } from "antd";
import { put, get } from "../../../util/request";
import api from "../../../api";
import SubjectModal from "./SubjectModal";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nord } from "react-syntax-highlighter/dist/esm/styles/prism";
import TurndownService from "turndown";
import { PictureOutlined } from "@ant-design/icons";

import "./index.css";

const turndownService = new TurndownService();

export default function Editor(props) {
  const { article, setArticle, getCollectionAndArticles } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 图片上传相关
  const [ossData, setOssData] = useState(null);
  const imgUrl = useRef(null);

  // 获取oss授权
  const getPolicy = async () => {
    const result = await get(api.oss.policy);
    console.log("获取授权");
    setOssData(result);
  };

  useEffect(() => {
    getPolicy();
  }, []);

  const getExtraData = file => ({
    key: imgUrl.current,
    OSSAccessKeyId: ossData?.accessId,
    policy: ossData?.policy,
    Signature: ossData?.signature,
  });

  const beforeUpload = async file => {
    if (!ossData) return false;
    // 请求授权
    const expire = Number(ossData.expire) * 1000;
    if (expire < Date.now()) {
      await getPolicy();
    }
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("只能上传JPG/PNG类型的图片");
      return false;
    }
    const isLt20M = file.size / 1024 / 1024 < 20;
    if (!isLt20M) {
      message.error("图片必须小于20MB!");
      return false;
    }
    imgUrl.current = ossData.dir + Date.now() + file.name.slice(file.name.lastIndexOf("."));
    return file;
  };

  const handleChange = ({ file }) => {
    if (file.status == "done") {
      message.success("上传成功");
      const url = `${ossData.host}/${imgUrl.current}`;
      console.log(url);
      setArticle({ ...article, content: (article.content ? article.content : "") + `\n![](${url})\n` });
    }
  };

  const handleContentChange = e => {
    const { value } = e.target;
    const newArticle = { ...article, content: value };
    setArticle(newArticle);
  };
  const handleTitleChange = e => {
    const { value } = e.target;
    const newArticle = { ...article, title: value };
    setArticle(newArticle);
  };
  const saveArticle = () => {
    const articleParam = { id: article.id, title: article.title, content: article.content };
    put(api.article.save, articleParam).then(res => {
      if (res) {
        message.success("保存成功");
        getCollectionAndArticles();
      }
    });
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handlePaste = e => {
    const html = e.clipboardData.getData("text/html");
    const markdown = turndownService.turndown(html);
    console.log(markdown);
    document.execCommand("insertText", false, markdown);
    e.preventDefault();
  };
  return (
    <div className="editor-box">
      <div className="editor-header">
        <input
          readOnly={!article}
          type="text"
          className="title-input"
          value={article ? article.title : ""}
          onChange={handleTitleChange}
          placeholder="标题"
        />
        <Upload
          name="file"
          showUploadList={false}
          action={ossData?.host}
          beforeUpload={beforeUpload}
          data={getExtraData}
          onChange={handleChange}
        >
          <Button icon={<PictureOutlined />} disabled={!article}>
            上传图片
          </Button>
        </Upload>
        <Button disabled={!article} onClick={saveArticle} style={{ marginLeft: 10 }}>
          保存
        </Button>
        <Button
          disabled={!article || article.publish == 1}
          style={{ marginLeft: 10 }}
          type="primary"
          onClick={showModal}
        >
          发布
        </Button>
      </div>
      <div className="e-box">
        <div className="edit-box">
          <textarea
            readOnly={!article}
            id="edit-area"
            value={article ? (article.content ? article.content : "") : ""}
            onChange={handleContentChange}
            onPaste={handlePaste}
          ></textarea>
        </div>
        <div className="show-box markdown">
          <ReactMarkdown
            children={article ? article.content : ""}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, "")}
                    language={match ? match[1] : "text"}
                    PreTag="div"
                    style={nord}
                    {...props}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          />
        </div>
      </div>
      <SubjectModal
        article={article}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        getCollectionAndArticles={getCollectionAndArticles}
      ></SubjectModal>
    </div>
  );
}
