import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Descriptions, Card, Spin, message } from "antd";
import axios from "axios";

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

const UserDetail: React.FC = () => {
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<EmployeeType | null>(null);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        console.log("开始");
        const response = await axios.get(`/api/users/${userId}`);
        console.log("API Response:", response.data);

        if (response.data.code === 200) {
          setUserInfo(response.data.data);
        } else {
          message.error(
            `获取用户信息失败：${response.data.message || "未知错误"}`
          );
        }
      } catch (error) {
        console.error("API Error:", error);
        message.error(
          error instanceof Error ? error.message : "获取用户信息失败！"
        );
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserDetail();
    } else {
      message.error("用户ID不存在！");
      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (!userInfo) {
    return <div>未找到用户信息</div>;
  }

  return (
    <Card title={`${userInfo.name}的详细信息`}>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="姓名">{userInfo.name}</Descriptions.Item>
        <Descriptions.Item label="职位">{userInfo.position}</Descriptions.Item>
        <Descriptions.Item label="部门">
          {userInfo.department}
        </Descriptions.Item>
        <Descriptions.Item label="入职日期">
          {userInfo.entryDate}
        </Descriptions.Item>
        <Descriptions.Item label="状态">{userInfo.status}</Descriptions.Item>
        <Descriptions.Item label="薪资">
          {userInfo.employmentInfo.salary}
        </Descriptions.Item>
        <Descriptions.Item label="试用期">
          {userInfo.employmentInfo.probationPeriod}
        </Descriptions.Item>
        <Descriptions.Item label="合同期限">
          {userInfo.employmentInfo.contractPeriod}
        </Descriptions.Item>
        <Descriptions.Item label="学校">
          {userInfo.education.school}
        </Descriptions.Item>
        <Descriptions.Item label="专业">
          {userInfo.education.major}
        </Descriptions.Item>
        <Descriptions.Item label="学历">
          {userInfo.education.degree}
        </Descriptions.Item>
        <Descriptions.Item label="毕业年份">
          {userInfo.education.graduationYear}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default UserDetail;
