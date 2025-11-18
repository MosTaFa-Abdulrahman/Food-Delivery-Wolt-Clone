// =============================
// ProductCategory
// =============================
export interface ProductCategory {
  id: string;
  name: string;
  description: string | null;
  imgUrl: string | null;
  createdDate: string;
  lastModifiedDate: string | null;

  restaurantId: string;

  restaurant?: {
    id: string;
    name: string;
    imgUrl: string | null;
  };

  products?: Array<{
    id: string;
    name: string;
    price: number;
    imgUrl: string | null;
  }>;

  _count?: {
    products: number;
  };
}

// =============================
// Pagination Response (Shared)
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
export interface CreateProductCategoryResponse {
  message: string;
  productCategory: ProductCategory;
}

export interface GetProductCategoryResponse {
  productCategory: ProductCategory;
}

export interface GetAllProductCategoriesResponse
  extends PaginatedResponse<ProductCategory> {}

export interface GetProductCategoriesByRestaurantResponse
  extends PaginatedResponse<ProductCategory> {}

export interface UpdateProductCategoryResponse {
  message: string;
  productCategory: ProductCategory;
}

export interface DeleteProductCategoryResponse {
  message: string;
}

// =============================
// Request Types
// =============================
export interface CreateProductCategoryRequest {
  name: string;
  description?: string;
  imgUrl?: string;
  restaurantId: string;
}

export interface UpdateProductCategoryRequest {
  name?: string;
  description?: string;
  imgUrl?: string;
}

export interface GetAllProductCategoriesParams {
  page?: number;
  size?: number;
  search?: string;
}

export interface GetProductCategoriesByRestaurantParams {
  restaurantId: string;
  page?: number;
  size?: number;
}

// =============================
// Query Key Types
// =============================
export type ProductCategoryQueryKey = ["productCategory", string];
export type AllProductCategoriesQueryKey = [
  "productCategories",
  GetAllProductCategoriesParams?
];
export type RestaurantProductCategoriesQueryKey = [
  "productCategories",
  "restaurant",
  string,
  GetProductCategoriesByRestaurantParams?
];
