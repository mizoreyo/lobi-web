import React, { useEffect, useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import { get, post, remove } from "../../util/request";
import moment from "moment/moment";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nord } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useSelector } from "react-redux";
import { message } from "antd";
import Comment from "./Comment";

import "./index.css";

export default function Article() {
  const [articleInfo, setArticleInfo] = useState({});
  const { authorInfo } = articleInfo;
  const [mostFiveViews, setMostFiveViews] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { articleId } = useParams();
  const [sub, setSub] = useState(false);
  const [like, setLike] = useState(false);
  const [thumb, setThumb] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const userInfo = useSelector(state => state.onlineUser.value);

  useEffect(() => {
    getLikeStatus();
    getThumbStatus();
    get(`${api.article.info}/${articleId}`).then(res => {
      if (res) {
        setArticleInfo(res);
        get(api.subscribe.status, { type: "USER", resource: res.authorInfo.id }).then(res => {
          if (res) {
            setSub(res);
          }
        });
        get(api.article.listByViews, { userId: res.authorInfo.id }).then(subRes => {
          setMostFiveViews(subRes);
        });
      }
    });
  }, [location]);

  const getArticleInfo = () => {
    get(`${api.article.info}/${articleId}`).then(res => {
      if (res) {
        setArticleInfo(res);
      }
    });
  };

  const getThumbStatus = () => {
    get(api.thumb.status, { article: articleId }).then(res => {
      if (res) {
        setThumb(res);
      }
    });
  };

  const createThumb = () => {
    post(api.thumb.create, { article: articleId }).then(res => {
      if (res) {
        getThumbStatus();
      }
    });
  };

  const deleteThumb = () => {
    remove(api.thumb.delete, { article: articleId }).then(res => {
      if (res) {
        getThumbStatus();
      }
    });
  };

  const getLikeStatus = () => {
    get(api.subscribe.status, { type: "ARTICLE", resource: articleId }).then(res => {
      if (res) {
        setLike(res);
      }
    });
  };

  const createLike = () => {
    post(api.subscribe.create, { type: "ARTICLE", resource: articleId }).then(res => {
      if (res) {
        getLikeStatus();
      }
    });
  };

  const removeLike = () => {
    remove(api.subscribe.delete, { type: "ARTICLE", resource: articleId }).then(res => {
      if (res) {
        getLikeStatus();
      }
    });
  };

  const getSubStatus = () => {
    if (authorInfo) {
      get(api.subscribe.status, { type: "USER", resource: authorInfo.id }).then(res => {
        setSub(res);
      });
    }
  };

  const createSub = () => {
    if (authorInfo) {
      post(api.subscribe.create, { type: "USER", resource: authorInfo.id }).then(res => {
        if (res) {
          message.success("关注成功");
          console.log(res);
          getSubStatus();
          getArticleInfo();
        }
      });
    }
  };

  const removeSub = () => {
    if (authorInfo) {
      remove(api.subscribe.delete, { type: "USER", resource: authorInfo.id }).then(res => {
        if (res) {
          message.success("取关成功");
          getSubStatus();
          getArticleInfo();
        }
      });
    }
  };

  // 判断页面资源是否为登录用户发布
  const isOwn = () => {
    return userInfo != null && authorInfo != null && userInfo.id == authorInfo.id;
  };

  useEffect(() => {
    getSubStatus();
    getLikeStatus();
    getThumbStatus();
  }, [userInfo]);

  return (
    <div className="ar-container">
      <div className="article">
        <h1>{articleInfo.title}</h1>
        <div className="ar-user">
          <div className="ar-avatar">
            <img
              style={{ cursor: "pointer" }}
              src={
                authorInfo ? (authorInfo.avatar ? authorInfo.avatar : "/asset/dft-avatar.jpg") : "/asset/dft-avatar.jpg"
              }
              alt="头像"
              onClick={() => navigate(authorInfo ? `/user/${authorInfo.id}` : "/")}
            />
          </div>
          <div className="ar-userinfo">
            <div className="ar-ui-top">
              <span
                style={{ cursor: "pointer" }}
                className="ar-ui-name"
                onClick={() => navigate(authorInfo ? `/user/${authorInfo.id}` : "/")}
              >
                {authorInfo ? authorInfo.nickname : ""}
              </span>
              {isOwn() ? (
                ""
              ) : sub ? (
                sub.status ? (
                  <button className="ar-ui-sub" onClick={removeSub}>
                    已关注
                  </button>
                ) : (
                  <button className="ar-ui-sub" onClick={createSub}>
                    关注
                  </button>
                )
              ) : (
                <button className="ar-ui-sub" onClick={createSub}>
                  关注
                </button>
              )}
            </div>
            <div className="ar-ui-down">
              <span className="ar-ui-updated">{moment(articleInfo.updated).format("YYYY.MM.DD hh:mm:ss")}</span>
            </div>
          </div>
        </div>
        <div className="markdown">
          <ReactMarkdown
            children={articleInfo.content}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, "")}
                    language={match ? match[1] : "text"}
                    PreTag="div"
                    style={nord}
                    {...props}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          />
        </div>
        <div className="divider" style={{ marginTop: 20, marginBottom: 50 }}></div>
        <Comment setCommentCount={setCommentCount} article={articleId} />
      </div>
      <div className="ar-right">
        <div className="arr-user-box">
          <div className="arr-user-info">
            <img
              style={{ cursor: "pointer" }}
              src={
                authorInfo ? (authorInfo.avatar ? authorInfo.avatar : "/asset/dft-avatar.jpg") : "/asset/dft-avatar.jpg"
              }
              alt="头像"
              onClick={() => navigate(authorInfo ? `/user/${authorInfo.id}` : "/")}
            />
            <div className="arr-u-right">
              <div className="arrur-top">
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(authorInfo ? `/user/${authorInfo.id}` : "/")}
                >
                  {authorInfo ? authorInfo.nickname : ""}
                </span>
                {isOwn() ? (
                  ""
                ) : sub ? (
                  sub.status ? (
                    <button className="ar-ui-sub arrur-sub" onClick={removeSub}>
                      已关注
                    </button>
                  ) : (
                    <button className="ar-ui-sub arrur-sub" onClick={createSub}>
                      关注
                    </button>
                  )
                ) : (
                  <button className="ar-ui-sub arrur-sub" onClick={createSub}>
                    关注
                  </button>
                )}
              </div>
              <div className="arrur-down">
                <span>{authorInfo ? `粉丝数 ${authorInfo.subCount} | 文章数 ${authorInfo.articleCount}` : ""}</span>
              </div>
            </div>
          </div>
          <div className="divider" />
          {mostFiveViews.map(a => {
            return (
              <div className="arr-item" key={`view-${a.id}`}>
                <a className="arr-link" onClick={() => navigate(`/article/${a.id}`)}>
                  {a.title}
                </a>
                <div className="arr-views">阅读 {a.views}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="ar-left-bar">
        <div className="arlb-b">
          {thumb ? (
            thumb.status ? (
              <div className="arlb-icon" onClick={deleteThumb}>
                <i className="iconfont icon-zan"></i>
              </div>
            ) : (
              <div className="arlb-icon" onClick={createThumb}>
                <i className="iconfont icon-zan1"></i>
              </div>
            )
          ) : (
            <div className="arlb-icon" onClick={createThumb}>
              <i className="iconfont icon-zan1"></i>
            </div>
          )}
          <div className="arlb-count">{thumb ? thumb.count : 0}赞</div>
        </div>
        <div className="arlb-b">
          {like ? (
            like.status ? (
              <div className="arlb-icon" onClick={removeLike}>
                <i className="iconfont icon-xihuan"></i>
              </div>
            ) : (
              <div className="arlb-icon" onClick={createLike}>
                <i className="iconfont icon-xihuan1"></i>
              </div>
            )
          ) : (
            <div className="arlb-icon" onClick={createLike}>
              <i className="iconfont icon-xihuan1"></i>
            </div>
          )}
          <div className="arlb-count">{like ? like.count : 0}喜欢</div>
        </div>
        <div className="arlb-b">
          <div className="arlb-icon">
            <i className="iconfont icon-xiaoxi"></i>
          </div>
          <div className="arlb-count">{commentCount}评论</div>
        </div>
      </div>
    </div>
  );
}
