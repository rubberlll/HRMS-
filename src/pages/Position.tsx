import React, { useState } from "react";
import { usePositionStore } from "../store/positionStore";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Row,
  Col,
  Space,
  Collapse,
  Radio,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Title } = Typography;

const Position = () => {
  const { positions, addPosition } = usePositionStore();
  const [form] = Form.useForm();
  const [activeView, setActiveView] = useState<"publish" | "list">("publish");

  const handleSubmit = (values: any) => {
    addPosition({
      ...values,
      requirements: values.requirements.split("\n"),
    });
    form.resetFields();
  };

  return (
    <Row justify="center" style={{ padding: 24 }}>
      <Col span={16}>
        <Radio.Group
          value={activeView}
          onChange={(e) => setActiveView(e.target.value)}
          style={{ marginBottom: 24 }}
          buttonStyle="solid"
        >
          <Radio.Button value="publish">发布新职位</Radio.Button>
          <Radio.Button value="list">查看已发布职位</Radio.Button>
        </Radio.Group>

        {activeView === "publish" ? (
          <Collapse defaultActiveKey={["1"]}>
            <Collapse.Panel header="发布新职位" key="1">
              <Card style={{ marginBottom: 24 }}>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                  <Form.Item
                    label="职位名称"
                    name="title"
                    rules={[{ required: true, message: "请输入职位名称" }]}
                  >
                    <Input placeholder="请输入职位名称" />
                  </Form.Item>

                  <Form.Item
                    label="部门"
                    name="department"
                    rules={[{ required: true, message: "请输入部门名称" }]}
                  >
                    <Input placeholder="请输入部门名称" />
                  </Form.Item>

                  <Form.Item
                    label="职位描述"
                    name="description"
                    rules={[{ required: true, message: "请输入职位描述" }]}
                  >
                    <TextArea rows={4} placeholder="请输入职位描述" />
                  </Form.Item>

                  <Form.Item
                    label="要求（每行一条）"
                    name="requirements"
                    rules={[{ required: true, message: "请输入职位要求" }]}
                  >
                    <TextArea rows={4} placeholder="请输入职位要求，每行一条" />
                  </Form.Item>

                  <Form.Item
                    label="薪资范围"
                    name="salary"
                    rules={[{ required: true, message: "请输入薪资范围" }]}
                  >
                    <Input placeholder="请输入薪资范围" />
                  </Form.Item>

                  <Form.Item
                    label="工作地点"
                    name="location"
                    rules={[{ required: true, message: "请输入工作地点" }]}
                  >
                    <Input placeholder="请输入工作地点" />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<PlusOutlined />}
                    >
                      发布职位
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Collapse.Panel>
          </Collapse>
        ) : (
          <>
            <Title level={3}>已发布的职位</Title>
            <Space direction="vertical" style={{ width: "100%" }}>
              {positions.map((position) => (
                <Card key={position.id}>
                  <Title level={4} style={{ margin: 0 }}>
                    {position.title}
                  </Title>
                  <Typography.Text type="secondary">
                    {position.department} · {position.location}
                  </Typography.Text>
                  <Typography.Text
                    type="success"
                    style={{ display: "block", marginTop: 8 }}
                  >
                    {position.salary}
                  </Typography.Text>
                  <Typography.Paragraph style={{ marginTop: 16 }}>
                    <strong>职位描述：</strong>
                    <br />
                    {position.description}
                  </Typography.Paragraph>
                  <Typography.Paragraph>
                    <strong>职位要求：</strong>
                    <ul>
                      {position.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </Typography.Paragraph>
                </Card>
              ))}
            </Space>
          </>
        )}
      </Col>
    </Row>
  );
};

export default Position;
