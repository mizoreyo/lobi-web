import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { get } from "../../util/request";
import api from "../../api";
import Editor from "./Editor";
import Menu from "./Menu";
import { useSelector } from "react-redux";

import "./index.css";

export default function Write() {
  const navigate = useNavigate();
  const [cArticleData, setCArticleData] = useState([]);
  const [article, setArticle] = useState(null);
  const userInfo = useSelector(state => state.onlineUser.value);
  const isDefaultUser = useSelector(state => state.userDefault.value);

  useEffect(() => {
    if (userInfo == null && !isDefaultUser) {
      message.error("请先登录");
      navigate("/");
    } else {
      getCollectionAndArticles();
    }
  }, [userInfo]);

  const getCollectionAndArticles = () => {
    get(api.collection.infoList).then(res => {
      console.log(res);
      if (res) {
        setCArticleData(res);
      }
    });
  };

  /**
   * 监听文集文章数据，实时更新编辑器中文章
   */
  useEffect(() => {
    if (article) {
      console.log(cArticleData);
      cArticleData.forEach(c => {
        c.articles.forEach(a => {
          if (a.id == article.id) {
            setArticle(a);
          }
        });
      });
    }
  }, [cArticleData]);
  return userInfo == null && !isDefaultUser ? (
    ""
  ) : (
    <div className="write-box">
      <Menu
        getCollectionAndArticles={getCollectionAndArticles}
        cArticleData={cArticleData}
        setArticle={setArticle}
      ></Menu>
      <Editor article={article} setArticle={setArticle} getCollectionAndArticles={getCollectionAndArticles} />
    </div>
  );
}
