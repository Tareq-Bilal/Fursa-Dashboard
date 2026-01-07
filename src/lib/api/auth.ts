import apiClient from "./client";
import { LoginRequest, LoginResponse } from "../types";
import Cookies from "js-cookie";

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      "/Auth/login",
      credentials
    );
    return response.data;
  },

  refreshToken: async (
    refreshToken: string
  ): Promise<{ token: string; refreshToken: string }> => {
    const response = await apiClient.post("/Auth/refresh-token", {
      refreshToken,
    });
    return response.data;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post("/Auth/forgot-password", { email });
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post("/Auth/reset-password", { token, newPassword });
  },

  logout: () => {
    Cookies.remove("auth_token");
    Cookies.remove("refresh_token");
    Cookies.remove("user");
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },

  setAuthTokens: (
    token: string,
    refreshToken: string,
    rememberMe: boolean = false
  ) => {
    const tokenExpiry = rememberMe ? 1 / 24 : 1 / 24; // 1 hour
    const refreshExpiry = rememberMe ? 7 : 1; // 7 days or 1 day

    Cookies.set("auth_token", token, { expires: tokenExpiry });
    Cookies.set("refresh_token", refreshToken, { expires: refreshExpiry });
  },

  setUser: (user: object) => {
    Cookies.set("user", JSON.stringify(user), { expires: 7 });
  },

  getUser: () => {
    const userStr = Cookies.get("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  isAuthenticated: (): boolean => {
    return !!Cookies.get("auth_token");
  },
};

export default authApi;
