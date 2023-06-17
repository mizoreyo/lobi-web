import React, { useEffect } from "react";
import { Modal, Input, Form, Button, message } from "antd";
import { post, put } from "../../../../util/request";
import api from "../../../../api";

export default function CollectionModal(props) {
  const { isModalOpen, handleCancel, setSelectedCollection, getCollectionAndArticles, cModalMode, cEditObj } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    if (cModalMode == "edit") {
      form.setFieldsValue({ name: cEditObj.name });
    } else {
      form.setFieldsValue({ name: "" });
    }
  });

  const onFinish = values => {
    if (cModalMode === "new") {
      newCollection(values);
    } else {
      editCollection(values);
    }
  };

  const newCollection = values => {
    post(api.collection.create, values).then(res => {
      if (res) {
        message.success("新建成功");
        getCollectionAndArticles();
        setSelectedCollection(res);
        handleCancel();
      }
    });
  };

  const editCollection = values => {
    values.id = cEditObj.id;
    put(api.collection.edit, values).then(res => {
      if (res) {
        message.success("修改成功");
        getCollectionAndArticles();
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
        form={form}
        style={{ marginTop: 30 }}
        onFinish={onFinish}
        name="add-collection"
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 13,
        }}
      >
        <Form.Item
          label="文集名"
          name="name"
          rules={[
            {
              required: true,
              message: "请输入文集名",
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
