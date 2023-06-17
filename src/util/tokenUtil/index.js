const ls = window.localStorage;
const ss = window.sessionStorage;
export const tokenKey = "lobi-token";

const tokenChangeEvent=new Event("tokenChange");

export default {
  removeToken: () => {
    ls.removeItem(tokenKey);
    ss.removeItem(tokenKey);
    window.dispatchEvent(tokenChangeEvent);
  },
  setSessionToken: token => {
    ss.setItem(tokenKey, token);
    window.dispatchEvent(tokenChangeEvent);
  },
  setLocalToken: token => {
    ls.setItem(tokenKey, token);
    window.dispatchEvent(tokenChangeEvent);
  },
  getToken: () => {
    if (ss.getItem(tokenKey)) {
      return ss.getItem(tokenKey);
    }
    return ls.getItem(tokenKey);
  },
};
