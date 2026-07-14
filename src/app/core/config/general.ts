export interface JwtPayload {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: string;
  expiresIn?: number;
}

export interface PaginatedResponse {
  pageNumber: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}
