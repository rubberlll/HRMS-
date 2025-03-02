import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useLoginStore } from "../store/useLoginStore";

const Home: React.FC = () => {
  const { token } = useLoginStore();
  if (!token) {
    return <Navigate to="/login" />;
  }
  return (
    <div>
      这里是首页
      <Outlet />
    </div>
  );
};

export default Home;
