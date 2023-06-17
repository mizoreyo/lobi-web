const base = "http://localhost:8080";
const article = `${base}/article`;
const admin = `${base}/admin`;
const collection = `${base}/collection`;
const subject = `${base}/subject`;
const search = `${base}/search`;
const user = `${base}/user`;
const oss = `${base}/oss`;
const subscribe = `${base}/subscribe`;
const thumb = `${base}/thumb`;
const comment = `${base}/comment`;
const message = `${base}/message`;

export default {
  admin: {
    login: `${admin}/login`, //登录
    register: `${admin}/register`, //注册
    info: `${admin}/info`, //获取已登录用户信息
  },
  article: {
    info: `${article}/info`,
    create: `${article}/create`,
    delete: `${article}/delete`,
    save: `${article}/save`,
    publish: `${article}/publish`,
    recommend: `${article}/recommend`,
    listByViews: `${article}/list/views`,
    page: `${article}/page`,
  },
  collection: {
    infoList: `${collection}/info/list`,
    create: `${collection}/create`,
    delete: `${collection}/delete`,
    edit: `${collection}/edit`,
    countInfo: `${collection}/info/count`,
  },
  subject: {
    search: `${subject}/search`,
    hot: `${subject}/hot`,
    countInfo: `${subject}/info/count`,
    create: `${subject}/create`,
    info: `${subject}/info`,
    edit: `${subject}/edit`,
  },
  search: {
    article: `${search}/article`,
    user: `${search}/user`,
    collection: `${search}/collection`,
    subject: `${search}/subject`,
  },
  user: {
    countInfo: `${user}/info/count`,
    info: `${user}/info`,
    edit: `${user}/edit`,
    recommend: `${user}/recommend`,
  },
  oss: {
    policy: `${oss}/policy`,
  },
  subscribe: {
    status: `${subscribe}/status`,
    create: `${subscribe}/create`,
    delete: `${subscribe}/delete`,
    myPage: `${subscribe}/page/my`,
    followerList: `${subscribe}/follower/list`,
  },
  thumb: {
    create: `${thumb}/create`,
    status: `${thumb}/status`,
    delete: `${thumb}/delete`,
  },
  comment: {
    tree: `${comment}/tree`,
    create: `${comment}/create`,
  },
  message: {
    myPage: `${message}/page/my`,
    read: `${message}/read`,
    delete: `${message}/delete`,
    hasUnread: `${message}/unread`,
  },
};
