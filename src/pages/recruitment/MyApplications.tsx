import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Modal,
  Spin,
  Descriptions,
  Space,
  Typography,
} from "antd";
import request from "../../utils/request";

const MyApplications: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentResume, setCurrentResume] = useState<any>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await request.get("/resumes");
      setApplications(response.data.data || []);
    } catch (error) {
      console.error("获取申请记录失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (resume: any) => {
    setCurrentResume(resume);
    setPreviewVisible(true);
  };

  const handleViewDetails = (resume: any) => {
    setCurrentResume(resume);
    setDetailVisible(true);
  };

  // 添加一个辅助函数来获取正确的文件URL
  const getFileUrl = (url: string) => {
    // 如果URL已经是完整的URL，则直接返回
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    // 否则，确保URL以/api开头
    if (!url.startsWith("/api")) {
      return `/api${url}`;
    }
    return url;
  };

  const columns = [
    {
      title: "申请职位",
      dataIndex: "jobId",
      key: "position",
      render: (jobId: any) => jobId?.title || "未知职位",
    },
    {
      title: "申请时间",
      dataIndex: "submittedAt",
      key: "applyDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusMap: Record<string, { text: string; color: string }> = {
          pending: { text: "待处理", color: "blue" },
          reviewed: { text: "已审核", color: "orange" },
          hired: { text: "已录用", color: "green" },
          rejected: { text: "已拒绝", color: "red" },
        };

        const { text, color } = statusMap[status] || {
          text: status,
          color: "default",
        };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" onClick={() => handlePreview(record)}>
            预览简历
          </Button>
          <Button type="link" onClick={() => handleViewDetails(record)}>
            查看详情
          </Button>
        </Space>
      ),
    },
  ];

  const renderEducation = (education: any) => {
    if (!education) return "暂无教育信息";
    return (
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="学校">
          {education.school || "未填写"}
        </Descriptions.Item>
        <Descriptions.Item label="专业">
          {education.major || "未填写"}
        </Descriptions.Item>
        <Descriptions.Item label="学位">
          {education.degree || "未填写"}
        </Descriptions.Item>
        <Descriptions.Item label="毕业年份">
          {education.graduationYear || "未填写"}
        </Descriptions.Item>
      </Descriptions>
    );
  };

  const renderExperience = (experiences: any[]) => {
    if (!experiences || experiences.length === 0) return "暂无工作经验";

    return experiences.map((exp, index) => (
      <Descriptions
        key={index}
        column={1}
        bordered
        size="small"
        style={{ marginBottom: 16 }}
      >
        <Descriptions.Item label="公司">
          {exp.company || "未填写"}
        </Descriptions.Item>
        <Descriptions.Item label="职位">
          {exp.position || "未填写"}
        </Descriptions.Item>
        <Descriptions.Item label="时间段">
          {exp.duration || "未填写"}
        </Descriptions.Item>
        <Descriptions.Item label="描述">
          {exp.description || "未填写"}
        </Descriptions.Item>
      </Descriptions>
    ));
  };

  return (
    <div style={{ padding: "24px" }}>
      <h2>我的申请记录</h2>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={applications}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </Spin>

      {/* 简历预览模态框 */}
      <Modal
        title="简历预览"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={800}
        bodyStyle={{ height: "80vh" }}
      >
        {currentResume && (
          <iframe
            src={getFileUrl(currentResume.fileUrl)}
            style={{ width: "100%", height: "100%" }}
            title="简历预览"
          />
        )}
      </Modal>

      {/* 简历详情模态框 */}
      <Modal
        title="申请详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={700}
      >
        {currentResume && (
          <div>
            <Descriptions bordered column={1} style={{ marginBottom: 20 }}>
              <Descriptions.Item label="申请职位">
                {currentResume.jobId?.title || "未知职位"}
              </Descriptions.Item>
              <Descriptions.Item label="申请时间">
                {new Date(currentResume.submittedAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                {(() => {
                  const statusMap: Record<
                    string,
                    { text: string; color: string }
                  > = {
                    pending: { text: "待处理", color: "blue" },
                    reviewed: { text: "已审核", color: "orange" },
                    hired: { text: "已录用", color: "green" },
                    rejected: { text: "已拒绝", color: "red" },
                  };

                  const { text, color } = statusMap[currentResume.status] || {
                    text: currentResume.status,
                    color: "default",
                  };
                  return <Tag color={color}>{text}</Tag>;
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="简历文件">
                <Space>
                  <Typography.Text>{currentResume.fileName}</Typography.Text>
                  <Button
                    type="link"
                    onClick={() =>
                      window.open(getFileUrl(currentResume.fileUrl))
                    }
                  >
                    下载
                  </Button>
                </Space>
              </Descriptions.Item>
            </Descriptions>

            <Typography.Title level={5}>教育背景</Typography.Title>
            {renderEducation(currentResume.education)}

            <Typography.Title level={5} style={{ marginTop: 20 }}>
              工作经验
            </Typography.Title>
            {renderExperience(currentResume.workExperience)}

            <Typography.Title level={5} style={{ marginTop: 20 }}>
              技能
            </Typography.Title>
            {currentResume.skills && currentResume.skills.length > 0 ? (
              <div>
                {currentResume.skills.map((skill: string, index: number) => (
                  <Tag key={index} style={{ margin: "5px" }}>
                    {skill}
                  </Tag>
                ))}
              </div>
            ) : (
              "暂无技能信息"
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyApplications;
