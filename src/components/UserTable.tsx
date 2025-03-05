import React, { useState, useEffect } from "react";
import {
  Space,
  Table,
  Tag,
  Input,
  Button,
  Modal,
  Form,
  message,
  Descriptions,
  Row,
  Col,
  DatePicker,
  Select,
} from "antd";
import type { TableProps } from "antd";
import Mock from "mockjs";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

interface EmployeeType {
  key: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  status: "试用期" | "正式" | "离职";
  entryDate: string;
  employmentInfo: {
    salary: string;
    probationPeriod: string;
    contractPeriod: string;
  };
  education: {
    school: string;
    major: string;
    degree: string;
    graduationYear: string;
  };
}

const UserTable: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState<EmployeeType[]>([]);
  const [filteredData, setFilteredData] = useState<EmployeeType[]>([]);
  const [pageSize, setPageSize] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<EmployeeType | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<EmployeeType | null>(
    null
  );
  const navigate = useNavigate();

  const columns: TableProps<EmployeeType>["columns"] = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "职位",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "部门",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "入职日期",
      dataIndex: "entryDate",
      key: "entryDate",
      sorter: (a, b) =>
        new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime(),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colorMap = {
          试用期: "processing",
          正式: "success",
          离职: "default",
        };
        return (
          <Tag color={colorMap[status as keyof typeof colorMap]}>{status}</Tag>
        );
      },
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" onClick={() => handleViewDetails(record)}>
            查看详情
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
        status: values.status as "试用期" | "正式" | "离职",
        entryDate: values.entryDate.format("YYYY-MM-DD"),
        employmentInfo: {
          salary: values.employmentInfo.salary,
          probationPeriod: values.employmentInfo.probationPeriod,
          contractPeriod: values.employmentInfo.contractPeriod,
        },
        education: {
          school: values.education.school,
          major: values.education.major,
          degree: values.education.degree,
          graduationYear: values.education.graduationYear,
        },
      };
      setData([...data, newUser]);
      setFilteredData([...data, newUser]);
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
        status: values.status as "试用期" | "正式" | "离职",
        entryDate: values.entryDate.format("YYYY-MM-DD"),
        employmentInfo: {
          salary: values.employmentInfo.salary,
          probationPeriod: values.employmentInfo.probationPeriod,
          contractPeriod: values.employmentInfo.contractPeriod,
        },
        education: {
          school: values.education.school,
          major: values.education.major,
          degree: values.education.degree,
          graduationYear: values.education.graduationYear,
        },
      };
      const newData = data.map((item) =>
        item.key === editingRecord!.key ? updatedUser : item
      );
      setData(newData);
      setFilteredData(newData);
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

  const handleEdit = (record: EmployeeType) => {
    setEditingRecord(record);
    form.setFieldsValue({
      name: record.name,
      position: record.position,
      department: record.department,
      email: record.email,
      phone: record.phone,
      entryDate: dayjs(record.entryDate),
      status: record.status,
      employmentInfo: {
        salary: record.employmentInfo.salary,
        probationPeriod: record.employmentInfo.probationPeriod,
        contractPeriod: record.employmentInfo.contractPeriod,
      },
      education: {
        school: record.education.school,
        major: record.education.major,
        degree: record.education.degree,
        graduationYear: record.education.graduationYear,
      },
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (record: EmployeeType) => {
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除用户 ${record.name} 吗？`,
      okText: "确认",
      cancelText: "取消",
      okButtonProps: { danger: true },
      async onOk() {
        try {
          setLoading(true);
          const newData = data.filter((item) => item.key !== record.key);
          setData(newData);
          setFilteredData(newData);
          message.success("删除用户成功！");
        } catch (error) {
          message.error("删除用户失败，请重试！");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleViewDetails = (record: EmployeeType) => {
    setSelectedRecord(record);
    setIsDetailsModalOpen(true);
  };

  const handleDetailsModalClose = () => {
    setIsDetailsModalOpen(false);
    setSelectedRecord(null);
  };

  const fetchMockData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/users");
      if (response.data.code === 200) {
        setData(response.data.data);
        setFilteredData(response.data.data);
      } else {
        message.error("获取数据失败！");
      }
    } catch (error) {
      message.error("获取数据失败！");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMockData();
  }, []);

  const renderForm = () => (
    <Form form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: "请输入姓名" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="position"
            label="职位"
            rules={[{ required: true, message: "请输入职位" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="department"
            label="部门"
            rules={[{ required: true, message: "请输入部门" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="entryDate"
            label="入职日期"
            rules={[{ required: true, message: "请选择入职日期" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name={["employmentInfo", "salary"]}
            label="薪资"
            rules={[{ required: true, message: "请输入薪资" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: "请选择状态" }]}
          >
            <Select>
              <Select.Option value="试用期">试用期</Select.Option>
              <Select.Option value="正式">正式</Select.Option>
              <Select.Option value="离职">离职</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name={["education", "school"]}
        label="学校"
        rules={[{ required: true, message: "请输入学校" }]}
      >
        <Input />
      </Form.Item>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name={["education", "major"]}
            label="专业"
            rules={[{ required: true, message: "请输入专业" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name={["education", "degree"]}
            label="学历"
            rules={[{ required: true, message: "请选择学历" }]}
          >
            <Select>
              <Select.Option value="专科">专科</Select.Option>
              <Select.Option value="本科">本科</Select.Option>
              <Select.Option value="硕士">硕士</Select.Option>
              <Select.Option value="博士">博士</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name={["education", "graduationYear"]}
            label="毕业年份"
            rules={[{ required: true, message: "请输入毕业年份" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );

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

      <Table<EmployeeType>
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
        {renderForm()}
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
        {renderForm()}
      </Modal>

      <Modal
        title={
          selectedRecord ? `${selectedRecord.name}的详细信息` : "员工详细信息"
        }
        open={isDetailsModalOpen}
        onCancel={handleDetailsModalClose}
        width={800}
        footer={[
          <Button key="close" onClick={handleDetailsModalClose}>
            关闭
          </Button>,
        ]}
      >
        {selectedRecord && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="姓名">
              {selectedRecord.name}
            </Descriptions.Item>
            <Descriptions.Item label="职位">
              {selectedRecord.position}
            </Descriptions.Item>
            <Descriptions.Item label="部门">
              {selectedRecord.department}
            </Descriptions.Item>
            <Descriptions.Item label="入职日期">
              {selectedRecord.entryDate}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              {selectedRecord.status}
            </Descriptions.Item>
            <Descriptions.Item label="薪资">
              {selectedRecord.employmentInfo.salary}
            </Descriptions.Item>
            <Descriptions.Item label="试用期">
              {selectedRecord.employmentInfo.probationPeriod}
            </Descriptions.Item>
            <Descriptions.Item label="合同期限">
              {selectedRecord.employmentInfo.contractPeriod}
            </Descriptions.Item>
            <Descriptions.Item label="学校">
              {selectedRecord.education.school}
            </Descriptions.Item>
            <Descriptions.Item label="专业">
              {selectedRecord.education.major}
            </Descriptions.Item>
            <Descriptions.Item label="学历">
              {selectedRecord.education.degree}
            </Descriptions.Item>
            <Descriptions.Item label="毕业年份">
              {selectedRecord.education.graduationYear}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </>
  );
};

export default UserTable;
