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
};

module.exports = nextConfig;
