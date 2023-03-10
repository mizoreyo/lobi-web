import React from "react";

import "./index.css";

export default function Nav() {
  return (
    <div className="nav-box">
      <div className="logo-box">
        <img className="logo" src="/logo.png" alt="LOGO" />
      </div>
      <div className="nav-menu-c">
        <div className="nav-menu">
          <ul className="menu-items">
            <li className="menu-item">发现</li>
            <li className="menu-item">专题</li>
            <li className="menu-item">关注</li>
            <li className="menu-item">IT技术</li>
            <li className="menu-item">消息</li>
          </ul>
          <input className="search-input" placeholder="搜索" type="text" />
          <a className="search-btn" href="javascript:void(null)">
            <i className="iconfont icon-sousuo"></i>
          </a>
        </div>
      </div>
      <div className="nav-bar">
        <button className="login-b">登录</button>
        <button className="reg-b">注册</button>
        <button className="write-b">写文章</button>
      </div>
    </div>
  );
}
