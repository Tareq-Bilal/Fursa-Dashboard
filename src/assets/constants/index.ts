/**
 * Application Constants
 *
 * This file contains constant values used throughout the application
 */

export const APP_NAME = "Fursa Dashboard";
export const APP_DESCRIPTION =
  "Admin dashboard for managing the Fursa platform";

// API Configuration
export const API_TIMEOUT = 30000; // 30 seconds

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Date Formats
export const DATE_FORMAT = "MMM dd, yyyy";
export const DATE_TIME_FORMAT = "MMM dd, yyyy HH:mm";

// Status Values
export const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
  COMPLETED: "completed",
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: "admin",
  CONTRIBUTOR: "contributor",
  FREELANCER: "freelancer",
  CUSTOMER: "customer",
} as const;

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/",
  USERS: "/users",
  PROJECTS: "/projects",
  COURSES: "/courses",
  OFFERS: "/offers",
  NOTIFICATIONS: "/notifications",
  SETTINGS: "/settings",
  RATINGS: "/ratings",
} as const;
