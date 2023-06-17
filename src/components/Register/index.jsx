import { Modal, Form, Button, Input, message } from "antd";
import React from "react";
import { post } from "../../util/request";
import api from "../../api";

import "./index.css";

export default function Register(props) {
  const { open, handleCancel } = props;
  const onFinish = values => {
    post(api.admin.register, values).then(res => {
      if (res) {
        message.success("注册成功");
        handleCancel();
      }
    });
  };
  const onFinishFailed = () => {
    message.info("请完善表单信息");
  };
  return (
    <Modal width={400} maskStyle={{ backgroundColor: "transparent" }} footer={null} open={open} onCancel={handleCancel}>
      <h2 className="register-header">落笔 | 注册</h2>
      <Form
        name="register"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 13,
        }}
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[
            {
              required: true,
              message: "请输入用户名",
            },
            { min: 3, message: "用户名长度至少为3个字符" },
            { max: 20, message: "用户名长度最多为20个字符" },
            { pattern: /^[a-zA-Z0-9]+$/, message: "只能输入数字和字母" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[
            {
              required: true,
              message: "请输入密码",
            },
            { min: 8, message: "密码长度至少为8个字符" },
            { max: 20, message: "密码长度最多为20个字符" },
            {
              pattern: /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+|~=\-{}\[\]:;"'<>,.?\/]*$/,
              message: "密码必须包含至少一个字母和一个数字",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="确认密码"
          name="rePassword"
          dependencies={["password"]}
          rules={[
            {
              required: true,
              message: "请再次输入密码",
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("新密码与确认新密码不同！");
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="昵称"
          name="nickname"
          rules={[
            {
              required: true,
              message: "请输入昵称",
            },
            { max: 20, message: "昵称长度最多为20个字符" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            {
              type: "email",
              message: "请输入正确的邮箱",
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
            注册
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
