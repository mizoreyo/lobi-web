import React from "react";
import "./index.css";
import api from "../../api";
import { get, post, remove } from "../../util/request";
import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Pagination, message } from "antd";
import { useSelector } from "react-redux";
import Follower from "../Follower";

export default function Collection() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [collection, setCollection] = useState(null);
  const [articleData, setArticleData] = useState(null);
  const { collectionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [sub, setSub] = useState(false);
  const userInfo = useSelector(state => state.onlineUser.value);
  const [isFollowerOpen, setIsFollowerOpen] = useState(false);

  const showFollower = () => {
    setIsFollowerOpen(true);
  };
  const handleFollowerCancel = () => {
    setIsFollowerOpen(false);
  };

  useEffect(() => {
    getSubStatus();
    getCollectionData();
    get(api.article.page, { collectionId, page, size }).then(res => {
      if (res) {
        setArticleData(res);
      }
    });
  }, [location, page]);

  const getCollectionData = () => {
    get(`${api.collection.countInfo}/${collectionId}`).then(res => {
      if (res) {
        setCollection(res);
      }
    });
  };

  const handleChange = pageNum => {
    setPage(pageNum);
  };

  const getSubStatus = () => {
    get(api.subscribe.status, { type: "COLLECTION", resource: collectionId }).then(res => {
      setSub(res);
    });
  };

  const createSub = () => {
    post(api.subscribe.create, { type: "COLLECTION", resource: collectionId }).then(res => {
      if (res) {
        message.success("关注成功");
        getSubStatus();
        getCollectionData();
      }
    });
  };

  const removeSub = () => {
    remove(api.subscribe.delete, { type: "COLLECTION", resource: collectionId }).then(res => {
      if (res) {
        message.success("取关成功");
        getSubStatus();
        getCollectionData();
      }
    });
  };

  useEffect(() => {
    getSubStatus();
  }, [userInfo]);

  return (
    <div className="collection-box">
      <div className="cbox-left">
        <div className="cbx-header">
          <div className="cbxh-left">
            <div className="cbx-icon">
              <i className="iconfont icon-zixun"></i>
            </div>
            <div>
              <div className="cbx-name">{collection ? collection.name : ""}</div>
              <div className="cbx-count">
                {collection ? collection.articleCount : 0}篇文章 ·{" "}
                <span onClick={showFollower} style={{ cursor: "pointer" }}>
                  {collection ? collection.subCount : 0}人关注
                </span>
              </div>
            </div>
          </div>
          {sub ? (
            sub.status ? (
              <button className="green cbx-sub-b" onClick={removeSub}>
                已关注
              </button>
            ) : (
              <button className="cbx-sub-b" onClick={createSub}>
                关注
              </button>
            )
          ) : (
            <button className="cbx-sub-b" onClick={createSub}>
              关注
            </button>
          )}
        </div>
        <div className="divider"></div>
        <ul className="cbx-ars">
          {articleData
            ? articleData.data.map(a => {
                return (
                  <li className="cbxa-item" key={`article-${a.id}`}>
                    <div className="cbxa-title" onClick={() => navigate(`/article/${a.id}`)}>
                      {a.title}
                    </div>
                    <p className="cbxa-summary">{a.summary}</p>
                  </li>
                );
              })
            : ""}
        </ul>
        <div className="cbx-footer">
          <Pagination
            onChange={handleChange}
            current={page}
            pageSize={size}
            total={articleData ? articleData.total : 0}
          />
        </div>
      </div>
      <div className="cbox-right">
        <div className="cbx-subh">文集作者</div>
        <div className="cbx-creator-b">
          <img
            src={
              collection
                ? collection.creator.avatar
                  ? collection.creator.avatar
                  : "/asset/dft-avatar.jpg"
                : "/asset/dft-avatar.jpg"
            }
            onClick={() => navigate(`/user/${collection ? collection.creator.id : ""}`)}
          />
          <div className="cbxc-name" onClick={() => navigate(`/user/${collection ? collection.creator.id : ""}`)}>
            {collection ? collection.creator.nickname : ""}
          </div>
        </div>
        <div className="divider"></div>
      </div>
      <Follower
        type="SUBJECT"
        resId={collection ? collection.id : ""}
        isModalOpen={isFollowerOpen}
        handleCancel={handleFollowerCancel}
      ></Follower>
    </div>
  );
}
