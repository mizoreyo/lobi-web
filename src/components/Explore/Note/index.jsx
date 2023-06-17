import React from "react";
import { useNavigate } from "react-router-dom";

export default function Note(props) {
  const { id, title, summary, authorInfo } = props;
  const navigate = useNavigate();

  const navToArticle = () => {
    navigate(`/article/${id}`);
  };

  const navToAuthor = () => {
    navigate(`/user/${authorInfo.id}`);
  };

  return (
    <li className="e-l-item">
      <a className="ar-title" onClick={navToArticle} dangerouslySetInnerHTML={{ __html: title }}></a>
      <span className="ar-summary" dangerouslySetInnerHTML={{ __html: summary }}></span>
      <div className="meta">
        <a onClick={navToAuthor}>{authorInfo.nickname}</a>
      </div>
    </li>
  );
}
