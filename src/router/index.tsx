import { createBrowserRouter } from "react-router-dom";
import React, { JSX } from "react";
import { lazy } from "react";

const Login = lazy(() => import("../pages/login/Login"));
const Home = lazy(() => import("../pages/home/Home"));

const Welcome = lazy(() => import("../pages/Welcome"));
const User = lazy(() => import("../pages/User"));
const NotFound = lazy(() => import("../pages/NotFound"));

import PrivateRoute from "../components/PrivateRoute";
const Resume = lazy(() => import("../pages/Resume"));
const Position = lazy(() => import("../pages/Position"));
const UserDetail = lazy(() => import("../pages/UserDetail"));
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
        path: "user",
        Component: User,
        children: [
          {
            path: ":userId",
            Component: UserDetail,
          },
        ],
      },
      {
        path: "/recruitment/resume",
        Component: Resume,
      },
      {
        path: "/recruitment/positions",
        Component: Position,
      },
    ],
  },

  {
    path: "/notfound",
    Component: NotFound,
  },
]);

export default router;
