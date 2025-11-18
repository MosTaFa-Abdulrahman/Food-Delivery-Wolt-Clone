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
  CreateProductCategoryRequest,
  CreateProductCategoryResponse,
  GetProductCategoryResponse,
  GetAllProductCategoriesResponse,
  GetProductCategoriesByRestaurantResponse,
  UpdateProductCategoryRequest,
  UpdateProductCategoryResponse,
  DeleteProductCategoryResponse,
  GetAllProductCategoriesParams,
  GetProductCategoriesByRestaurantParams,
} from "../../types/product-categories.types";

// *********************************** ((API Functions)) **************************************** //

// Create Product Category
const createProductCategory = async (
  data: CreateProductCategoryRequest
): Promise<CreateProductCategoryResponse> => {
  const response = await makeRequest.post("/product-categories", data);
  return response.data;
};

// Get All Product Categories
const fetchAllProductCategories = async (
  params?: GetAllProductCategoriesParams
): Promise<GetAllProductCategoriesResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.size) queryParams.append("size", params.size.toString());
  if (params?.search) queryParams.append("search", params.search);

  const response = await makeRequest.get(
    `/product-categories?${queryParams.toString()}`
  );
  return response.data;
};

// Get Single Product Category
const fetchProductCategory = async (
  categoryId: string
): Promise<GetProductCategoryResponse> => {
  const response = await makeRequest.get(`/product-categories/${categoryId}`);
  return response.data;
};

// Get Product Categories by Restaurant
const fetchProductCategoriesByRestaurant = async (
  params: GetProductCategoriesByRestaurantParams
): Promise<GetProductCategoriesByRestaurantResponse> => {
  const { restaurantId, page = 1, size = 10 } = params;
  const response = await makeRequest.get(
    `/product-categories/restaurant/${restaurantId}?page=${page}&size=${size}`
  );
  return response.data;
};

// Update Product Category
const updateProductCategory = async ({
  categoryId,
  ...data
}: UpdateProductCategoryRequest & {
  categoryId: string;
}): Promise<UpdateProductCategoryResponse> => {
  const response = await makeRequest.put(
    `/product-categories/${categoryId}`,
    data
  );
  return response.data;
};

// Delete Product Category
const deleteProductCategory = async (
  categoryId: string
): Promise<DeleteProductCategoryResponse> => {
  const response = await makeRequest.delete(
    `/product-categories/${categoryId}`
  );
  return response.data;
};

// *********************************** ((React-Query Hooks)) **************************************** //

// Create Product Category
export const useCreateProductCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProductCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
    },
  });
};

// Get All Product Categories
export const useAllProductCategories = (
  params?: GetAllProductCategoriesParams
) => {
  return useQuery({
    queryKey: ["product-categories", params],
    queryFn: () => fetchAllProductCategories(params),
  });
};

// Get All Product Categories with Infinite Scroll
export const useInfiniteProductCategories = (
  params?: Omit<GetAllProductCategoriesParams, "page">
) => {
  return useInfiniteQuery({
    queryKey: ["product-categories", "infinite", params],
    queryFn: ({ pageParam = 1 }) =>
      fetchAllProductCategories({ ...params, page: pageParam as number }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

// Get Single Product Category
export const useProductCategory = (
  categoryId: string,
  options?: Omit<
    UseQueryOptions<GetProductCategoryResponse>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: ["product-category", categoryId],
    queryFn: () => fetchProductCategory(categoryId),
    enabled: !!categoryId,
    ...options,
  });
};

// Get Product Categories by Restaurant
export const useProductCategoriesByRestaurant = (
  restaurantId: string,
  enabled = true
) => {
  return useQuery({
    queryKey: ["product-categories", "restaurant", restaurantId],
    queryFn: () => fetchProductCategoriesByRestaurant({ restaurantId }),
    enabled: !!restaurantId && enabled,
  });
};

// Get Product Categories by Restaurant with Infinite Scroll
export const useInfiniteProductCategoriesByRestaurant = (
  restaurantId: string,
  enabled = true
) => {
  return useInfiniteQuery({
    queryKey: ["product-categories", "restaurant", restaurantId, "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      fetchProductCategoriesByRestaurant({
        restaurantId,
        page: pageParam as number,
      }),
    enabled: !!restaurantId && enabled,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

// Update Product Category
export const useUpdateProductCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProductCategory,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-category", variables.categoryId],
      });
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
    },
  });
};

// Delete Product Category
export const useDeleteProductCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProductCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
    },
  });
};
