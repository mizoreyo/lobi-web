import React from "react";
import { useState, useEffect } from "react";
import { get } from "../../../util/request";
import api from "../../../api";
import { Pagination } from "antd";
import { useNavigate } from "react-router-dom";

export default function CollectionSub() {
  const [data, setData] = useState({ total: 0, data: [] });
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const navigate = useNavigate();

  const getData = () => {
    get(api.subscribe.myPage, { type: "COLLECTION", page, size }).then(res => {
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
      {data.data.map(c => {
        return (
          <li className="scrr-item" key={`collection-${c.id}`}>
            <div className="scrri-icon" onClick={() => navigate(`/collection/${c.id}`)}>
              <i className="iconfont icon-zixun"></i>
            </div>
            <div>
              <div className="scrri-name" onClick={() => navigate(`/collection/${c.id}`)}>
                {c.name}
              </div>
              <div className="scrri-desc">{`${c.subCount} 关注 | ${c.articleCount} 文章收录`}</div>
            </div>
          </li>
        );
      })}
      <Pagination onChange={handleChange} style={{ marginTop: 30 }} current={page} pageSize={size} total={data.total} />
    </ul>
  );
}
