// Enums
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  RESTAURANT_OWNER = "RESTAURANT_OWNER",
}

// Base Types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imgUrl: string | null;
  city: string | null;
  phoneNumber: string | null;
  role: UserRole;
  createdDate: string;
  lastModifiedDate: string | null;
}

// Request Types
export interface UpdateUserRequest {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  imgUrl?: string;
  city?: string;
  phoneNumber?: string;
}

export interface GetAllUsersParams {
  page?: number;
  size?: number;
  search?: string;
  role?: UserRole;
}

// Response Types
export interface GetUserResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface GetAllUsersResponse {
  success: boolean;
  message: string;
  data: User[];
  page: number;
  size: number;
  totalPages: number;
  totalItems: number;
}

export interface UpdateUserResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}
