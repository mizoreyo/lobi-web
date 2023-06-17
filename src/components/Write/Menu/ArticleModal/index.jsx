import React from "react";
import { Modal, Input, Form, Button, message } from "antd";
import { post } from "../../../../util/request";
import api from "../../../../api";

export default function CollectionModal(props) {
  const {
    isModalOpen,
    handleCancel,
    setSelectedArticle,
    getCollectionAndArticles,
    selectedCollection,
  } = props;

  const onFinish = values => {
    values.collection = selectedCollection.id;
    post(api.article.create, values).then(res => {
      if (res) {
        message.success("新建成功");
        getCollectionAndArticles();
        setSelectedArticle(res);
        handleCancel();
      }
    });
  };

  return (
    <Modal
      forceRender
      open={isModalOpen}
      maskStyle={{ backgroundColor: "transparent" }}
      footer={null}
      onCancel={handleCancel}
      width={400}
    >
      <Form
        style={{ marginTop: 30 }}
        onFinish={onFinish}
        name="add-article"
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 13,
        }}
      >
        <Form.Item
          label="文章名"
          name="title"
          rules={[
            {
              required: true,
              message: "请输入文章名",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 10,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
