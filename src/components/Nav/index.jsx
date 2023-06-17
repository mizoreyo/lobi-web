import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavButton from "./NavButton";
import { get } from "../../util/request";
import api from "../../api";
import Avatar from "./Avatar";
import { useSelector, useDispatch } from "react-redux";
import { setOnlineUser } from "../../store/features/onlineUserSlice";
import { down } from "../../store/features/userDefultSlice";
import { notification } from "antd";

import "./index.css";

export default function Nav(props) {
  const { showLogin, showRegister } = props;
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const userInfo = useSelector(state => state.onlineUser.value);
  const userEdited = useSelector(state => state.userEdited.value);
  const dispatch = useDispatch();
  const setUserInfo = userInfo => {
    dispatch(setOnlineUser(userInfo));
    dispatch(down());
  };

  const getUserInfo = () => {
    get(api.admin.info).then(res => {
      setUserInfo(res);
      if (res) {
        get(api.message.hasUnread).then(res => {
          if (res) {
            notification.info({
              message: "有未读消息",
              onClick: () => {
                navigate("/message");
              },
            });
          }
        });
      }
    });
  };

  useEffect(() => {
    window.addEventListener("tokenChange", getUserInfo);
    return () => {
      window.removeEventListener("tokenChange", getUserInfo);
    };
  }, []);

  useEffect(() => {
    getUserInfo();
  }, [userEdited]);

  const navToSearch = () => {
    navigate(`/search?type=article&q=${q}`);
  };

  const handleChange = e => {
    setQ(e.target.value);
  };

  return (
    <div className="nav-box">
      <div className="logo-box">
        <img className="logo" src="/logo.png" alt="LOGO" />
      </div>
      <div className="nav-menu-c">
        <div className="nav-menu">
          <ul className="menu-items">
            <NavButton name="发现" path="/" />
            <NavButton name="关注" path="/subscribe" />
            <NavButton name="消息" path="/message" />
          </ul>
          <input onChange={e => handleChange(e)} className="search-input" placeholder="搜索" type="text" />
          <a className={q == "" ? "search-btn disabled" : "search-btn"} onClick={navToSearch}>
            <i className="iconfont icon-sousuo"></i>
          </a>
        </div>
      </div>
      <div className="nav-bar">
        {userInfo ? (
          <Avatar userInfo={userInfo} />
        ) : (
          <div>
            <button className="login-b" onClick={showLogin}>
              登录
            </button>
            <button className="reg-b" onClick={showRegister}>
              注册
            </button>
          </div>
        )}
        <button
          className="write-b"
          onClick={() => {
            navigate("/write");
          }}
        >
          写文章
        </button>
      </div>
    </div>
  );
}
