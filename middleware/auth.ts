import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

interface DecodedToken {
  userId: string;
  username: string;
  role: string;
}

export function authMiddleware(handler: any) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          code: 401,
          message: "未提供token",
          data: null,
        });
      }

      const token = authHeader.split(" ")[1];
      const secret = process.env.JWT_SECRET || "your-secret-key";

      try {
        const decoded = jwt.verify(token, secret) as DecodedToken;

        // 将解码后的用户信息添加到请求对象中
        (req as any).user = decoded;

        return handler(req, res);
      } catch (error) {
        return res.status(401).json({
          code: 401,
          message: "无效的token",
          data: null,
        });
      }
    } catch (error) {
      return res.status(500).json({
        code: 500,
        message: "服务器错误",
        data: null,
      });
    }
  };
}

export function roleCheck(roles: string[]) {
  return (handler: any) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        const user = (req as any).user;

        if (!user) {
          return res.status(401).json({
            code: 401,
            message: "请先登录",
            data: null,
          });
        }

        if (!roles.includes(user.role)) {
          return res.status(403).json({
            code: 403,
            message: "权限不足",
            data: null,
          });
        }

        return handler(req, res);
      } catch (error) {
        return res.status(500).json({
          code: 500,
          message: "服务器错误",
          data: null,
        });
      }
    };
  };
}
