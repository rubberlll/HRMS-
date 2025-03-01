import React from "react";
import { Outlet } from "react-router-dom";
import styles from "./home.css";
const Home: React.FC = () => {
  return (
    <div className={styles.homeContainer}>
      这里是首页
      <Outlet />
    </div>
  );
};

export default Home;
