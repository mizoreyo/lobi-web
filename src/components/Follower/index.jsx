import React, { useEffect, useState } from "react";
import Modal from "antd/es/modal/Modal";
import api from "../../api";
import { get } from "../../util/request";
import { useNavigate } from "react-router-dom";
import { Pagination } from "antd";

export default function Follower(props) {
  const { resId, type, isModalOpen, handleCancel } = props;
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [data, setData] = useState({ total: 0, data: [] });
  const navigate = useNavigate();

  useEffect(() => {
    if (resId) {
      getData();
    }
  }, [resId]);

  const getData = () => {
    get(api.subscribe.followerList, { resId, type, page, size }).then(res => {
      if (res) {
        setData(res);
      }
    });
  };

  const handleChange = pageNum => {
    setPage(pageNum);
  };

  const handleClick = id => {
    navigate(`/user/${id}`);
    handleCancel();
  };
  return (
    <Modal
      forceRender
      width={400}
      open={isModalOpen}
      onCancel={handleCancel}
      maskStyle={{ backgroundColor: "transparent" }}
      footer={null}
    >
      <ul style={{ listStyle: "none" }}>
        {data
          ? data.data.map(item => {
              return (
                <li key={`follower-${item.id}`}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={item.avatar ? item.avatar : "/asset/dft-avatar.jpg"}
                      alt="头像"
                      style={{ height: 40, borderRadius: 999, cursor: "pointer" }}
                      onClick={() => handleClick(item.id)}
                    />
                    <div style={{ paddingLeft: 20, cursor: "pointer" }} onClick={() => handleClick(item.id)}>
                      {item.nickname}
                    </div>
                  </div>
                  <div className="divider"></div>
                </li>
              );
            })
          : ""}
      </ul>
      <Pagination onChange={handleChange} style={{ marginTop: 30 }} current={page} pageSize={size} total={data.total} />
    </Modal>
  );
}
