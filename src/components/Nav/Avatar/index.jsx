import React from "react";
import tokenUtil from "../../../util/tokenUtil";
import { useNavigate } from "react-router-dom";

import "./index.css";
import { message } from "antd";

export default function Avatar(props) {
  const { userInfo } = props;
  const { avatar } = userInfo;
  const navigate = useNavigate();

  const exit = () => {
    tokenUtil.removeToken();
    message.success("退出登录成功");
  };

  return (
    <div className="av-c">
      <img src={avatar ? avatar : "/asset/dft-avatar.jpg"} alt="头像" />
      <div className="av-drop-down">
        <ul className="av-b-list">
          <li className="av-b-i" onClick={() => navigate(`/user/${userInfo.id}`)}>
            我的主页
          </li>
          <li className="av-b-i" onClick={exit}>
            退出
          </li>
        </ul>
      </div>
    </div>
  );
}
