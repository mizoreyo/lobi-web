import React from "react";
import "./index.css";
import moment from "moment";
import CommentInput from "../CommentInput";
import { useNavigate } from "react-router-dom";

export default function CommentItem(props) {
  const { comment, showInput, changeShowInput, getComment, article } = props;
  const navigate = useNavigate();

  return (
    <li className="cmi-item-box">
      <img
        src={comment.avatar ? comment.avatar : "/asset/dft-avatar.jpg"}
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/user/${comment.user}`)}
      />
      <div className="cmitem-right">
        <div style={{ cursor: "pointer" }} onClick={() => navigate(`/user/${comment.user}`)}>
          {comment.nickname}
        </div>
        <div className="cmitem-date">{moment(comment.date).format("YYYY.MM.DD hh:mm:ss")}</div>
        <p className="cmi-content">{comment.content}</p>
        <span className="cmi-reply-b" onClick={() => changeShowInput(comment.id)}>
          <i className="iconfont icon-xiaoxi" style={{ marginRight: 5 }}></i>
          回复
        </span>
        {showInput == comment.id ? <CommentInput article={article} parent={comment.id} getComment={getComment} /> : ""}
        <div className="divider"></div>
        {comment.children.length > 0 ? (
          <ul style={{ listStyle: "none" }}>
            {comment.children.map(subc => {
              return (
                <li key={`subcomment-${subc.id}`}>
                  <div style={{ display: "flex" }}>
                    <img
                      src={subc.avatar ? subc.avatar : "/asset/dft-avatar.jpg"}
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/user/${subc.user}`)}
                    />
                    <div style={{ paddingLeft: 10 }}>
                      <div>
                        <span style={{ cursor: "pointer" }} onClick={() => navigate(`/user/${subc.user}`)}>
                          {subc.nickname}
                        </span>
                        &nbsp;&nbsp;
                        {subc.parentNickname ? (
                          <span>
                            <i className="iconfont icon-course subc-join"></i>&nbsp;&nbsp;
                            <span>{subc.parentNickname}</span>
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="cmitem-date">{moment(subc.date).format("YYYY.MM.DD hh:mm:ss")}</div>
                    </div>
                  </div>
                  <p className="cmi-content" style={{ paddingLeft: 5 }}>
                    {subc.content}
                  </p>
                  <span className="cmi-reply-b" onClick={() => changeShowInput(subc.id)}>
                    <i className="iconfont icon-xiaoxi" style={{ marginRight: 5 }}></i>
                    回复
                  </span>
                  {showInput == subc.id ? (
                    <CommentInput article={article} parent={subc.id} getComment={getComment} />
                  ) : (
                    ""
                  )}
                  <div className="divider"></div>
                </li>
              );
            })}
          </ul>
        ) : (
          ""
        )}
      </div>
    </li>
  );
}
