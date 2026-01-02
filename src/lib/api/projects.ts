import apiClient from "./client";
import {
  Project,
  ProjectCategory,
  ProjectStatus,
  ProjectOffer,
  CategoryOption,
  StatusOption,
  UpdateProjectDto,
} from "../types";

// Projects API
export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    const response = await apiClient.get<Project[]>("/Projects");
    return response.data;
  },

  getById: async (id: number): Promise<Project> => {
    const response = await apiClient.get<Project>(`/Projects/${id}`);
    return response.data;
  },

  create: async (project: Partial<Project>): Promise<Project> => {
    const response = await apiClient.post<Project>("/Projects", project);
    return response.data;
  },

  update: async (id: number, project: UpdateProjectDto): Promise<Project> => {
    const response = await apiClient.patch<Project>(`/Projects/${id}`, project);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/Projects/${id}`);
  },

  getCategories: async (): Promise<CategoryOption[]> => {
    const response = await apiClient.get<CategoryOption[]>(
      "/Projects/Categories"
    );
    return response.data;
  },

  getStatuses: async (): Promise<StatusOption[]> => {
    const response = await apiClient.get<StatusOption[]>("/Projects/Statuses");
    return response.data;
  },
};

// Project Categories API
export const projectCategoriesApi = {
  getAll: async (): Promise<ProjectCategory[]> => {
    const response = await apiClient.get<ProjectCategory[]>(
      "/ProjectCategories"
    );
    return response.data;
  },

  create: async (
    category: Partial<ProjectCategory>
  ): Promise<ProjectCategory> => {
    const response = await apiClient.post<ProjectCategory>(
      "/ProjectCategories",
      category
    );
    return response.data;
  },

  update: async (
    id: number,
    category: Partial<ProjectCategory>
  ): Promise<ProjectCategory> => {
    const response = await apiClient.put<ProjectCategory>(
      `/ProjectCategories/${id}`,
      category
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/ProjectCategories/${id}`);
  },
};

// Project Statuses API
export const projectStatusesApi = {
  getAll: async (): Promise<ProjectStatus[]> => {
    const response = await apiClient.get<ProjectStatus[]>("/ProjectStatuses");
    return response.data;
  },

  create: async (status: Partial<ProjectStatus>): Promise<ProjectStatus> => {
    const response = await apiClient.post<ProjectStatus>(
      "/ProjectStatuses",
      status
    );
    return response.data;
  },

  update: async (
    id: number,
    status: Partial<ProjectStatus>
  ): Promise<ProjectStatus> => {
    const response = await apiClient.put<ProjectStatus>(
      `/ProjectStatuses/${id}`,
      status
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/ProjectStatuses/${id}`);
  },
};

// Project Offers API
export const projectOffersApi = {
  getAll: async (): Promise<ProjectOffer[]> => {
    const response = await apiClient.get<ProjectOffer[]>("/ProjectOffers");
    return response.data;
  },

  getById: async (id: number): Promise<ProjectOffer> => {
    const response = await apiClient.get<ProjectOffer>(`/ProjectOffers/${id}`);
    return response.data;
  },

  create: async (offer: Partial<ProjectOffer>): Promise<ProjectOffer> => {
    const response = await apiClient.post<ProjectOffer>(
      "/ProjectOffers",
      offer
    );
    return response.data;
  },

  update: async (
    id: number,
    offer: Partial<ProjectOffer>
  ): Promise<ProjectOffer> => {
    const response = await apiClient.put<ProjectOffer>(
      `/ProjectOffers/${id}`,
      offer
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/ProjectOffers/${id}`);
  },
};
