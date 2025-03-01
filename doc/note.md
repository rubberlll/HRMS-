--环境配置

1. public 文件和 src 的区别

public 文件是静态文件，不会被 webpack 处理，会被直接复制到 dist 目录下
src 文件是源码文件，会被 webpack 处理

index.html 应该放在 public 文件夹下，而不是 src 文件夹下 这是应用的主入口 HTML 文件
需要保持原样不被 webpack 处理

2.  webpack 的配置

entry: 入口文件
output: 出口文件
module: 模块 - loader: 加载器，用于处理非 JavaScript 文件 包括 babel-loader css-loader
plugins: 插件-html-webpack-plugin 最终构建好的静态资源都引入到 HTML 文件中，这样才能在浏览器中运行。
devServer: （dev 环境）开发服务器 -HRM 热更新

3.package.json 的配置

项目名称 版本号

项目依赖

项目脚本

4.react 和 react-dom 的区别

react 是 react 的核心库，提供了 react 的组件、hooks 和虚拟 DOM 的定义和 diff 算法
react-dom 是 react 的 DOM 库，提供了 react 组件在浏览器 DOM 中的渲染和更新 如虚拟 dom 在浏览器中渲染为真实 dom

为什么要分开

因为要进行平台解耦，rn 不需要 react-dom

5.babel 的作用

代码转换

将 ES6+、TypeScript、JSX 等现代语法转换为 ES5 等低版本语法，确保代码在旧浏览器或环境中兼容。
示例：将 const 转换为 var、箭头函数转为普通函数等。

babel-loader 是 babel 的 loader，用于在 webpack 中使用 babel 进行代码转换

@babel/core 核心库必须安装

@babel/preset-env（env 是 environment 的缩写） 是 babel 的 preset，用于将 ES6+ 转换为 ES5

@babel/preset-react 是 babel 的 preset，用于将 JSX 转换为 React.createElement 形式（react17 之前的写法）

6.生产环境和开发环境配置

webpack.base.js 通过 merge 合并

webpack.dev.js 开发环境配置

webpack.prod.js 生产环境配置 生成的 dist 通过 serve -s dist 启动（serve 是 node 自带的静态资源服务器 记得安装）
7.less 的配置

less-loader 是 less 的 loader，用于在 webpack 中使用 less 进行样式处理

@less-loader/webpack 是 less-loader 的 webpack 插件，用于在 webpack 中使用 less 进行样式处理

--------------------路由 1.懒加载

懒加载是一种优化技术，用于延迟加载资源，直到需要时才加载。

import() 是动态导入操作符，用于动态地加载模块。当使用 import() 时，模块不会立即加载，而是在需要时按需加载。

<Suspense fallback={<div>加载中...</div>}>
<RouterProvider router={router} />
</Suspense>

fallback 占位符 当组件加载时 显示加载中 优化用户体验

配置 children，需要在父组件中配置<Outlet />
------------------登录 1.文件的配置

utils 工具类 不可以包含业务逻辑 可复用 原子性

2.登录的逻辑

提交表单 使用 axios 发送请求
获取 token 后 存储到 zustand 中 并设置过期时间
zustand 的 store 中 应该包含登录的逻辑 和 退出的逻辑 调用 utils 的 api 进行登录 退出
