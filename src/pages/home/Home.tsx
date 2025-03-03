import React, { useEffect, useState } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useLoginStore } from "../../store/useLoginStore";
import "./home.less";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import UserDropdown from "../../components/UserDropdown";

const { Header, Sider, Content } = Layout;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useLoginStore();
  const [collapsed, setCollapsed] = useState(false);

  // useEffect(() => {
  //   // if (!token) {
  //   //   navigate("/login");
  //   // }
  // }, [token, navigate]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout className="h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <h2 style={{ textAlign: "center", marginTop: "10px", color: "white" }}>
          HRM系统
        </h2>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "首页",
              onClick: () => navigate("/"),
            },
            {
              key: "2",
              icon: <VideoCameraOutlined />,
              label: "员工管理",
              onClick: () => navigate("/user"),
            },
            {
              key: "3",
              icon: <UploadOutlined />,
              label: "招聘管理",
              onClick: () => navigate("/recruitment"),
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <UserDropdown />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;
