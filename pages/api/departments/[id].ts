import type { NextApiRequest, NextApiResponse } from "next";
import Department from "../../../models/Department";
import dbConnect from "../../../lib/mongodb";
import { authMiddleware } from "../../../middleware/auth";
import mongoose from "mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    query: { id },
  } = req;

  // 验证token
  try {
    await authMiddleware(req);
  } catch (error) {
    return res.status(401).json({ code: 401, message: "未授权", data: null });
  }

  // 验证ID格式
  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    return res.status(400).json({
      code: 400,
      message: "无效的部门ID",
      data: null,
    });
  }

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const department = await Department.findById(id)
          .populate("manager", "name email")
          .populate("parentDepartment", "name");

        if (!department) {
          return res.status(404).json({
            code: 404,
            message: "部门不存在",
            data: null,
          });
        }

        return res.status(200).json({
          code: 200,
          message: "获取部门详情成功",
          data: department,
        });
      } catch (error) {
        return res.status(500).json({
          code: 500,
          message: "获取部门详情失败",
          data: null,
        });
      }

    case "PUT":
      try {
        const department = await Department.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });

        if (!department) {
          return res.status(404).json({
            code: 404,
            message: "部门不存在",
            data: null,
          });
        }

        return res.status(200).json({
          code: 200,
          message: "更新部门成功",
          data: department,
        });
      } catch (error: any) {
        if (error.code === 11000) {
          return res.status(400).json({
            code: 400,
            message: "部门名称已存在",
            data: null,
          });
        }
        return res.status(500).json({
          code: 500,
          message: "更新部门失败",
          data: null,
        });
      }

    case "DELETE":
      try {
        const department = await Department.findByIdAndDelete(id);

        if (!department) {
          return res.status(404).json({
            code: 404,
            message: "部门不存在",
            data: null,
          });
        }

        return res.status(200).json({
          code: 200,
          message: "删除部门成功",
          data: department,
        });
      } catch (error) {
        return res.status(500).json({
          code: 500,
          message: "删除部门失败",
          data: null,
        });
      }

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).json({
        code: 405,
        message: `方法 ${method} 不允许`,
        data: null,
      });
  }
}
