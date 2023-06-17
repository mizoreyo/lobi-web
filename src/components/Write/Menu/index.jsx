import React, { useEffect, useState } from "react";
import CollectionModal from "./CollectionModal";
import ArticleModal from "./ArticleModal";
import { EllipsisOutlined } from "@ant-design/icons";
import { remove } from "../../../util/request";
import api from "../../../api";
import "./index.css";
import { message } from "antd";

export default function Menu(props) {
  const { cArticleData, setArticle, getCollectionAndArticles } = props;
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isCModalOpen, setIsCModalOpen] = useState(false);
  const [isAModalOpen, setIsAModalOpen] = useState(false);
  const [cModalMode, setCModalMode] = useState("new");
  const [cEditObj, setCEditObj] = useState(null);

  const showCModal = () => {
    setIsCModalOpen(true);
  };

  const showAModal = () => {
    setIsAModalOpen(true);
  };

  const handleCCancel = () => {
    setIsCModalOpen(false);
  };

  const handleACancel = () => {
    setIsAModalOpen(false);
  };

  const collectionClick = c => {
    setSelectedCollection(c);
  };

  const articleClick = a => {
    setSelectedArticle(a);
  };

  const deleteCollection = (id, e) => {
    remove(`${api.collection.delete}/${id}`).then(res => {
      if (res) {
        message.success("删除成功");
        getCollectionAndArticles();
      }
    });
    e.stopPropagation();
  };

  const editCollection = (c, e) => {
    setCModalMode("edit");
    setCEditObj(c);
    showCModal();
    e.stopPropagation();
  };

  const deleteArticle = (id, e) => {
    remove(`${api.article.delete}/${id}`).then(res => {
      if (res) {
        message.success("删除成功");
        getCollectionAndArticles();
        if (id == selectedArticle.id) {
          setSelectedArticle(null);
        }
      }
    });
    e.stopPropagation();
  };

  const newCollection = () => {
    setCModalMode("new");
    showCModal();
  };

  /**
   * 同步选中文章
   */
  useEffect(() => {
    setArticle(selectedArticle);
  }, [selectedArticle]);

  /**
   * 更新选中文集
   */
  useEffect(() => {
    if (selectedCollection) {
      cArticleData.forEach(c => {
        if (c.id === selectedCollection.id) {
          setSelectedCollection(c);
        }
      });
    }
  }, [cArticleData]);

  return (
    <div className="wr-menu">
      <ul className="c-menu">
        <li className="m-header">文集</li>
        {cArticleData.map(c => {
          return (
            <li
              key={`c-${c.id}`}
              onClick={() => {
                collectionClick(c);
              }}
              className={
                selectedCollection ? (selectedCollection.id == c.id ? "c-m-item m-active" : "c-m-item") : "c-m-item"
              }
            >
              <div className="cmi-text">{c.name}</div>
              <div className="m-option-i">
                <EllipsisOutlined />
                <div className="m-bar">
                  <div
                    className="mb-b"
                    onClick={e => {
                      editCollection(c, e);
                    }}
                  >
                    编辑
                  </div>
                  <div
                    className="mb-b"
                    onClick={e => {
                      deleteCollection(c.id, e);
                    }}
                  >
                    删除
                  </div>
                </div>
              </div>
            </li>
          );
        })}
        <li className="m-add" onClick={newCollection}>
          +
        </li>
      </ul>
      <ul className="a-menu">
        <li className="m-header">文章</li>
        {selectedCollection
          ? selectedCollection.articles
            ? selectedCollection.articles.map(a => {
                return (
                  <li
                    key={`a-${a.id}`}
                    onClick={() => {
                      articleClick(a);
                    }}
                    className={
                      selectedArticle ? (selectedArticle.id == a.id ? "a-m-item m-active" : "a-m-item") : "a-m-item"
                    }
                  >
                    <div className="cmi-text">{a.title}</div>
                    <div className="m-option-i">
                      <EllipsisOutlined />
                      <div className="m-bar">
                        <div
                          className="mb-b"
                          onClick={e => {
                            deleteArticle(a.id, e);
                          }}
                        >
                          删除
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })
            : ""
          : ""}
        {selectedCollection ? (
          <li className="m-add" onClick={showAModal}>
            +
          </li>
        ) : (
          ""
        )}
      </ul>
      <CollectionModal
        isModalOpen={isCModalOpen}
        handleCancel={handleCCancel}
        getCollectionAndArticles={getCollectionAndArticles}
        setSelectedCollection={setSelectedCollection}
        cModalMode={cModalMode}
        cEditObj={cEditObj}
      />
      <ArticleModal
        isModalOpen={isAModalOpen}
        handleCancel={handleACancel}
        getCollectionAndArticles={getCollectionAndArticles}
        setSelectedArticle={setSelectedArticle}
        selectedCollection={selectedCollection}
      />
    </div>
  );
}
