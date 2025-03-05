import Mock from "mockjs";

// 确保 Mock.js 设置正确
Mock.setup({
  timeout: "200-600", // 设置响应时间
});

// 模拟生成 JWT token 的函数
const generateToken = (payload) => {
  // 实际项目中应该使用更复杂的算法，这里简化处理
  const base64Payload = btoa(JSON.stringify(payload));
  return `mock-jwt.${base64Payload}.signature`;
};

// 修改登录接口，返回 JWT token
Mock.mock(/^\/api\/login/, "post", (options) => {
  const requestBody = JSON.parse(options.body);
  console.log("Mock收到登录请求:", requestBody);

  // 验证用户名和密码
  if (requestBody.username !== "admin" || requestBody.password !== "123456") {
    return {
      code: 401,
      message: "用户名或密码错误",
      data: null,
    };
  }

  const userInfo = {
    userId: Mock.Random.id(),
    username: "admin",
    role: "admin", // 将角色改为 admin
    exp: Date.now() + 24 * 60 * 60 * 1000, // token 24小时过期
  };

  const token = generateToken(userInfo);

  return {
    code: 200,
    message: "登录成功",
    data: {
      token,
      userInfo,
    },
  };
});

// 添加验证 token 的接口
Mock.mock(/^\/api\/verify-token/, "get", (options) => {
  const token = options.headers?.Authorization?.replace("Bearer ", "");

  if (!token) {
    return {
      code: 401,
      message: "未提供token",
      data: null,
    };
  }

  try {
    // 解析 token
    const payload = JSON.parse(atob(token.split(".")[1]));

    // 检查 token 是否过期
    if (payload.exp < Date.now()) {
      return {
        code: 401,
        message: "token已过期",
        data: null,
      };
    }

    return {
      code: 200,
      message: "token有效",
      data: payload,
    };
  } catch (error) {
    return {
      code: 401,
      message: "无效的token",
      data: null,
    };
  }
});
