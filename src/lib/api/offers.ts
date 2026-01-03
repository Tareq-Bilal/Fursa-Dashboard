import apiClient from "./client";
import {
  ProjectOffer,
  CreateProjectOfferDto,
  UpdateProjectOfferDto,
  PatchOfferStatusDto,
  OfferSearchParams,
} from "../types";

// Project Offers API
export const offersApi = {
  // GET /api/ProjectOffers - Get all offers
  getAll: async (): Promise<ProjectOffer[]> => {
    const response = await apiClient.get<ProjectOffer[]>("/ProjectOffers");
    return response.data;
  },

  // GET /api/ProjectOffers/{id} - Get offer by ID
  getById: async (id: number): Promise<ProjectOffer> => {
    const response = await apiClient.get<ProjectOffer>(`/ProjectOffers/${id}`);
    return response.data;
  },

  // GET /api/ProjectOffers/project/{projectID} - Get offers by project
  getByProjectId: async (projectId: number): Promise<ProjectOffer[]> => {
    const response = await apiClient.get<ProjectOffer[]>(
      `/ProjectOffers/project/${projectId}`
    );
    return response.data;
  },

  // GET /api/ProjectOffers/applicant/{applicantID} - Get offers by freelancer
  getByApplicantId: async (applicantId: number): Promise<ProjectOffer[]> => {
    const response = await apiClient.get<ProjectOffer[]>(
      `/ProjectOffers/applicant/${applicantId}`
    );
    return response.data;
  },

  // GET /api/ProjectOffers/applicant/{applicantID}/count - Get offer count by freelancer
  getCountByApplicantId: async (applicantId: number): Promise<number> => {
    const response = await apiClient.get<number>(
      `/ProjectOffers/applicant/${applicantId}/count`
    );
    return response.data;
  },

  // GET /api/ProjectOffers/project/{projectID}/applicant/{applicantID} - Get offer by project & applicant
  getByProjectAndApplicant: async (
    projectId: number,
    applicantId: number
  ): Promise<ProjectOffer> => {
    const response = await apiClient.get<ProjectOffer>(
      `/ProjectOffers/project/${projectId}/applicant/${applicantId}`
    );
    return response.data;
  },

  // GET /api/ProjectOffers/search - Search offers with filters
  search: async (params: OfferSearchParams): Promise<ProjectOffer[]> => {
    const response = await apiClient.get<ProjectOffer[]>(
      "/ProjectOffers/search",
      { params }
    );
    return response.data;
  },

  // POST /api/ProjectOffers - Create new offer
  create: async (offer: CreateProjectOfferDto): Promise<ProjectOffer> => {
    const response = await apiClient.post<ProjectOffer>(
      "/ProjectOffers",
      offer
    );
    return response.data;
  },

  // PUT /api/ProjectOffers/{id} - Update offer
  update: async (
    id: number,
    offer: UpdateProjectOfferDto
  ): Promise<ProjectOffer> => {
    const response = await apiClient.put<ProjectOffer>(
      `/ProjectOffers/${id}`,
      offer
    );
    return response.data;
  },

  // PATCH /api/ProjectOffers/status - Update offer status
  updateStatus: async (data: PatchOfferStatusDto): Promise<ProjectOffer> => {
    const response = await apiClient.patch<ProjectOffer>(
      "/ProjectOffers/status",
      data
    );
    return response.data;
  },

  // DELETE /api/ProjectOffers/{id} - Delete offer
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/ProjectOffers/${id}`);
  },
};

export default offersApi;
