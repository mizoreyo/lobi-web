import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { get, remove } from "../../../util/request";
import api from "../../../api";
import { useState } from "react";
import { Pagination, Button, Space, message } from "antd";
import moment from "moment/moment";
import { EllipsisOutlined } from "@ant-design/icons";

export default function ThumbsMes() {
  const [data, setData] = useState({ total: 0, data: [] });
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const navigate = useNavigate();

  const getData = () => {
    get(api.message.myPage, { type: "THUMB", page, size }).then(res => {
      setData(res);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleChange = pageNum => {
    setPage(pageNum);
  };

  const read = id => {
    get(`${api.message.read}/${id}`).then(res => {
      if (res) {
        getData();
      }
    });
  };

  const deleteMes = id => {
    remove(`${api.message.delete}/${id}`).then(res => {
      if (res) {
        message.success("删除成功");
        getData();
      }
    });
  };

  const allRead = () => {
    get(api.message.read, { type: "THUMB" }).then(res => {
      if (res) {
        getData();
      }
    });
  };

  const allDelete = () => {
    remove(api.message.delete, { type: "THUMB" }).then(res => {
      if (res) {
        message.success("删除成功");
        getData();
      }
    });
  };

  return (
    <div>
      <Space>
        <Button type="primary" onClick={allRead}>
          全部已读
        </Button>
        <Button onClick={allDelete}>全部删除</Button>
      </Space>
      <div className="divider"></div>
      <ul className="mes-list">
        {data.data.map(m => {
          return (
            <li className="mesl-item" key={`commentmes-${m.id}`}>
              <div className="mesl-top">
                <div className="mesl-left">
                  <img
                    src={m.exAvatar ? m.exAvatar : "/asset/dft-avatar.jpg"}
                    onClick={() => navigate(`/user/${m.exUser}`)}
                  />
                  <div className="mes-text">
                    <span className="mes-user" onClick={() => navigate(`/user/${m.exUser}`)}>
                      {m.exNickname}
                    </span>
                    点赞了你的文章《
                    <span className="mes-article" onClick={() => navigate(`/article/${m.exArticle}`)}>
                      {m.exArticleTitle}
                    </span>
                    》
                  </div>
                </div>
                <div className="mes-button">
                  <EllipsisOutlined />
                  <div className="mes-bar">
                    <div
                      className="mesb-b"
                      onClick={() => {
                        read(m.id);
                      }}
                    >
                      已读
                    </div>
                    <div className="mesb-b" onClick={() => deleteMes(m.id)}>
                      删除
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ padding: "5px 10px" }}>
                <span style={{ fontSize: 12, color: m.readed ? "#969696" : "red" }}>{m.readed ? "已读" : "未读"}</span>
                &nbsp;&nbsp;
                <span style={{ fontSize: 12, color: "#969696" }}>{moment(m.date).format("YYYY.MM.DD hh:mm:ss")}</span>
              </div>
              <div className="divider"></div>
            </li>
          );
        })}
        <Pagination
          onChange={handleChange}
          style={{ marginTop: 30 }}
          current={page}
          pageSize={size}
          total={data.total}
        />
      </ul>
    </div>
  );
}
