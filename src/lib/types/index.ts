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
  name: string;
  description: string;
  field: string;
  country: string;
  email: string;
  profileImageUrl?: string;
  registrationDate: string;
  isActive: boolean;
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
  publishingDate: string;
  projectBudget: number;
  executionTime: number;
  applicationsCount: number;
  projectCategories: ProjectCategoryMapping[];
  projectSkills: ProjectSkill[];
  projectOffers: ProjectOffer[];
}

export interface ProjectOffer {
  id: number;
  projectId: number;
  applicantId: number;
  applicantName?: string;
  executionDays: number;
  offerAmount: number;
  offerDescription: string;
  offerDate: string;
  offerStatus: boolean;
}

export interface ProjectCategory {
  id: number;
  categoryName: string;
}

export interface ProjectCategoryMapping {
  id: number;
  categoryId: number;
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
  contributorName?: string;
  fieldId: number;
  fieldName?: string;
  courseName: string;
  courseDescription: string;
  courseUrl: string;
  courseImageUrl?: string;
  courseDuration: number;
  publishedDate: string;
  enrolledCount: number;
  rating: number;
}

export interface CourseField {
  id: number;
  fieldName: string;
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
