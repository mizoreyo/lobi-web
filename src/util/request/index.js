import axios from "axios";
import { notification } from "antd";
import tokenUtil from "../tokenUtil";

// 设置超时时间
axios.defaults.timeout = 5000;
axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";

/**
 * 请求拦截器
 */
axios.interceptors.request.use(
  config => {
    let token = tokenUtil.getToken();
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  error => {
    console.log("请求拦截器出错");
    return console.log(error);
  },
);

axios.interceptors.response.use(
  res => {
    if (res.data.code != 200 && res.data.code != 204) {
      notification.error({
        message: res.data.message,
      });
      return null;
    }
    return res.data;
  },
  error => {
    console.log(error);
    notification.error({
      message: "未知错误!",
    });
    return;
  },
);

export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params,
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

export function post(url, data) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, data)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

export function put(url, data) {
  return new Promise((resolve, reject) => {
    axios
      .put(url, data)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

export function remove(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .delete(url, {
        params: params,
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}
