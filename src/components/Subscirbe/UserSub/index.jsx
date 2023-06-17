import React from "react";
import { useState, useEffect } from "react";
import { get } from "../../../util/request";
import api from "../../../api";
import { Pagination } from "antd";
import { useNavigate } from "react-router-dom";

export default function UserSub() {
  const [data, setData] = useState({ total: 0, data: [] });
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const navigate = useNavigate();

  const getData = () => {
    get(api.subscribe.myPage, { type: "USER", page, size }).then(res => {
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
      {data.data.map(u => {
        return (
          <li className="scrr-item" key={`user-${u.id}`}>
            <img
              className="circle"
              src={u.avatar ? u.avatar : "/asset/dft-avatar.jpg"}
              onClick={() => navigate(`/user/${u.id}`)}
            />
            <div>
              <div className="scrri-name" onClick={() => navigate(`/user/${u.id}`)}>
                {u.nickname}
              </div>
              <div className="scrri-desc">{`${u.subCount} 粉丝 | ${u.articleCount} 文章`}</div>
            </div>
          </li>
        );
      })}
      <Pagination onChange={handleChange} style={{ marginTop: 30 }} current={page} pageSize={size} total={data.total} />
    </ul>
  );
}
