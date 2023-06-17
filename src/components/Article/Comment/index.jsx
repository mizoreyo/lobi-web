import React, { useEffect, useState } from "react";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import "./index.css";
import api from "../../../api";
import { get } from "../../../util/request";

export default function Comment(props) {
  const [comments, setComments] = useState([]);
  const [showInput, setShowInput] = useState(0);
  const { article, setCommentCount } = props;

  const getComment = () => {
    get(api.comment.tree, { article }).then(res => {
      if (res) {
        setComments(res);
        setCommentCount(getCommentCount(res));
      }
    });
  };

  const getCommentCount = comments => {
    let count = 0;
    comments.forEach(c => {
      count += 1;
      c.children.forEach(subc => {
        count += 1;
      });
    });
    return count;
  };

  const changeShowInput = id => {
    if (id == showInput) {
      setShowInput(0);
      return;
    }
    setShowInput(id);
  };

  useEffect(() => {
    getComment();
  }, []);

  return (
    <div>
      <CommentInput article={article} parent={0} getComment={getComment} />
      <div>
        <div className="comm-header">全部评论</div>
        <ul style={{ listStyle: "none" }}>
          {comments.map(c => {
            return (
              <CommentItem
                article={article}
                showInput={showInput}
                changeShowInput={changeShowInput}
                key={`column1c-${c.id}`}
                comment={c}
                getComment={getComment}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}
