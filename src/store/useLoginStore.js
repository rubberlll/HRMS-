import { create } from "zustand";
import request from "../utils/request";

export const useLoginStore = create((set) => ({
  token: localStorage.getItem("token") || "",
  userInfo: JSON.parse(localStorage.getItem("userInfo") || "null"),

  setLogin: async (userData) => {
    try {
      const response = await request.post("/login", userData);

      if (response.code === 200) {
        // 存储token和用户信息
        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "userInfo",
          JSON.stringify(response.data.userInfo)
        );

        set({
          token: response.data.token,
          userInfo: response.data.userInfo,
        });

        return response.data;
      } else {
        throw new Error(response.message || "登录失败");
      }
    } catch (error) {
      console.error("登录失败:", error.message);
      throw error;
    }
  },

  verifyToken: async () => {
    try {
      const response = await request.get("/verify-token");
      return response.code === 200;
    } catch (error) {
      console.error("token验证失败:", error.message);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    set({ token: "", userInfo: null });
  },
}));
