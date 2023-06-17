import React from "react";
import { useState, useEffect } from "react";
import { get } from "../../../util/request";
import api from "../../../api";
import { Pagination } from "antd";
import { useNavigate } from "react-router-dom";

export default function SubjectSub() {
  const [data, setData] = useState({ total: 0, data: [] });
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const navigate = useNavigate();

  const getData = () => {
    get(api.subscribe.myPage, { type: "SUBJECT", page, size }).then(res => {
      console.log(res);
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
      {data.data.map(s => {
        return (
          <li className="scrr-item" key={`subject-${s.id}`}>
            <img src={s.logo ? s.logo : "/asset/dft-subject.png"} onClick={() => navigate(`/subject/${s.id}`)} />
            <div>
              <div className="scrri-name" onClick={() => navigate(`/subject/${s.id}`)}>
                {s.name}
              </div>
              <div className="scrri-desc">{`${s.subCount} 关注 | ${s.articleCount} 收录文章`}</div>
            </div>
          </li>
        );
      })}
      <Pagination onChange={handleChange} style={{ marginTop: 30 }} current={page} pageSize={size} total={data.total} />
    </ul>
  );
}
