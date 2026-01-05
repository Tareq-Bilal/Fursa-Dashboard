import apiClient from "./client";
import { Notification, NotificationsResponse } from "../types";

export interface GetNotificationsParams {
  skip?: number;
  take?: number;
}

export const notificationsApi = {
  getAll: async (
    params: GetNotificationsParams = { skip: 0, take: 100 }
  ): Promise<Notification[]> => {
    const response = await apiClient.get<Notification[]>("/notifications/all", {
      params: {
        skip: params.skip ?? 0,
        take: params.take ?? 100,
      },
    });
    return response.data;
  },

  getByUser: async (
    userId: number,
    userType: string
  ): Promise<Notification[]> => {
    const response = await apiClient.get<Notification[]>(
      `/notifications/${userId}/${userType}`
    );
    return response.data;
  },

  create: async (
    notification: Partial<Notification>
  ): Promise<Notification> => {
    const response = await apiClient.post<Notification>(
      "/notifications",
      notification
    );
    return response.data;
  },

  markAsRead: async (
    notificationId: number,
    userType: string,
    userId: number
  ): Promise<void> => {
    await apiClient.put(
      `/notifications/${notificationId}/read/${userType}/${userId}`,
      {
        notificationId,
        userId,
        userType,
      }
    );
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/notifications/${id}`);
  },
};

export default notificationsApi;
