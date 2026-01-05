// User Types
export interface Admin {
  id: string;
  fullName: string;
  description: string;
  country: string;
  email: string;
  profileImagePath?: string;
  registrationDate: string;
  isActive: boolean;
}

export interface Customer {
  id: number;
  fullName: string;
  jobTitle: string;
  phoneNumber: string;
  country: string;
  email: string;
  profileImagePath?: string;
  registrationDate: string;
  isActive: boolean;
  totalProjectsPosted: number;
  avgRating: number;
}

export interface Freelancer {
  id: number;
  fullName: string;
  jobTitle: string;
  description: string;
  country: string;
  email: string;
  profileImagePath?: string;
  resumePath: string;
  rating: number;
  registrationDate: string;
  isActive: boolean;
  skills: FreelancerSkill[];
  courses: FreelancerCourse[];
  projectOffers: ProjectOffer[];
  projectsGallery: ProjectGallery[];
  receivedRatings: FreelancerRating[];
}

export interface CreateFreelancerDto {
  fullName: string;
  jobTitle: string;
  description: string;
  country: string;
  email: string;
  password: string;
  profileImagePath?: string;
  resumePath?: string;
  rating?: number;
}

export interface UpdateFreelancerDto {
  id: number;
  fullName: string;
  jobTitle: string;
  description: string;
  country: string;
  email: string;
  profileImagePath?: string;
  resumePath?: string;
  rating?: number;
}

export interface Contributor {
  id: number;
  name?: string;
  fullName?: string;
  description: string;
  field: string;
  country: string;
  email: string;
  profileImageUrl?: string;
  profileImagePath?: string;
  profileImage?: string;
  imageUrl?: string;
  registrationDate: string;
  isActive: boolean;
}

export interface CreateContributorDto {
  name: string;
  description: string;
  field: string;
  country: string;
  email: string;
  password: string;
  profileImageUrl?: string;
}

export interface UpdateContributorDto {
  id: number;
  name: string;
  description: string;
  field: string;
  country: string;
  email: string;
  profileImageUrl?: string;
  isActive?: boolean;
}

export interface FreelancerSkill {
  id: number;
  freelancerID: number;
  skillName: string;
}

export interface CreateFreelancerSkillDto {
  freelancerID: number;
  skillName: string;
}

export interface UpdateFreelancerSkillDto {
  id: number;
  freelancerID: number;
  skillName: string;
}

export interface FreelancerCourse {
  id: number;
  freelancerID: number;
  courseID: number;
  progressPercentage: number;
  freelancerName: string;
  courseTitle: string;
  courseDescription: string;
  courseLink: string;
  courseImageUrl: string;
  courseFieldName: string;
  contributorName: string;
}

export interface ContributorCourse {
  id: number;
  contributorID: number;
  contributorName: string;
  courseFieldID: number;
  courseFieldName: string;
  title: string;
  description: string;
  courseLink: string;
  courseImageUrl: string;
  isActive: boolean;
  learnersCount: number;
  createdDate: string;
}

export interface ProjectGallery {
  id: number;
  imageUrl: string;
  title: string;
}

// Project Types
export interface Project {
  id: number;
  publisherId: number;
  publisherName: string;
  publisherTitle: string;
  projectDescription: string;
  projectStatusId: number;
  projectStatusName?: string;
  publishingDate: string;
  projectBudget: number;
  executionTime: number;
  applicationsCount: number;
  projectCategories: ProjectCategoryMapping[];
  projectSkills: ProjectSkill[];
  projectOffers: ProjectOffer[];
}

export interface UpdateProjectDto {
  projectId: number;
  publisherID: number;
  publisherName: string;
  publisherTitle: string;
  projectDescription: string;
  projectStatusID: number;
  projectBudget: number;
  executionTime: number;
  categoryIDs: number[];
}

export interface CreateProjectDto {
  publisherID: number;
  publisherTitle: string;
  projectDescription: string;
  projectStatusID: number;
  projectBudget: number;
  executionTime: number;
  categoryIDs: number[];
}

// Offer Status Constants
export const OfferStatus = {
  PENDING: 1,
  ACCEPTED: 2,
  REJECTED: 3,
  CLOSED: 4,
} as const;

export type OfferStatusType = (typeof OfferStatus)[keyof typeof OfferStatus];

export const OfferStatusLabels: Record<OfferStatusType, string> = {
  [OfferStatus.PENDING]: "Pending",
  [OfferStatus.ACCEPTED]: "Accepted",
  [OfferStatus.REJECTED]: "Rejected",
  [OfferStatus.CLOSED]: "Closed",
};

export interface ProjectOffer {
  id: number;
  projectId?: number;
  projectID?: number;
  projectDescription?: string;
  projectTitle?: string;
  publisherTitle?: string;
  applicantId?: number;
  applicantID?: number;
  applicantName?: string;
  applicantImagePath?: string;
  executionDays: number;
  offerAmount: number;
  offerDescription: string;
  offerDate: string;
  offerStatusID: number;
  offerStatus?: boolean; // Keep for backward compatibility
  applicantAverageRating?: number;
  applicantTotalRatings?: number;
}

export interface CreateProjectOfferDto {
  projectID: number;
  applicantID: number;
  executionDays: number;
  offerAmount: number;
  offerDescription: string;
}

export interface UpdateProjectOfferDto {
  id: number;
  projectID: number;
  applicantID: number;
  executionDays: number;
  offerAmount: number;
  offerDescription: string;
}

export interface PatchOfferStatusDto {
  offerID: number;
  offerStatusID: number;
}

export interface OfferSearchParams {
  projectId?: number;
  applicantId?: number;
  statusId?: number;
  minAmount?: number;
  maxAmount?: number;
  fromDate?: string;
  toDate?: string;
}

export interface ProjectCategory {
  id: number;
  categoryName: string;
}

export interface CategoryOption {
  value: number;
  label: string;
}

export interface StatusOption {
  value: number;
  label: string;
}

export interface ProjectCategoryMapping {
  id: number;
  categoryId: number;
  categoryID: number;
  categoryName: string;
}

export interface ProjectSkill {
  id: number;
  skillName: string;
}

export interface ProjectStatus {
  id: number;
  status: string;
}

export interface Offer {
  id: number;
  freelancerId: number;
  freelancerName: string;
  freelancerImage?: string;
  projectId: number;
  projectName: string;
  offerAmount: number;
  offerStatus: boolean;
  offerDate: string;
  message?: string;
}

// Course Types
export interface Course {
  id: number;
  contributorId: number;
  contributorID?: number;
  contributorName?: string;
  fieldId: number;
  courseFieldID?: number;
  fieldName?: string;
  courseFieldName?: string;
  courseName?: string;
  title?: string;
  courseDescription?: string;
  description?: string;
  courseUrl?: string;
  courseLink?: string;
  courseImageUrl?: string;
  courseDuration?: number;
  publishedDate?: string;
  createdDate?: string;
  enrolledCount?: number;
  learnersCount?: number;
  rating?: number;
  isActive?: boolean;
}

export interface CreateCourseDto {
  contributorID: number;
  courseFieldID: number;
  title: string;
  description: string;
  courseLink: string;
  courseImageUrl?: string;
}

export interface UpdateCourseDto {
  id: number;
  contributorID: number;
  courseFieldID: number;
  title: string;
  description: string;
  courseLink: string;
  courseImageUrl?: string;
  isActive?: boolean;
}

export interface CourseFieldOption {
  value: number;
  label: string;
}

export interface CourseField {
  id: number;
  field: string;
}

// Notification Types
export interface Notification {
  id: number;
  title: string;
  message: string;
  targetAudience: "all" | "freelancers" | "customers" | "contributors";
  sentAt: string;
  readCount: number;
  totalRecipients: number;
  isRead?: boolean;
  createdAt?: string;
  recipientId?: number;
  recipientType?: string;
}

export interface NotificationsResponse {
  items: Notification[];
  totalCount: number;
  skip: number;
  take: number;
}

// Rating Types
export interface Rating {
  id: number;
  customerId: number;
  customerName: string;
  customerImage?: string;
  freelancerId: number;
  freelancerName: string;
  freelancerImage?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface FreelancerRating {
  id: number;
  customerId: number;
  customerName?: string;
  freelancerId: number;
  freelancerName?: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt?: string;
  projectId?: number;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: Admin;
  roleNumber: number;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  profileImagePath?: string;
  role: number;
}

// Dashboard Statistics
export interface DashboardStats {
  totalUsers: number;
  totalCustomers: number;
  totalFreelancers: number;
  totalContributors: number;
  totalAdmins: number;
  totalProjects: number;
  activeProjects: number;
  totalOffers: number;
  acceptedOffers: number;
  totalCourses: number;
  totalLearners: number;
  platformRevenue: number;
  avgFreelancerRating: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// Table Types
export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

export interface TableFilter {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}
