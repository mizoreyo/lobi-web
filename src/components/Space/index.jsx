import React, { useEffect, useState } from "react";
import "./index.css";
import api from "../../api";
import { get, post, remove } from "../../util/request";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Pagination, message } from "antd";
import SubjectModal from "./SubjectModal";
import { useSelector } from "react-redux";
import UserModal from "./UserModal";
import Follower from "../Follower";

export default function Space() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [articleData, setArticleData] = useState(null);
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = useSelector(state => state.onlineUser.value);
  const [sub, setSub] = useState(false);

  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isFollowerOpen, setIsFollowerOpen] = useState(false);
  const showSubjectModal = () => {
    setIsSubjectModalOpen(true);
  };
  const handleSubjectCancel = () => {
    setIsSubjectModalOpen(false);
  };
  const showUserModal = () => {
    setIsUserModalOpen(true);
  };
  const handleUserCancel = () => {
    setIsUserModalOpen(false);
  };
  const showFollower = () => {
    setIsFollowerOpen(true);
  };
  const handleFollowerCancel = () => {
    setIsFollowerOpen(false);
  };

  const getSubStatus = () => {
    get(api.subscribe.status, { type: "USER", resource: userId }).then(res => {
      if (res) {
        setSub(res);
      }
    });
  };

  const createSub = () => {
    post(api.subscribe.create, { type: "USER", resource: userId }).then(res => {
      if (res) {
        message.success("关注成功");
        getSubStatus();
        getUserData();
      }
    });
  };

  const removeSub = () => {
    remove(api.subscribe.delete, { type: "USER", resource: userId }).then(res => {
      if (res) {
        message.success("取关成功");
        getSubStatus();
        getUserData();
      }
    });
  };

  // 判断页面资源是否为登录用户发布
  const isOwn = () => {
    return userInfo != null && userInfo.id == userId;
  };

  const getUserData = () => {
    get(`${api.user.countInfo}/${userId}`).then(res => {
      if (res) {
        setUser(res);
      }
    });
  };

  useEffect(() => {
    getUserData();
    getSubStatus();
    get(api.article.page, { userId, page, size }).then(res => {
      if (res) {
        setArticleData(res);
      }
    });
  }, [location, page]);

  useEffect(() => {
    getSubStatus();
  }, [userInfo]);

  const handleChange = pageNum => {
    setPage(pageNum);
  };

  return (
    <div className="space-box">
      <div className="space-left">
        <div className="space-header">
          <div className="sph-left">
            <img src={user ? (user.avatar ? user.avatar : "/asset/dft-avatar.jpg") : "/asset/dft-avatar.jpg"} />
            <div className="sph-info">
              <div className="sph-name">{user ? user.nickname : "未知"}</div>
              <div className="sphi-list">
                <div className="sphi-item">
                  <p>{user ? user.followCount : 0}</p>
                  关注
                </div>
                <div className="sphi-item" onClick={showFollower} style={{ cursor: "pointer" }}>
                  <p>{user ? user.subCount : 0}</p>
                  粉丝
                </div>
                <div className="sphi-item">
                  <p>{user ? user.articleCount : 0}</p>
                  文章
                </div>
              </div>
            </div>
          </div>
          <div className="sph-right">
            {isOwn() ? (
              <div>
                <button onClick={showUserModal}>编辑资料</button>
                <UserModal
                  getUserData={getUserData}
                  id={userInfo.id}
                  isModalOpen={isUserModalOpen}
                  handleCancel={handleUserCancel}
                />
              </div>
            ) : sub ? (
              sub.status ? (
                <button className="green" onClick={removeSub}>
                  已关注
                </button>
              ) : (
                <button onClick={createSub}>关注</button>
              )
            ) : (
              <button onClick={createSub}>关注</button>
            )}
          </div>
        </div>
        <ul className="spa-list">
          {articleData
            ? articleData.data.map(a => {
                return (
                  <li className="spa-item" key={`article-${a.id}`}>
                    <div className="spa-title" onClick={() => navigate(`/article/${a.id}`)}>
                      {a.title}
                    </div>
                    <p className="spa-summary">{a.summary}</p>
                  </li>
                );
              })
            : ""}
        </ul>
        <div className="sp-footer">
          <Pagination
            onChange={handleChange}
            current={page}
            pageSize={size}
            total={articleData ? articleData.total : 0}
          />
        </div>
      </div>
      <div className="space-right">
        <div className="spr-intro-box">
          <div className="spr-intro-h">个人介绍</div>
          <div className="spr-intro-t">{user ? user.introduction : ""}</div>
        </div>
        <div className="divider"></div>
        <div>
          <div className="spr-intro-h">文集</div>
          <ul className="spr-c-list">
            {user
              ? user.collections.map(c => {
                  return (
                    <li
                      className="spr-c-item"
                      key={`collection-${c.id}`}
                      onClick={() => navigate(`/collection/${c.id}`)}
                    >
                      <i className="iconfont icon-zixun"></i>
                      {c.name}
                    </li>
                  );
                })
              : ""}
          </ul>
        </div>
        <div className="divider"></div>
        <div>
          <div className="spr-intro-h">创建的专题</div>
          <ul className="spr-subj-list">
            {user
              ? user.subjects.map(s => {
                  return (
                    <li className="spr-subj-item" key={`subject-${s.id}`}>
                      <img
                        src={s.logo ? s.logo : "/asset/dft-subject.png"}
                        onClick={() => navigate(`/subject/${s.id}`)}
                      />
                      <div onClick={() => navigate(`/subject/${s.id}`)}>{s.name}</div>
                    </li>
                  );
                })
              : ""}
          </ul>
          {isOwn() ? (
            <div>
              <div className="spr-new-subj" onClick={showSubjectModal}>
                + 创建新的专题
              </div>
              <SubjectModal
                getSubjectData={getUserData}
                isModalOpen={isSubjectModalOpen}
                handleCancel={handleSubjectCancel}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <Follower
        type="USER"
        resId={user ? user.id : ""}
        isModalOpen={isFollowerOpen}
        handleCancel={handleFollowerCancel}
      ></Follower>
    </div>
  );
}
