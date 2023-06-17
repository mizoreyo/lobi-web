import React from "react";
import "./index.css";
import api from "../../api";
import { get, post, remove } from "../../util/request";
import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Note from "../Explore/Note";
import { Pagination, message } from "antd";
import { useSelector } from "react-redux";
import SubjectModal from "./SubjectModal";
import Follower from "../Follower";

export default function Subject() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [subject, setSubject] = useState(null);
  const [articleData, setArticleData] = useState(null);
  const { subjectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = useSelector(state => state.onlineUser.value);
  const [sub, setSub] = useState(false);
  const [isFollowerOpen, setIsFollowerOpen] = useState(false);

  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const showSubjectModal = () => {
    setIsSubjectModalOpen(true);
  };
  const handleSubjectCancel = () => {
    setIsSubjectModalOpen(false);
  };
  const showFollower = () => {
    setIsFollowerOpen(true);
  };
  const handleFollowerCancel = () => {
    setIsFollowerOpen(false);
  };

  const getSubStatus = () => {
    get(api.subscribe.status, { type: "SUBJECT", resource: subjectId }).then(res => {
      setSub(res);
    });
  };

  const createSub = () => {
    post(api.subscribe.create, { type: "SUBJECT", resource: subjectId }).then(res => {
      if (res) {
        message.success("关注成功");
        getSubStatus();
        getSubjectData();
      }
    });
  };

  const removeSub = () => {
    remove(api.subscribe.delete, { type: "SUBJECT", resource: subjectId }).then(res => {
      if (res) {
        message.success("取关成功");
        getSubStatus();
        getSubjectData();
      }
    });
  };

  // 判断页面资源是否为登录用户发布
  const isOwn = () => {
    return userInfo != null && subject != null && userInfo.id == subject.creator.id;
  };

  const getSubjectData = () => {
    get(`${api.subject.countInfo}/${subjectId}`).then(res => {
      if (res) {
        setSubject(res);
      }
    });
  };

  useEffect(() => {
    getSubjectData();
    getSubStatus();
    get(api.article.page, { subjectId, page, size }).then(res => {
      if (res) {
        setArticleData(res);
      }
    });
  }, [location, page]);

  const handleChange = pageNum => {
    setPage(pageNum);
  };

  useEffect(() => {
    getSubStatus();
  }, [userInfo]);

  return (
    <div className="subj-box">
      <div className="subjb-left">
        <div className="subjb-header">
          <div className="subjbh-left">
            <img src={subject ? (subject.logo ? subject.logo : "/asset/dft-subject.png") : "/asset/dft-avatar.jpg"} />
            <div>
              <div className="subjbh-name">{subject ? subject.name : ""}</div>
              <div className="subjbh-count">
                收录了{subject ? subject.articleCount : 0}篇文章 ·{" "}
                <span onClick={showFollower} style={{ cursor: "pointer" }}>
                  {subject ? subject.subCount : 0}人关注
                </span>
              </div>
            </div>
          </div>
          <div className="subjbh-right">
            {sub ? (
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
            {isOwn() ? (
              <div>
                <button onClick={showSubjectModal}>编辑</button>
                <SubjectModal
                  getSubjectData={getSubjectData}
                  id={subject.id}
                  isModalOpen={isSubjectModalOpen}
                  handleCancel={handleSubjectCancel}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="divider"></div>
        <ul className="exp-list">
          {articleData
            ? articleData.data.map(note => {
                return <Note {...note} key={`note-${note.id}`} />;
              })
            : ""}
        </ul>
        <div className="subjb-footer">
          <Pagination
            onChange={handleChange}
            current={page}
            pageSize={size}
            total={articleData ? articleData.total : 0}
          />
        </div>
      </div>
      <div className="subjb-right">
        <div>
          <div className="subjbr-h">专题描述</div>
          <p className="subjbr-t">{subject ? subject.descript : ""}</p>
        </div>
        <div className="divider"></div>
        <div>
          <div className="subjbr-h">创建者</div>
          <div className="sub-creator-b">
            <img
              src={
                subject
                  ? subject.creator.avatar
                    ? subject.creator.avatar
                    : "/asset/dft-avatar.jpg"
                  : "/asset/dft-avatar.jpg"
              }
              onClick={() => navigate(`/user/${subject ? subject.creator.id : ""}`)}
            />
            <div className="subjbr-name" onClick={() => navigate(`/user/${subject ? subject.creator.id : ""}`)}>
              {subject ? subject.creator.nickname : ""}
            </div>
          </div>
        </div>
        <div className="divider"></div>
        {/* {isOwn() ? <div className="subjbr-delete">删除专题</div> : ""} */}
      </div>
      <Follower
        type="SUBJECT"
        resId={subject ? subject.id : ""}
        isModalOpen={isFollowerOpen}
        handleCancel={handleFollowerCancel}
      ></Follower>
    </div>
  );
}
