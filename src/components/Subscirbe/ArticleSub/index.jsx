import React from "react";
import { useState, useEffect } from "react";
import { get } from "../../../util/request";
import api from "../../../api";
import { Pagination } from "antd";
import { useNavigate } from "react-router-dom";
 import Note from "../../Explore/Note";

export default function ArticleSub() {
  const [data, setData] = useState({ total: 0, data: [] });
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const navigate = useNavigate();


  const getData = () => {
    get(api.subscribe.myPage, { type: "ARTICLE", page, size }).then(res => {
      setData(res);
    });
  };

  useEffect(() => {
    getData();
  }, [page]);

  const handleChange = pageNum => {
    setPage(pageNum);
  };

  return (
    <ul className="scrr-list">
      {data.data.map(a => (
        <Note {...a} key={`article-${a.id}`} />
      ))}
      <Pagination onChange={handleChange} style={{ marginTop: 30 }} current={page} pageSize={size} total={data.total} />
    </ul>
  );
}
