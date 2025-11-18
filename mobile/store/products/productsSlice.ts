import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { makeRequest } from "../../requestMethod";

// Types
import {
  CreateProductRequest,
  CreateProductResponse,
  GetProductResponse,
  GetAllProductsResponse,
  GetProductsByRestaurantResponse,
  GetProductsByCategoryResponse,
  GetMyLikedProductsResponse,
  UpdateProductRequest,
  UpdateProductResponse,
  DeleteProductResponse,
  ToggleProductLikeRequest,
  ToggleProductLikeResponse,
  GetAllProductsParams,
  GetProductsByRestaurantParams,
  GetProductsByCategoryParams,
  GetMyLikedProductsParams,
} from "../../types/products.types";

// *********************************** ((API Functions)) **************************************** //

// Create Product
const createProduct = async (
  data: CreateProductRequest
): Promise<CreateProductResponse> => {
  const response = await makeRequest.post("/products", data);
  return response.data;
};

// Get All Products
const fetchAllProducts = async (
  params?: GetAllProductsParams
): Promise<GetAllProductsResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.size) queryParams.append("size", params.size.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.isAvailable !== undefined)
    queryParams.append("isAvailable", params.isAvailable.toString());

  const response = await makeRequest.get(`/products?${queryParams.toString()}`);
  return response.data;
};

// Get Single Product
const fetchProduct = async (productId: string): Promise<GetProductResponse> => {
  const response = await makeRequest.get(`/products/${productId}`);
  return response.data;
};

// Get Products by Restaurant
const fetchProductsByRestaurant = async (
  params: GetProductsByRestaurantParams
): Promise<GetProductsByRestaurantResponse> => {
  const { restaurantId, page = 1, size = 10, search, categoryId } = params;
  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("limit", size.toString()); // Changed from 'size' to 'limit'
  if (search) queryParams.append("search", search);
  if (categoryId) queryParams.append("categoryId", categoryId);

  const response = await makeRequest.get(
    `/products/restaurant/${restaurantId}?${queryParams.toString()}`
  );

  // Transform the API response to match expected format
  return {
    data: response.data.data || [],
    pagination: response.data.pagination || {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
    },
    filters: response.data.filters || {},
  };
};

// Get Products by Category
const fetchProductsByCategory = async (
  params: GetProductsByCategoryParams
): Promise<GetProductsByCategoryResponse> => {
  const { categoryId, page = 1, size = 10 } = params;
  const response = await makeRequest.get(
    `/products/category/${categoryId}?page=${page}&size=${size}`
  );
  return response.data;
};

// Get My Liked Products
const fetchMyLikedProducts = async (
  params?: GetMyLikedProductsParams
): Promise<GetMyLikedProductsResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.size) queryParams.append("size", params.size.toString());

  const response = await makeRequest.get(
    `/products/my-favourites?${queryParams.toString()}`
  );
  return response.data;
};

// Update Product
const updateProduct = async ({
  productId,
  ...data
}: UpdateProductRequest & {
  productId: string;
}): Promise<UpdateProductResponse> => {
  const response = await makeRequest.put(`/products/${productId}`, data);
  return response.data;
};

// Delete Product
const deleteProduct = async (
  productId: string
): Promise<DeleteProductResponse> => {
  const response = await makeRequest.delete(`/products/${productId}`);
  return response.data;
};

// Toggle Product Like
const toggleProductLike = async (
  data: ToggleProductLikeRequest
): Promise<ToggleProductLikeResponse> => {
  const response = await makeRequest.post("/products/toggle-like", data);
  return response.data;
};

// *********************************** ((React-Query Hooks)) **************************************** //

// Create Product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// Get All Products
export const useAllProducts = (params?: GetAllProductsParams) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => fetchAllProducts(params),
  });
};

// Get All Products with Infinite Scroll
export const useInfiniteProducts = (
  params?: Omit<GetAllProductsParams, "page">
) => {
  return useInfiniteQuery({
    queryKey: ["products", "infinite", params],
    queryFn: ({ pageParam = 1 }) =>
      fetchAllProducts({ ...params, page: pageParam as number }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

// Get Single Product
export const useProduct = (
  productId: string,
  options?: Omit<UseQueryOptions<GetProductResponse>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
    enabled: !!productId,
    ...options,
  });
};

// Get Products by Restaurant
export const useProductsByRestaurant = (
  restaurantId: string,
  enabled = true
) => {
  return useQuery({
    queryKey: ["products", "restaurant", restaurantId],
    queryFn: () => fetchProductsByRestaurant({ restaurantId }),
    enabled: !!restaurantId && enabled,
  });
};

// Get Products by Restaurant with Infinite Scroll
export const useInfiniteProductsByRestaurant = (
  restaurantId: string,
  params?: Omit<GetProductsByRestaurantParams, "restaurantId" | "page">,
  enabled = true
) => {
  return useInfiniteQuery({
    queryKey: ["products", "restaurant", restaurantId, "infinite", params],
    queryFn: ({ pageParam = 1 }) =>
      fetchProductsByRestaurant({
        restaurantId,
        ...params,
        page: pageParam as number,
      }),
    enabled: !!restaurantId && enabled,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

// Get Products by Category
export const useProductsByCategory = (categoryId: string, enabled = true) => {
  return useQuery({
    queryKey: ["products", "category", categoryId],
    queryFn: () => fetchProductsByCategory({ categoryId }),
    enabled: !!categoryId && enabled,
  });
};

// Get Products by Category with Infinite Scroll
export const useInfiniteProductsByCategory = (
  categoryId: string,
  enabled = true
) => {
  return useInfiniteQuery({
    queryKey: ["products", "category", categoryId, "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      fetchProductsByCategory({ categoryId, page: pageParam as number }),
    enabled: !!categoryId && enabled,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

// Get My Liked Products
export const useMyLikedProducts = (params?: GetMyLikedProductsParams) => {
  return useQuery({
    queryKey: ["products", "my-likes", params],
    queryFn: () => fetchMyLikedProducts(params),
  });
};

// Get My Liked Products with Infinite Scroll
export const useInfiniteMyLikedProducts = (
  params?: Omit<GetMyLikedProductsParams, "page">
) => {
  return useInfiniteQuery({
    queryKey: ["products", "my-likes", "infinite", params],
    queryFn: ({ pageParam = 1 }) =>
      fetchMyLikedProducts({ ...params, page: pageParam as number }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

// Update Product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId],
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// Delete Product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// Toggle Product Like
export const useToggleProductLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleProductLike,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId],
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({
        queryKey: ["products", "my-likes"],
      });
    },
  });
};
