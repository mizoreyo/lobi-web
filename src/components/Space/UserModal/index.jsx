import React, { useEffect } from "react";
import { Modal, Input, Form, Button, message, Upload } from "antd";
import { useState, useRef } from "react";
import api from "../../../api";
import { get, put } from "../../../util/request";
import ImgCrop from "antd-img-crop";
import { useDispatch } from "react-redux";
import { reverse } from "../../../store/features/userEditedSlice";
import "./index.css";

export default function UserModal(props) {
  const { isModalOpen, handleCancel, id, getUserData } = props;
  const [imgUrl, setImgUrl] = useState(null);
  const [ossData, setOssData] = useState(null);
  const [user, setUser] = useState(null);
  const url = useRef(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // 获取oss授权
  const init = async () => {
    const result = await get(api.oss.policy);
    console.log("获取授权");
    setOssData(result);
  };

  useEffect(() => {
    init();
    get(`${api.user.info}/${id}`).then(res => {
      if (res) {
        setUser(res);
        form.setFieldsValue({
          nickname: res.nickname,
          introduction: res.introduction,
          email: res.email,
        });
        setImgUrl(res.avatar);
      }
    });
  }, []);

  const getExtraData = file => ({
    key: url.current,
    OSSAccessKeyId: ossData?.accessId,
    policy: ossData?.policy,
    Signature: ossData?.signature,
  });

  const beforeUpload = async file => {
    if (!ossData) return false;
    // 请求授权
    const expire = Number(ossData.expire) * 1000;
    if (expire < Date.now()) {
      await init();
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
    url.current = ossData.dir + Date.now() + file.name.slice(file.name.lastIndexOf("."));
    return file;
  };

  const handleChange = ({ file }) => {
    if (file.status == "done") {
      setImgUrl(`${ossData.host}/${url.current}`);
    }
  };

  const onFinish = values => {
    let params = { ...values };
    params.avatar = imgUrl;
    params.id = user ? user.id : "";
    console.log(params);
    put(api.user.edit, params).then(res => {
      if (res) {
        message.success("修改成功");
        getUserData();
        dispatch(reverse());
        handleCancel();
      }
    });
  };

  return (
    <Modal
      forceRender
      width={400}
      open={isModalOpen}
      onCancel={handleCancel}
      maskStyle={{ backgroundColor: "transparent" }}
      footer={null}
    >
      <ImgCrop rotationSlider>
        <Upload
          name="file"
          listType="picture-circle"
          showUploadList={false}
          action={ossData?.host}
          beforeUpload={beforeUpload}
          data={getExtraData}
          onChange={handleChange}
        >
          <img
            src={imgUrl ? imgUrl : "/asset/dft-avatar.jpg"}
            alt="avatar"
            style={{
              width: "100%",
              borderRadius: 999,
            }}
          />
        </Upload>
      </ImgCrop>
      <Form
        form={form}
        style={{ marginTop: 30 }}
        name="add-subject"
        onFinish={onFinish}
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 13,
        }}
      >
        <Form.Item
          label="昵称"
          name="nickname"
          rules={[
            {
              required: true,
              message: "请输入昵称",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="个人介绍" name="introduction">
          <Input />
        </Form.Item>
        <Form.Item label="邮箱" name="email">
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
