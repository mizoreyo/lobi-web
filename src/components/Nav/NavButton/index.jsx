import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "./index.css";

export default function NavButton(props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { path } = props;
  const handleRoute = () => {
    navigate(path);
  };
  return (
    <li className={pathname === path ? "menu-item active" : "menu-item"} onClick={handleRoute}>
      {props.name}
    </li>
  );
}
