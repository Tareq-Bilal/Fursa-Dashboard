import apiClient from './client';
import { Course, CourseField, FreelancerRating } from '../types';

// Courses API
export const coursesApi = {
  getAll: async (): Promise<Course[]> => {
    const response = await apiClient.get<Course[]>('/Courses');
    return response.data;
  },

  getById: async (id: number): Promise<Course> => {
    const response = await apiClient.get<Course>(`/Courses/${id}`);
    return response.data;
  },

  create: async (course: Partial<Course>): Promise<Course> => {
    const response = await apiClient.post<Course>('/Courses', course);
    return response.data;
  },

  update: async (id: number, course: Partial<Course>): Promise<Course> => {
    const response = await apiClient.put<Course>(`/Courses/${id}`, course);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/Courses/${id}`);
  },
};

// Course Fields API
export const courseFieldsApi = {
  getAll: async (): Promise<CourseField[]> => {
    const response = await apiClient.get<CourseField[]>('/CourseFields');
    return response.data;
  },

  create: async (field: Partial<CourseField>): Promise<CourseField> => {
    const response = await apiClient.post<CourseField>('/CourseFields', field);
    return response.data;
  },

  update: async (id: number, field: Partial<CourseField>): Promise<CourseField> => {
    const response = await apiClient.put<CourseField>(`/CourseFields/${id}`, field);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/CourseFields/${id}`);
  },
};

// Freelancer Ratings API
export const ratingsApi = {
  getAll: async (): Promise<FreelancerRating[]> => {
    const response = await apiClient.get<FreelancerRating[]>('/FreelancerRatings');
    return response.data;
  },

  getById: async (id: number): Promise<FreelancerRating> => {
    const response = await apiClient.get<FreelancerRating>(`/FreelancerRatings/${id}`);
    return response.data;
  },

  create: async (rating: Partial<FreelancerRating>): Promise<FreelancerRating> => {
    const response = await apiClient.post<FreelancerRating>('/FreelancerRatings', rating);
    return response.data;
  },

  update: async (id: number, rating: Partial<FreelancerRating>): Promise<FreelancerRating> => {
    const response = await apiClient.put<FreelancerRating>(`/FreelancerRatings/${id}`, rating);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/FreelancerRatings/${id}`);
  },
};
