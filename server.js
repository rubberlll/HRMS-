const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 这里模拟数据库中的用户数据
const users = [
  {
    id: 1,
    username: "admin",
    password: "123456", // 直接使用明文密码
  },
];

// 密钥（在实际项目中应该存储在环境变量中）
const JWT_SECRET = "your-secret-key";

// 登录接口
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 添加请求体日志
    console.log("收到登录请求:", { username, password });

    // 查找用户
    const user = users.find((u) => u.username === username);
    if (!user) {
      console.log("用户不存在:", username);
      return res.status(401).json({ message: "用户名不存在" });
    }

    // 直接比较密码
    if (password !== user.password) {
      console.log("密码错误:", username);
      return res.status(401).json({ message: "密码错误" });
    }

    // 生成 token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("登录错误:", error);
    res.status(500).json({ message: "服务器错误", error: error.message });
  }
});

// 添加一个简单的 GET 接口
app.get("/api/hello", (req, res) => {
  res.json({ message: "你好，这是一个测试消息！" });
});

// 启动服务器
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
