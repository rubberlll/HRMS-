1.用户权限控制 jwt 2.性能优化
3.axios 二次封装 4.主题切换
5.keep-alive 进行页面缓存 6.大文件上传 断点续传 秒传 7.只在开发环境使用 mockjs 8.webpack 优化

---

使⽤ react-flowbite 组件库进⾏界⾯美化。
React 项⽬⼯作拼接库
使⽤ Redux 以及 useState、useSelector 等 react hook 完成状态管理
使⽤ JWT+cookie 实现⽤户验证和登录
使⽤ react-flowbite 组件库进⾏界⾯美化。对常⽤的组件进⾏封装提升可读性
项⽬中的所有组件均使⽤ React 的函数组件，使⽤了⼀系列的 React Hook，例如 useState
,useEffect,useMemo ,useCallback.
项⽬对 Axios 进⾏了简易的封装，使⽤了 styled-components 库来编写 CSS.
对 axios 进⾏了⼆次封装，并添加了请求拦截器，便于统⼀处理相关信息。
采⽤组件化的开发⽅式，合理的将⻚⾯的模块或功能抽出对应的可复⽤组件。
3
使⽤图⽚懒加载延迟加载⻚⾯上的图⽚，减少了⻚⾯加载时间和⽹络带宽消耗。（你看看咋实现，如果准备调库
就在前⾯写基于 xxx 实现
使⽤了 Redux-toolkit 来进⾏数据的统⼀管理。
使⽤ React Router 进⾏路由权限拦截和判断，并采⽤路由懒加载技术。
使⽤ pnpm 或 nx 管理 monorepo 结构，统⼀管理多个⼦项⽬，便于模块化和依赖管理。
替换 Redux 为 Zustand，使状态管理更简洁。
关键点包括：

简化 API、减少样板代码。
提升指标可包括：组件渲染性能提升、状态更新响应速度加快等。
迁移过程中，需逐步替换状态管理逻辑，并做好现有功能的回归测试
