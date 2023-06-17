import React from "react";
import api from "../../../api";
import { get } from "../../../util/request";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { Pagination } from "antd";

export default function SearchSubject(props) {
  const [data, setData] = useState({ total: 0, data: [] });
  const { q } = props;
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const navigate = useNavigate();

  const handleChange = pageNum => {
    setPage(pageNum);
  };

  useEffect(() => {
    getData();
  }, [q, page]);

  const getData = () => {
    get(api.search.subject, { q, page, size }).then(res => {
      if (res) {
        setData(res);
      }
    });
  };

  return (
    <div>
      {data.data.length == 0 ? (
        <div>好像找不到呢...</div>
      ) : (
        data.data.map(s => {
          return (
            <div className="su-item" key={`subject-${s.id}`}>
              <div className="sui-left">
                <img src={s.logo ? s.logo : "/asset/dft-subject.png"} onClick={() => navigate(`/subject/${s.id}`)} />
                <div>
                  <div className="sui-name" onClick={() => navigate(`/subject/${s.id}`)}>
                    {s.name}
                  </div>
                  <div className="sui-desc">{`${s.subCount} 关注 | ${s.articleCount} 收录文章`}</div>
                </div>
              </div>
            </div>
          );
        })
      )}
      <Pagination onChange={handleChange} style={{ marginTop: 30 }} current={page} pageSize={size} total={data.total} />
    </div>
  );
}
