import apiClient from './client';
import { Notification } from '../types';

export const notificationsApi = {
  getAll: async (): Promise<Notification[]> => {
    const response = await apiClient.get<Notification[]>('/Notifications');
    return response.data;
  },

  getByUser: async (userId: number, userType: string): Promise<Notification[]> => {
    const response = await apiClient.get<Notification[]>(`/Notifications/${userId}/${userType}`);
    return response.data;
  },

  create: async (notification: Partial<Notification>): Promise<Notification> => {
    const response = await apiClient.post<Notification>('/Notifications', notification);
    return response.data;
  },

  markAsRead: async (id: number): Promise<void> => {
    await apiClient.put(`/Notifications/${id}/read`);
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/Notifications/${id}`);
  },
};

export default notificationsApi;
