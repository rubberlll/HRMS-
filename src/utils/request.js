import axios from "axios";

// 创建 axios 实例
const request = axios.create({
  baseURL: "/api",
  timeout: 5000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // token过期或无效，清除token并跳转到登录页
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
          window.location.href = "/login";
          break;
        default:
          console.error("请求错误:", error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export default request;
