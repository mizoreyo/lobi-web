import React, { useState } from "react";
import SearchArticle from "./SearchArticle";
import SearchUser from "./SearchUser";
import SearchSubject from "./SearchSubject";
import SearchCollection from "./SearchCollection";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import "./index.css";

export default function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get("type");
    const q = searchParams.get("q");
    setType(type);
    setQ(q);
  }, [location]);

  const handleClick = searchType => {
    navigate(`/search?type=${searchType}&q=${q}`);
  };

  return (
    <div className="sear-box">
      <div className="sear-left">
        <div
          className={type == "article" ? "sel-item sear-selected" : "sel-item"}
          onClick={() => handleClick("article")}
        >
          <div className="sel-icon">
            <i className="iconfont icon-ziliao"></i>
          </div>
          文章
        </div>
        <div
          className={type == "subject" ? "sel-item sear-selected" : "sel-item"}
          onClick={() => handleClick("subject")}
        >
          <div className="sel-icon">
            <i className="iconfont icon-fenlei"></i>
          </div>
          专题
        </div>
        <div className={type == "user" ? "sel-item sear-selected" : "sel-item"} onClick={() => handleClick("user")}>
          <div className="sel-icon">
            <i className="iconfont icon-shouye"></i>
          </div>
          用户
        </div>
        <div
          className={type == "collection" ? "sel-item sear-selected" : "sel-item"}
          onClick={() => handleClick("collection")}
        >
          <div className="sel-icon">
            <i className="iconfont icon-zixun"></i>
          </div>
          文集
        </div>
      </div>
      <div className="sear-right">
        {type == "article" ? (
          <SearchArticle q={q} />
        ) : type == "user" ? (
          <SearchUser q={q} />
        ) : type == "subject" ? (
          <SearchSubject q={q} />
        ) : (
          <SearchCollection q={q} />
        )}
      </div>
    </div>
  );
}
