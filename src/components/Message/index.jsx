import React from "react";
import { useState, useEffect } from "react";
import CommentMes from "./CommentMes";
import LikeMes from "./LikeMes";
import SubscribeMes from "./SubscribeMes";
import ThumbMes from "./ThumbMes";
import "./index.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

export default function Message() {
  const [type, setType] = useState("COMMENT");

  const navigate = useNavigate();

  const userInfo = useSelector(state => state.onlineUser.value);
  const isDefaultUser = useSelector(state => state.userDefault.value);

  useEffect(() => {
    if (userInfo == null && !isDefaultUser) {
      message.error("请先登录");
      navigate("/");
    }
  }, [userInfo]);

  return (
    <div className="mes-box">
      <div className="mesb-left">
        <div className={type == "COMMENT" ? "mes-item mes-selected" : "mes-item"} onClick={() => setType("COMMENT")}>
          <div className="mes-icon">
            <i className="iconfont icon-pinglun"></i>
          </div>
          评论
        </div>
        <div className={type == "THUMB" ? "mes-item mes-selected" : "mes-item"} onClick={() => setType("THUMB")}>
          <div className="mes-icon">
            <i className="iconfont icon-zan1"></i>
          </div>
          点赞
        </div>
        <div
          className={type == "SUBSCRIBE" ? "mes-item mes-selected" : "mes-item"}
          onClick={() => setType("SUBSCRIBE")}
        >
          <div className="mes-icon">
            <i className="iconfont icon-jieban"></i>
          </div>
          关注
        </div>
        <div className={type == "LIKE" ? "mes-item mes-selected" : "mes-item"} onClick={() => setType("LIKE")}>
          <div className="mes-icon">
            <i className="iconfont icon-xihuan1"></i>
          </div>
          喜欢
        </div>
      </div>
      <div className="mesb-right">
        {userInfo ? (
          type == "COMMENT" ? (
            <CommentMes />
          ) : type == "THUMB" ? (
            <ThumbMes />
          ) : type == "SUBSCRIBE" ? (
            <SubscribeMes />
          ) : (
            <LikeMes />
          )
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
