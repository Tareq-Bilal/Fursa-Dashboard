import apiClient from "./client";
import { Admin, Customer, Freelancer, Contributor } from "../types";

// Admins API
export const adminsApi = {
  getAll: async (): Promise<Admin[]> => {
    const response = await apiClient.get<Admin[]>("/Admins");
    return response.data;
  },

  getById: async (id: string): Promise<Admin> => {
    const response = await apiClient.get<Admin>(`/Admins/${id}`);
    return response.data;
  },

  create: async (admin: Partial<Admin>): Promise<Admin> => {
    const response = await apiClient.post<Admin>("/Admins", admin);
    return response.data;
  },

  update: async (id: string, admin: Partial<Admin>): Promise<Admin> => {
    const response = await apiClient.put<Admin>(`/Admins/${id}`, admin);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/Admins/${id}`);
  },
};

// Customers API
export const customersApi = {
  getAll: async (): Promise<Customer[]> => {
    const response = await apiClient.get<Customer[]>("/Customers");
    return response.data;
  },

  getById: async (id: number): Promise<Customer> => {
    const response = await apiClient.get<Customer>(`/Customers/${id}`);
    return response.data;
  },

  create: async (customer: Partial<Customer>): Promise<Customer> => {
    const response = await apiClient.post<Customer>("/Customers", customer);
    return response.data;
  },

  update: async (
    id: number,
    customer: Partial<Customer>
  ): Promise<Customer> => {
    const response = await apiClient.put<Customer>(
      `/Customers/${id}`,
      customer
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/Customers/${id}`);
  },

  search: async (query: string): Promise<Customer[]> => {
    const response = await apiClient.get<Customer[]>(
      `/Customers/search?query=${encodeURIComponent(query)}`
    );
    return response.data;
  },

  activate: async (id: number): Promise<void> => {
    await apiClient.patch(`/Customers/${id}/activate`);
  },

  deactivate: async (id: number): Promise<void> => {
    await apiClient.patch(`/Customers/${id}/deactivate`);
  },
};

// Freelancers API
export const freelancersApi = {
  getAll: async (): Promise<Freelancer[]> => {
    const response = await apiClient.get<Freelancer[]>("/Freelancers");
    return response.data;
  },

  getById: async (id: number): Promise<Freelancer> => {
    const response = await apiClient.get<Freelancer>(`/Freelancers/${id}`);
    return response.data;
  },

  create: async (freelancer: Partial<Freelancer>): Promise<Freelancer> => {
    const response = await apiClient.post<Freelancer>(
      "/Freelancers",
      freelancer
    );
    return response.data;
  },

  update: async (
    id: number,
    freelancer: Partial<Freelancer>
  ): Promise<Freelancer> => {
    const response = await apiClient.put<Freelancer>(
      `/Freelancers/${id}`,
      freelancer
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/Freelancers/${id}`);
  },
};

// Contributors API
export const contributorsApi = {
  getAll: async (): Promise<Contributor[]> => {
    const response = await apiClient.get<Contributor[]>("/Contributors");
    return response.data;
  },

  getById: async (id: number): Promise<Contributor> => {
    const response = await apiClient.get<Contributor>(`/Contributors/${id}`);
    return response.data;
  },

  create: async (contributor: Partial<Contributor>): Promise<Contributor> => {
    const response = await apiClient.post<Contributor>(
      "/Contributors",
      contributor
    );
    return response.data;
  },

  update: async (
    id: number,
    contributor: Partial<Contributor>
  ): Promise<Contributor> => {
    const response = await apiClient.put<Contributor>(
      `/Contributors/${id}`,
      contributor
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/Contributors/${id}`);
  },
};
