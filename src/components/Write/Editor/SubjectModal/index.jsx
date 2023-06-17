import React, { useEffect } from "react";
import { Modal, Select, Divider, Space, Tag, Button, message } from "antd";
import { useState } from "react";
import { get, put } from "../../../../util/request";
import api from "../../../../api";

export default function SubjectModal(props) {
  const { open, onOk, onCancel, article, getCollectionAndArticles } = props;
  const [data, setData] = useState([]);
  const [value, setValue] = useState();
  const [hotSubjects, setHotSubjects] = useState([]);

  const handleSearch = newValue => {
    if (newValue) {
      get(api.subject.search, { q: newValue }).then(res => {
        setData(res);
      });
    } else {
      setData([]);
    }
  };
  const handleChange = newValue => {
    setValue(newValue);
  };
  const publish = () => {
    const publishParam = { ...article, subject: value };
    put(api.article.publish, publishParam).then(res => {
      if (res) {
        message.success("发布成功");
        getCollectionAndArticles();
        onCancel();
      }
    });
  };
  const selectHot = subject => {
    setData([subject]);
    setValue(subject.id);
  };

  useEffect(() => {
    get(api.subject.hot).then(res => {
      console.log(res);
      if (res) {
        setHotSubjects(res);
      }
    });
  }, []);

  return (
    <Modal
      title={"选择专题"}
      open={open}
      maskStyle={{ backgroundColor: "transparent" }}
      footer={null}
      onCancel={onCancel}
      width={400}
    >
      <Select
        style={{ marginTop: 30, width: "100%" }}
        showSearch
        value={value}
        placeholder="选择专题"
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={handleSearch}
        onChange={handleChange}
        notFoundContent={null}
        options={(data || []).map(d => ({
          value: d.id,
          label: d.name,
        }))}
      />
      <Divider orientation="left">热门专题</Divider>
      <Space size={[0, 8]} wrap>
        {hotSubjects.map(item => {
          return (
            <Tag style={{ cursor: "pointer" }} key={`subject-${item.id}`} onClick={() => selectHot(item)}>
              {item.name}
            </Tag>
          );
        })}
      </Space>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <Button onClick={publish} type="primary">
          发布
        </Button>
      </div>
    </Modal>
  );
}
