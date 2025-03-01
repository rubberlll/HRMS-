const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: path.join(__dirname, "../src/index.tsx"), //入口文件
  module: {
    rules: [
      {
        test: /.(ts|tsx)$/, //匹配ts、tsx文件
        use: {
          loader: "babel-loader",
          options: {
            //预设执行顺序由右往左，所以这里是先处理ts再处理jsx
            presets: ["@babel/preset-react", "@babel/preset-typescript"],
          },
        },
      },
      {
        test: /\.module\.less$/, // 匹配 .module.less 文件
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true, // 启用 CSS Modules
            },
          },
          "less-loader", // 先处理 Less 语法
        ],
      },
      {
        test: /\.(css|less)$/,
        exclude: /\.module\.less$/, // 排除 .module.less 文件
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: "asset/resource", // 使用asset模块处理图片
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource", // 处理字体文件
      },
    ],
  },
  resolve: {
    ///可以import aaa   不是import aa.ts
    extensions: [".tsx", ".ts", ".js", ".jsx", ".json"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"), //模板用定义root节点的模板
      inject: true, //自动注入静态资源
    }),
  ],
};
