import Mock from "mockjs";

// 确保 Mock.js 设置正确
Mock.setup({
  timeout: "200-600", // 设置响应时间
  timeout: true, // 打开请求延时
});

// 修改 mock 配置，使用更灵活的 URL 匹配
Mock.mock(/^\/api\/login/, "post", (options) => {
  const requestBody = JSON.parse(options.body);
  console.log("Mock收到登录请求:", requestBody); // 添加日志便于调试

  return {
    code: 200,
    message: "登录成功",
    data: {
      token: "1234567890",
      username: requestBody.username || "测试用户",
    },
  };
});
