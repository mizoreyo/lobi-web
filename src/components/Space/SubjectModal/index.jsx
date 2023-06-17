import React from "react";
import { Modal, Input, Form, Button, message } from "antd";
import api from "../../../api";
import { post } from "../../../util/request";

export default function SubjectModal(props) {
  const { isModalOpen, handleCancel, getSubjectData } = props;

  const onFinish = values => {
    post(api.subject.create, values).then(res => {
      if (res) {
        message.success("创建成功");
        getSubjectData();
        handleCancel();
      }
    });
  };

  return (
    <Modal
      width={400}
      open={isModalOpen}
      onCancel={handleCancel}
      maskStyle={{ backgroundColor: "transparent" }}
      footer={null}
    >
      <Form
        style={{ marginTop: 30 }}
        onFinish={onFinish}
        name="add-subject"
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 13,
        }}
      >
        <Form.Item
          label="专题名"
          name="name"
          rules={[
            {
              required: true,
              message: "请输入专题名",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="专题描述"
          name="descript"
          rules={[
            {
              required: true,
              message: "请输入专题描述",
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
