import React from "react";
import { DownOutlined, SettingOutlined } from "@ant-design/icons";
import type { App, MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import UserAvatar from "./UserAvater";
import { useLoginStore } from "../store/useLoginStore";

const UserDropdown: React.FC = () => {
  const logout = useLoginStore((state) => state.logout);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "我的账户",
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "退出登录",
      extra: "⌘P",
      onClick: () => {
        logout();
        // 可以在这里添加退出后的重定向逻辑，比如跳转到登录页
        window.location.href = "/login";
      },
    },
    {
      key: "3",
      label: "设置",
      icon: <SettingOutlined />,
      extra: "⌘S",
    },
  ];

  return (
    <Dropdown menu={{ items }}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <UserAvatar />
          <DownOutlined />
        </Space>
      </a>
    </Dropdown>
  );
};

export default UserDropdown;
