import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Nav from "./components/Nav";
import Explore from "./components/Explore";
import Subscribe from "./components/Subscirbe";
import Message from "./components/Message";
import Article from "./components/Article";
import Space from "./components/Space";
import Login from "./components/Login";
import Register from "./components/Register";
import Write from "./components/Write";
import Search from "./components/Search";
import Subject from "./components/Subject";
import Collection from "./components/Collection";

import "./App.css";

function App() {
  const location = useLocation();
  // 登录框显示状态
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const showLogin = () => {
    setIsLoginOpen(true);
  };

  const showRegister = () => {
    setIsRegisterOpen(true);
  };

  const handleLoginCancel = () => {
    setIsLoginOpen(false);
  };

  const handleRegisterCancel = () => {
    setIsRegisterOpen(false);
  };

  // 文章页面背景色淡灰
  useEffect(() => {
    if (location.pathname.substring(0, 8) === "/article") {
      document.body.style.backgroundColor = "#f9f9f9";
    } else {
      document.body.style.backgroundColor = "#fff";
    }
    if (location.pathname.substring(0, 6) === "/write") {
      document.getElementsByClassName("main")[0].style.width = "1400px";
    } else {
      document.getElementsByClassName("main")[0].style.width = "945px";
    }
  }, [location]);

  return (
    <div>
      <Nav showLogin={showLogin} showRegister={showRegister} />
      <div className="main">
        <Routes>
          <Route path="/" element={<Explore />}></Route>
          <Route path="/subscribe" element={<Subscribe />}></Route>
          <Route path="/message" element={<Message />}></Route>
          <Route path="/article/:articleId" element={<Article />}></Route>
          <Route path="/user/:userId" element={<Space />}></Route>
          <Route path="/write" element={<Write />}></Route>
          <Route path="/search" element={<Search />}></Route>
          <Route path="/subject/:subjectId" element={<Subject />}></Route>
          <Route path="/collection/:collectionId" element={<Collection />}></Route>
        </Routes>
      </div>
      <Login open={isLoginOpen} handleCancel={handleLoginCancel} />
      <Register open={isRegisterOpen} handleCancel={handleRegisterCancel} />
    </div>
  );
}

export default App;
