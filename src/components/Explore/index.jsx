import React, { useEffect, useState, useRef } from "react";
import Note from "./Note";
import { get } from "../../util/request";
import api from "../../api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./index.css";

export default function Explore() {
  const [notes, setNotes] = useState(null);
  const [authors, setAuthors] = useState([]);
  const defaultSize = 5;
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(defaultSize);
  const userInfo = useSelector(state => state.onlineUser.value);
  const notesRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    console.log(notesRef.current);
    // 判断是否到达底部
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      if (notesRef.current == null || notesRef.current.data.length >= notesRef.current.total) {
        return;
      }
      setSize(size + defaultSize);
    }
  };

  const getArticleData = () => {
    get(api.article.recommend, { page, size }).then(res => {
      if (res) {
        console.log(res);
        setNotes(res);
        notesRef.current = res;
      }
    });
  };

  useEffect(() => {
    getArticleData();
  }, [size]);

  useEffect(() => {
    get(api.user.recommend).then(res => {
      if (res) {
        console.log(res);
        setAuthors(res);
      }
    });
  }, [userInfo]);

  return (
    <div className="explore-box">
      <ul className="exp-list">
        {notes
          ? notes.data.map(note => {
              return <Note {...note} key={`note-${note.id}`} />;
            })
          : ""}
      </ul>
      <div className="exp-right">
        <div className="board">
          <a href="/">
            <img className="board-banner" src="/asset/banner-daily.png" alt="日更挑战" />
          </a>
          <a href="/">
            <img className="board-banner" src="/asset/banner-prefer.png" alt="优选连载" />
          </a>
        </div>
        <div className="author-rec">
          <div className="rec-h">推荐作者</div>
          <ul className="author-list">
            {authors.map(a => {
              return (
                <li className="al-item" key={`author-${a.id}`}>
                  <div className="al-left">
                    <img
                      className="al-avatar"
                      onClick={() => navigate(`/user/${a.id}`)}
                      src={a.avatar ? a.avatar : "/asset/dft-avatar.jpg"}
                      alt="头像"
                    />
                    <div className="author-info">
                      <div className="ai-name" onClick={() => navigate(`/user/${a.id}`)}>
                        {a.nickname}
                      </div>
                      <div className="ai-desc">
                        {a.subCount}人关注了他 · 写了{a.articleCount}篇文章
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
