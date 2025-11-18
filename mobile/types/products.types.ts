// =============================
// Product
// =============================
export interface Product {
  id: string;
  name: string;
  description: string | null;
  quantity: number;
  price: number;
  imgUrl: string | null;
  isAvailable: boolean;
  createdDate: string;
  lastModifiedDate: string | null;

  restaurantId: string;
  categoryId: string;

  restaurant?: {
    id: string;
    name: string;
    imgUrl: string | null;
  };

  category?: {
    id: string;
    name: string;
  };

  isLiked?: boolean;

  _count?: {
    likedBy: number;
  };
}

// =============================
// Product Like (Favourite → Like)
// =============================
export interface ProductLike {
  id: string;
  userId: string;
  productId: string;
  createdDate: string;
  lastModifiedDate: string | null;

  product?: Product;
}

// =============================
// Shared Pagination Struct
// =============================
export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// =============================
// API Response Types
// =============================
export interface CreateProductResponse {
  message: string;
  product: Product;
}

export interface GetProductResponse {
  product: Product;
}

export interface GetAllProductsResponse extends PaginatedResponse<Product> {}

export interface GetProductsByRestaurantResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    restaurantId: string;
    search: string | null;
    categoryId: string | null;
    isAvailable: boolean | null;
  };
}

export interface GetProductsByCategoryResponse
  extends PaginatedResponse<Product> {}

export interface GetMyLikedProductsResponse
  extends PaginatedResponse<Product> {}

export interface UpdateProductResponse {
  message: string;
  product: Product;
}

export interface DeleteProductResponse {
  message: string;
}

// Toggle like/favourite
export interface ToggleProductLikeResponse {
  message: string;
  isLiked: boolean;
  likesCount: number;
}

// =============================
// Request Types
// =============================
export interface CreateProductRequest {
  name: string;
  description?: string;
  quantity: number;
  price: number;
  imgUrl?: string;
  isAvailable?: boolean;
  restaurantId: string;
  categoryId: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  quantity?: number;
  price?: number;
  imgUrl?: string;
  isAvailable?: boolean;
  categoryId?: string;
}

export interface GetAllProductsParams {
  page?: number;
  size?: number;
  search?: string;
  isAvailable?: boolean;
}

export interface GetProductsByRestaurantParams {
  restaurantId: string;
  page?: number;
  size?: number;
  search?: string;
  categoryId?: string;
}

export interface GetProductsByCategoryParams {
  categoryId: string;
  page?: number;
  size?: number;
}

export interface GetMyLikedProductsParams {
  page?: number;
  size?: number;
}

export interface ToggleProductLikeRequest {
  productId: string;
}

// =============================
// Query Keys
// =============================
export type ProductQueryKey = ["product", string];

export type AllProductsQueryKey = ["products", GetAllProductsParams?];

export type ProductsByRestaurantQueryKey = [
  "products",
  "restaurant",
  string,
  GetProductsByRestaurantParams?
];

export type ProductsByCategoryQueryKey = [
  "products",
  "category",
  string,
  GetProductsByCategoryParams?
];

export type MyLikedProductsQueryKey = [
  "products",
  "liked",
  GetMyLikedProductsParams?
];
