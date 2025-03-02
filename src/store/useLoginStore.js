import { create } from "zustand";
import axios from "axios";
export const useLoginStore = create((set) => ({
  token: "",
  /// token 是登录后返回的 token
  setLogin: async (userData) => {
    try {
      const res = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `登录失败: HTTP error! status: ${res.status}`
        );
      }

      const data = await res.json();
      set({ token: data.token });
      console.log(data);
    } catch (error) {
      console.error("登录失败:", error.message);
      throw error; // 向上抛出错误，让调用者处理
    }
  },
  //登录

  //退出登录
}));
