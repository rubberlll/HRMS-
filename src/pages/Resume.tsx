import React, { useState } from "react";
import {
  Table,
  Card,
  Modal,
  Typography,
  Descriptions,
  Tag,
  Button,
  Space,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

const { Title } = Typography;

// 设置 PDF.js worker 路径
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface ResumeType {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  status:
    | "待处理"
    | "已查看"
    | "已联系"
    | "面试中"
    | "待录用"
    | "已录用"
    | "已入职"
    | "不合适";
  submitTime: string;
  resumeFile: string;
  education: {
    school: string;
    major: string;
    degree: string;
    graduationYear: string;
  };
  experience: {
    company: string;
    position: string;
    duration: string;
    description: string;
  }[];
  interviewProcess?: {
    currentStage: "初筛" | "技术面试" | "HR面试" | "终面" | "offer谈判";
    interviewDate?: string;
    interviewer?: string;
    feedback?: string;
  };
  employmentInfo?: {
    employmentDate?: string;
    department?: string;
    position?: string;
    salary?: string;
    probationPeriod?: string;
    contractPeriod?: string;
  };
}

const mockData: ResumeType[] = [
  {
    id: "1",
    name: "张三",
    position: "前端开发工程师",
    email: "zhangsan@example.com",
    phone: "13800138000",
    status: "待处理",
    submitTime: "2024-03-20 14:30:00",
    resumeFile: "https://example.com/path/to/resume.pdf",
    education: {
      school: "某某大学",
      major: "计算机科学",
      degree: "本科",
      graduationYear: "2023",
    },
    experience: [
      {
        company: "某科技公司",
        position: "前端开发实习生",
        duration: "2022.06 - 2022.12",
        description: "负责公司主要产品的前端开发维护工作",
      },
    ],
  },
];

const Resume = () => {
  const [selectedResume, setSelectedResume] = useState<ResumeType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const columns: ColumnsType<ResumeType> = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "应聘职位",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "投递时间",
      dataIndex: "submitTime",
      key: "submitTime",
      sorter: (a, b) =>
        new Date(a.submitTime).getTime() - new Date(b.submitTime).getTime(),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colorMap = {
          待处理: "gold",
          已查看: "blue",
          已联系: "cyan",
          面试中: "processing",
          待录用: "purple",
          已录用: "success",
          已入职: "green",
          不合适: "red",
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
        <Space>
          <Button
            type="link"
            onClick={() => {
              setSelectedResume(record);
              setIsModalOpen(true);
            }}
          >
            查看详情
          </Button>
          <Button
            type="link"
            onClick={() => {
              setSelectedResume(record);
              setIsPdfModalOpen(true);
            }}
          >
            查看简历附件
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Title level={3}>简历管理</Title>
        <Table
          columns={columns}
          dataSource={mockData}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      <Modal
        title="简历详情"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        width={800}
        footer={[
          <Button key="back" onClick={() => setIsModalOpen(false)}>
            关闭
          </Button>,
          <Button
            key="updateStatus"
            onClick={() => {
              // 这里添加更新状态的逻辑
              setIsModalOpen(false);
            }}
          >
            更新状态
          </Button>,
          <Button
            key="hire"
            type="primary"
            onClick={() => {
              // 这里添加录用信息填写的逻辑
              setIsModalOpen(false);
            }}
          >
            录用
          </Button>,
        ]}
      >
        {selectedResume && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="姓名" span={2}>
              {selectedResume.name}
            </Descriptions.Item>
            <Descriptions.Item label="应聘职位" span={2}>
              {selectedResume.position}
            </Descriptions.Item>
            <Descriptions.Item label="邮箱">
              {selectedResume.email}
            </Descriptions.Item>
            <Descriptions.Item label="电话">
              {selectedResume.phone}
            </Descriptions.Item>

            <Descriptions.Item label="教育背景" span={2}>
              {selectedResume.education.school} -{" "}
              {selectedResume.education.major}
              <br />
              {selectedResume.education.degree} ·{" "}
              {selectedResume.education.graduationYear}年毕业
            </Descriptions.Item>

            <Descriptions.Item label="工作经历" span={2}>
              {selectedResume.experience.map((exp, index) => (
                <div key={index} style={{ marginBottom: 16 }}>
                  <strong>{exp.company}</strong> - {exp.position}
                  <br />
                  {exp.duration}
                  <br />
                  {exp.description}
                </div>
              ))}
            </Descriptions.Item>

            {selectedResume.interviewProcess && (
              <Descriptions.Item label="面试进度" span={2}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div>
                    当前阶段：{selectedResume.interviewProcess.currentStage}
                  </div>
                  {selectedResume.interviewProcess.interviewDate && (
                    <div>
                      面试时间：{selectedResume.interviewProcess.interviewDate}
                    </div>
                  )}
                  {selectedResume.interviewProcess.interviewer && (
                    <div>
                      面试官：{selectedResume.interviewProcess.interviewer}
                    </div>
                  )}
                  {selectedResume.interviewProcess.feedback && (
                    <div>
                      面试反馈：{selectedResume.interviewProcess.feedback}
                    </div>
                  )}
                </Space>
              </Descriptions.Item>
            )}

            {selectedResume.employmentInfo && (
              <Descriptions.Item label="录用信息" span={2}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  {selectedResume.employmentInfo.employmentDate && (
                    <div>
                      入职日期：{selectedResume.employmentInfo.employmentDate}
                    </div>
                  )}
                  {selectedResume.employmentInfo.department && (
                    <div>
                      入职部门：{selectedResume.employmentInfo.department}
                    </div>
                  )}
                  {selectedResume.employmentInfo.position && (
                    <div>职位：{selectedResume.employmentInfo.position}</div>
                  )}
                  {selectedResume.employmentInfo.salary && (
                    <div>薪资：{selectedResume.employmentInfo.salary}</div>
                  )}
                  {selectedResume.employmentInfo.probationPeriod && (
                    <div>
                      试用期：{selectedResume.employmentInfo.probationPeriod}
                    </div>
                  )}
                  {selectedResume.employmentInfo.contractPeriod && (
                    <div>
                      合同期限：{selectedResume.employmentInfo.contractPeriod}
                    </div>
                  )}
                </Space>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      <Modal
        title="简历附件"
        open={isPdfModalOpen}
        onCancel={() => setIsPdfModalOpen(false)}
        width={1000}
        footer={[
          <Button
            key="prev"
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber(pageNumber - 1)}
          >
            上一页
          </Button>,
          <Button
            key="next"
            disabled={pageNumber >= numPages}
            onClick={() => setPageNumber(pageNumber + 1)}
          >
            下一页
          </Button>,
          <Button key="close" onClick={() => setIsPdfModalOpen(false)}>
            关闭
          </Button>,
        ]}
      >
        {selectedResume && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ marginBottom: 10 }}>
              第 {pageNumber} 页 / 共 {numPages} 页
            </div>
            <Document
              file={selectedResume.resumeFile}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              error={
                <div style={{ textAlign: "center", color: "red" }}>
                  无法加载PDF文件，请检查文件是否有效
                </div>
              }
              loading={
                <div style={{ textAlign: "center" }}>正在加载PDF文件...</div>
              }
            >
              <Page
                pageNumber={pageNumber}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                scale={1.5}
              />
            </Document>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Resume;
