/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  // 移除了webpack配置部分
  // 只保留别名配置
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  images: {
    domains: ["localhost:3000"],
  },
  // 添加静态文件配置
  async rewrites() {
    return [
      {
        source: "/files/:path*",
        destination: "/api/files/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
