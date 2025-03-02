import { createBrowserRouter } from "react-router-dom";
import React from "react";
import { lazy } from "react";

const Login = lazy(() => import("../pages/login/Login"));
const Home = lazy(() => import("../pages/Home"));
const Blog = lazy(() => import("../pages/Blog"));
const Welcome = lazy(() => import("../pages/Welcome"));
const User = lazy(() => import("../pages/User"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Test = lazy(() => import("../pages/test/Test"));

const router = createBrowserRouter([
  {
    path: "/blog",
    Component: Blog,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: Home,
    children: [
      {
        index: true,
        Component: Welcome,
      },
    ],
  },
  {
    path: "/user",
    Component: User,
  },

  {
    path: "/notfound",
    Component: NotFound,
  },

  {
    path: "/test",
    Component: Test,
  },
]);

export default router;
