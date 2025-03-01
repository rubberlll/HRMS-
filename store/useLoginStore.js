import { create } from "zustand";

export const useLoginStore = create((set) => ({
  token: "",
  /// token 是登录后返回的 token
  setToken: (token) => set({ token }),
  //登录

  //退出登录
}));
