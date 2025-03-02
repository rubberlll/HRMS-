import React from "react";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input, Card } from "antd";
import "./login.less";
import { useNavigate } from "react-router-dom";
import navigatingImage from "@/assets/images/Navigating.jpg";
import { useLoginStore } from "@/store/useLoginStore";
type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setLogin } = useLoginStore();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    await setLogin(values);
    navigate("/");
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="loginContainer">
      <Card
        style={{ width: 500 }}
        cover={<img alt="navigating" src={navigatingImage} />}
      >
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          style={{ maxWidth: 800 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="用户名"
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
            className="loginForm"
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<FieldType>
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 6, span: 14 }}
            label={null}
          >
            <Checkbox>记住密码</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 10, span: 3 }} label={null}>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
