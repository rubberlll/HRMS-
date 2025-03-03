import React from "react";
import { DownOutlined, SettingOutlined } from "@ant-design/icons";
import type { App, MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import UserAvatar from "./UserAvater";
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
  },

  {
    key: "3",
    label: "设置",
    icon: <SettingOutlined />,
    extra: "⌘S",
  },
];

const UserDropdown: React.FC = () => (
  <Dropdown menu={{ items }}>
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        <UserAvatar />
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
);

export default UserDropdown;
