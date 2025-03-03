import React, { useState } from "react";
import { Space, Table, Tag, Input, Button, Modal, Form, message } from "antd";
import type { TableProps } from "antd";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}
const data: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
  {
    key: "4",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
  {
    key: "5",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
  {
    key: "6",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];
const UserTable: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [pageSize, setPageSize] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DataType | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "年龄",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "地址",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "标签",
      key: "tags",
      dataIndex: "tags",
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "loser") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = data.filter((item) =>
      Object.values(item).some((val) =>
        val.toString().toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  const handleShowSizeChange = (current: number, size: number) => {
    setPageSize(size);
  };

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      setModalLoading(true);
      await form.validateFields();
      const values = form.getFieldsValue();
      const newUser = {
        key: (data.length + 1).toString(),
        ...values,
        tags: values.tags.split(",").map((tag: string) => tag.trim()),
      };
      data.push(newUser);
      setFilteredData([...data]);
      setIsModalOpen(false);
      form.resetFields();
      message.success("添加用户成功！");
    } catch (error) {
      message.error("添加用户失败，请重试！");
    } finally {
      setModalLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleEditModalOk = async () => {
    try {
      setModalLoading(true);
      await form.validateFields();
      const values = form.getFieldsValue();
      const updatedUser = {
        key: editingRecord!.key,
        ...values,
        tags: values.tags.split(",").map((tag: string) => tag.trim()),
      };
      const index = data.findIndex((item) => item.key === editingRecord!.key);
      data[index] = updatedUser;
      setFilteredData([...data]);
      setIsEditModalOpen(false);
      form.resetFields();
      setEditingRecord(null);
      message.success("更新用户成功！");
    } catch (error) {
      message.error("更新用户失败，请重试！");
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditModalCancel = () => {
    setIsEditModalOpen(false);
    form.resetFields();
    setEditingRecord(null);
  };

  const handleEdit = (record: DataType) => {
    setEditingRecord(record);
    form.setFieldsValue({
      name: record.name,
      age: record.age,
      address: record.address,
      tags: record.tags.join(", "),
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (record: DataType) => {
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除用户 ${record.name} 吗？`,
      okText: "确认",
      cancelText: "取消",
      okButtonProps: { danger: true },
      async onOk() {
        try {
          setLoading(true);
          const index = data.findIndex((item) => item.key === record.key);
          data.splice(index, 1);
          setFilteredData([...data]);
          message.success("删除用户成功！");
        } catch (error) {
          message.error("删除用户失败，请重试！");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>
          新增用户
        </Button>
        <Input.Search
          placeholder="搜索..."
          style={{ width: 300 }}
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </Space>

      <Table<DataType>
        loading={loading}
        columns={columns}
        dataSource={filteredData}
        pagination={{
          total: filteredData.length,
          pageSize: pageSize,
          pageSizeOptions: [5, 10, 20, 50, 100],
          showTotal: (total) => `共 ${total} 条数据`,
          showSizeChanger: true,
          showQuickJumper: true,
          onShowSizeChange: handleShowSizeChange,
        }}
      />

      <Modal
        title="新增用户"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={modalLoading}
        okText="确认"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: "请输入姓名" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="age"
            label="年龄"
            rules={[{ required: true, message: "请输入年龄" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="address"
            label="地址"
            rules={[{ required: true, message: "请输入地址" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="tags"
            label="标签"
            rules={[{ required: true, message: "请输入标签" }]}
          >
            <Input placeholder="多个标签用逗号分隔" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="编辑用户"
        open={isEditModalOpen}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
        confirmLoading={modalLoading}
        okText="确认"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: "请输入姓名" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="age"
            label="年龄"
            rules={[{ required: true, message: "请输入年龄" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="address"
            label="地址"
            rules={[{ required: true, message: "请输入地址" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="tags"
            label="标签"
            rules={[{ required: true, message: "请输入标签" }]}
          >
            <Input placeholder="多个标签用逗号分隔" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserTable;
