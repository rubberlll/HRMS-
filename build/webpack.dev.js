const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.js");
const path = require("path");

module.exports = merge(baseConfig, {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  devServer: {
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, "public"),
    },
  },
});
