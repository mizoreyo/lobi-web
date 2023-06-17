import React from "react";
import Note from "../../Explore/Note";
import { get } from "../../../util/request";
import api from "../../../api";
import { useEffect, useState } from "react";
import { Pagination } from "antd";

export default function SearchArticle(props) {
  const [data, setData] = useState({ total: 0, data: [] });
  const { q } = props;
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);

  useEffect(() => {
    getData();
  }, [q, page]);

  const getData = () => {
    get(api.search.article, { q, page, size }).then(res => {
      if (res) {
        setData(res);
      }
    });
  };

  const handleChange = pageNum => {
    setPage(pageNum);
  };

  return (
    <ul className="exp-list">
      {data.data.length == 0 ? (
        <div>好像找不到呢...</div>
      ) : (
        data.data.map(note => {
          return <Note {...note} key={`note-${note.id}`} />;
        })
      )}
      <Pagination onChange={handleChange} style={{ marginTop: 30 }} current={page} pageSize={size} total={data.total} />
    </ul>
  );
}
