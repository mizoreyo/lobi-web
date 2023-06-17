import React, { useState } from "react";
import { Button, Input } from "antd";
import api from "../../../../api";
import { post } from "../../../../util/request";
import { message } from "antd";
import "./index.css";

const { TextArea } = Input;

export default function CommentInput(props) {
  const { article, parent, getComment } = props;
  const [content, setContent] = useState("");

  const handleChange = e => {
    setContent(e.currentTarget.value);
  };

  const createComment = () => {
    post(api.comment.create, { article, parent, content }).then(res => {
      if (res) {
        message.success("发布评论成功");
        getComment();
      }
    });
  };

  return (
    <div className="comm-input-box" style={{ marginTop: 10 }}>
      <TextArea
        value={content}
        onChange={handleChange}
        maxLength={300}
        style={{ height: 100, resize: "none" }}
        placeholder="写下你的评论..."
      ></TextArea>
      <div className="commi-footer">
        <Button type="primary" onClick={createComment}>
          发布
        </Button>
      </div>
    </div>
  );
}
