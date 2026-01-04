import apiClient from "./client";
import {
  Course,
  CourseField,
  FreelancerRating,
  CreateCourseDto,
  UpdateCourseDto,
  CourseFieldOption,
} from "../types";

// Courses API
export const coursesApi = {
  // GET Endpoints
  getAll: async (): Promise<Course[]> => {
    const response = await apiClient.get<Course[]>("/Courses");
    return response.data;
  },

  getById: async (id: number): Promise<Course> => {
    const response = await apiClient.get<Course>(`/Courses/${id}`);
    return response.data;
  },

  getFields: async (): Promise<CourseFieldOption[]> => {
    const response = await apiClient.get<CourseFieldOption[]>(
      "/Courses/fields"
    );
    return response.data;
  },

  getActive: async (): Promise<Course[]> => {
    const response = await apiClient.get<Course[]>("/Courses/active");
    return response.data;
  },

  getByContributor: async (contributorId: number): Promise<Course[]> => {
    const response = await apiClient.get<Course[]>(
      `/Courses/contributor/${contributorId}`
    );
    return response.data;
  },

  getByField: async (fieldId: number): Promise<Course[]> => {
    const response = await apiClient.get<Course[]>(`/Courses/field/${fieldId}`);
    return response.data;
  },

  search: async (term: string): Promise<Course[]> => {
    const response = await apiClient.get<Course[]>(
      `/Courses/search?term=${encodeURIComponent(term)}`
    );
    return response.data;
  },

  // Statistics Endpoints
  getTotalCount: async (): Promise<number> => {
    const response = await apiClient.get<number>("/Courses/statistics/count");
    return response.data;
  },

  getActiveCount: async (): Promise<number> => {
    const response = await apiClient.get<number>(
      "/Courses/statistics/active-count"
    );
    return response.data;
  },

  getCountByContributor: async (contributorId: number): Promise<number> => {
    const response = await apiClient.get<number>(
      `/Courses/contributor/${contributorId}/count`
    );
    return response.data;
  },

  getCountByField: async (fieldId: number): Promise<number> => {
    const response = await apiClient.get<number>(
      `/Courses/field/${fieldId}/count`
    );
    return response.data;
  },

  // Write Operations
  create: async (course: CreateCourseDto): Promise<Course> => {
    const response = await apiClient.post<Course>("/Courses", course);
    return response.data;
  },

  update: async (id: number, course: UpdateCourseDto): Promise<Course> => {
    const response = await apiClient.put<Course>(`/Courses/${id}`, course);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/Courses/${id}`);
  },

  incrementLearners: async (id: number): Promise<void> => {
    await apiClient.patch(`/Courses/${id}/increment-learners`);
  },

  toggleActive: async (id: number): Promise<void> => {
    await apiClient.patch(`/Courses/${id}/toggle-active`, { courseId: id });
  },
};

// Course Fields API
export interface CreateCourseFieldDto {
  field: string;
}

export interface UpdateCourseFieldDto {
  id: number;
  field: string;
}

export const courseFieldsApi = {
  getAll: async (): Promise<CourseField[]> => {
    const response = await apiClient.get<CourseField[]>("/CourseFields");
    return response.data;
  },

  getById: async (id: number): Promise<CourseField> => {
    const response = await apiClient.get<CourseField>(`/CourseFields/${id}`);
    return response.data;
  },

  create: async (data: CreateCourseFieldDto): Promise<CourseField> => {
    const response = await apiClient.post<CourseField>("/CourseFields", data);
    return response.data;
  },

  update: async (id: number, data: UpdateCourseFieldDto): Promise<CourseField> => {
    const response = await apiClient.put<CourseField>(
      `/CourseFields/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/CourseFields/${id}`);
  },
};

// Freelancer Ratings API
export const ratingsApi = {
  getAll: async (): Promise<FreelancerRating[]> => {
    const response = await apiClient.get<FreelancerRating[]>(
      "/FreelancerRatings"
    );
    return response.data;
  },

  getById: async (id: number): Promise<FreelancerRating> => {
    const response = await apiClient.get<FreelancerRating>(
      `/FreelancerRatings/${id}`
    );
    return response.data;
  },

  create: async (
    rating: Partial<FreelancerRating>
  ): Promise<FreelancerRating> => {
    const response = await apiClient.post<FreelancerRating>(
      "/FreelancerRatings",
      rating
    );
    return response.data;
  },

  update: async (
    id: number,
    rating: Partial<FreelancerRating>
  ): Promise<FreelancerRating> => {
    const response = await apiClient.put<FreelancerRating>(
      `/FreelancerRatings/${id}`,
      rating
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/FreelancerRatings/${id}`);
  },
};
