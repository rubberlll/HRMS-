import { createBrowserRouter } from "react-router-dom";
import React, { JSX } from "react";
import { lazy } from "react";

const Login = lazy(() => import("../pages/login/Login"));
const Home = lazy(() => import("../pages/home/Home"));
const Recruitment = lazy(() => import("../pages/Recruitment"));
const Welcome = lazy(() => import("../pages/Welcome"));
const User = lazy(() => import("../pages/User"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Test = lazy(() => import("../pages/test/Test"));
import PrivateRoute from "../components/PrivateRoute";
const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    element: <PrivateRoute children={<Home />} />,
    children: [
      {
        index: true,
        Component: Welcome,
      },
      {
        path: "/recruitment",
        Component: Recruitment,
      },
      {
        path: "/user",
        Component: User,
      },
    ],
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
