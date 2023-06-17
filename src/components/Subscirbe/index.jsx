import React from "react";
import { useState, useEffect } from "react";
import UserSub from "./UserSub";
import CollectionSub from "./CollectionSub";
import SubjectSub from "./SubjectSub";
import ArticleSub from "./ArticleSub";
import "./index.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

export default function Subscribe() {
  const [type, setType] = useState("USER");
  const navigate = useNavigate();

  const userInfo = useSelector(state => state.onlineUser.value);
  const isDefaultUser = useSelector(state => state.userDefault.value);

  useEffect(() => {
    console.log(userInfo);
    if (userInfo == null && !isDefaultUser) {
      message.error("请先登录");
      navigate("/");
    }
  }, [userInfo]);

  return (
    <div className="subcr-box">
      <div className="scr-left">
        <div className={type == "USER" ? "scrl-item scrl-selected" : "scrl-item"} onClick={() => setType("USER")}>
          <div className="scrl-icon">
            <i className="iconfont icon-shouye"></i>
          </div>
          关注用户
        </div>
        <div className={type == "SUBJECT" ? "scrl-item scrl-selected" : "scrl-item"} onClick={() => setType("SUBJECT")}>
          <div className="scrl-icon">
            <i className="iconfont icon-fenlei"></i>
          </div>
          关注专题
        </div>
        <div
          className={type == "COLLECTION" ? "scrl-item scrl-selected" : "scrl-item"}
          onClick={() => setType("COLLECTION")}
        >
          <div className="scrl-icon">
            <i className="iconfont icon-zixun"></i>
          </div>
          关注文集
        </div>
        <div className={type == "ARTICLE" ? "scrl-item scrl-selected" : "scrl-item"} onClick={() => setType("ARTICLE")}>
          <div className="scrl-icon">
            <i className="iconfont icon-xihuan"></i>
          </div>
          我喜欢的文章
        </div>
      </div>
      <div className="scr-right">
        {userInfo ? (
          type == "USER" ? (
            <UserSub />
          ) : type == "COLLECTION" ? (
            <CollectionSub />
          ) : type == "SUBJECT" ? (
            <SubjectSub />
          ) : (
            <ArticleSub />
          )
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
