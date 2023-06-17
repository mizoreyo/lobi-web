import { Modal, message } from "antd";
import React, { useState } from "react";
import { post } from "../../util/request";
import api from "../../api";
import tokenUtil from "../../util/tokenUtil";

import "./index.css";

export default function Login(props) {
  const [loginParam, setLoginParam] = useState({ username: "", password: "" });
  const { open, handleCancel } = props;
  const [rememberChecked, setRememberChecked] = useState(false);

  const setUsername = event => {
    setLoginParam({
      username: event.target.value,
      password: loginParam.password,
    });
  };

  const setPassword = event => {
    setLoginParam({
      username: loginParam.username,
      password: event.target.value,
    });
  };

  const handleSubmit = () => {
    if (loginParam.username == "") {
      message.info("请输入用户名");
      return;
    }
    if (loginParam.password == "") {
      message.info("请输入密码");
      return;
    }
    post(api.admin.login, loginParam).then(res => {
      if (res) {
        const token = res.tokenHead + res.token;
        if (rememberChecked) {
          tokenUtil.setLocalToken(token);
        } else {
          tokenUtil.setSessionToken(token);
        }
        message.success("登录成功");
        handleCancel();
      }
    });
  };

  const handleRememberChecked = event => {
    setRememberChecked(event.target.checked);
  };

  return (
    <Modal width={400} maskStyle={{ backgroundColor: "transparent" }} footer={null} open={open} onCancel={handleCancel}>
      <h2 className="login-header">落笔 | 登录</h2>
      <form className="login-form">
        <input className="login-input" type="text" onChange={setUsername} placeholder="用户名" />
        <input className="login-input" type="password" onChange={setPassword} placeholder="密码" />
        <div className="login-m">
          <div className="login-r">
            <input id="remember" type="checkbox" onClick={handleRememberChecked} />
            <label htmlFor="remember">记住我</label>
          </div>
          <a>忘记密码</a>
        </div>
        <input className="login-submit" type="button" value={"登录"} onClick={handleSubmit} />
      </form>
    </Modal>
  );
}
