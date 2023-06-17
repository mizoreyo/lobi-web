import React from "react";
import api from "../../../api";
import { get } from "../../../util/request";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { Pagination } from "antd";

export default function SearchCollection(props) {
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
    get(api.search.collection, { q, page, size }).then(res => {
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
        data.data.map(c => {
          return (
            <div className="su-item" key={`collection-${c.id}`}>
              <div className="sui-left">
                <div className="sci-icon" onClick={() => navigate(`/collection/${c.id}`)}>
                  <i className="iconfont icon-zixun"></i>
                </div>
                <div>
                  <div className="sui-name" onClick={() => navigate(`/collection/${c.id}`)}>
                    {c.name}
                  </div>
                  <div className="sui-desc">{`${c.subCount} 关注 | ${c.articleCount} 收录文章`}</div>
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
