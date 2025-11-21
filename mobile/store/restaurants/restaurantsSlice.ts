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
  CreateRestaurantRequest,
  CreateRestaurantResponse,
  GetRestaurantResponse,
  GetAllRestaurantsResponse,
  GetMyFavouriteRestaurantsResponse,
  UpdateRestaurantRequest,
  UpdateRestaurantResponse,
  DeleteRestaurantResponse,
  ToggleRestaurantFavouriteResponse,
  GetAllRestaurantsParams,
  GetMyFavouriteRestaurantsParams,
  GetAllForMapResponse,
} from "../../types/restaurants.types";

// *********************************** ((API Functions)) **************************************** //

// Get All Restaurants (NO search, NO pagination)
const fetchAllForMap = async (): Promise<GetAllForMapResponse> => {
  const response = await makeRequest.get<GetAllForMapResponse>(
    "/restaurants/get/all"
  );
  return response.data;
};

// Create Restaurant
const createRestaurant = async (
  data: CreateRestaurantRequest
): Promise<CreateRestaurantResponse> => {
  const response = await makeRequest.post("/restaurants", data);
  return response.data;
};

// Get All Restaurants
const fetchAllRestaurants = async (
  params?: GetAllRestaurantsParams
): Promise<GetAllRestaurantsResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.size) queryParams.append("size", params.size.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.city) queryParams.append("city", params.city);
  if (params?.isActive !== undefined)
    queryParams.append("isActive", params.isActive.toString());

  const response = await makeRequest.get(
    `/restaurants?${queryParams.toString()}`
  );

  // Transform API response to match expected format
  return {
    content: response.data.data || [],
    page: response.data.pagination?.page || 1,
    size: response.data.pagination?.limit || 10,
    totalElements: response.data.pagination?.total || 0,
    totalPages: response.data.pagination?.totalPages || 1,
    first: response.data.pagination?.page === 1,
    last:
      response.data.pagination?.page === response.data.pagination?.totalPages,
  };
};

// Get Single Restaurant
const fetchRestaurant = async (
  restaurantId: string
): Promise<GetRestaurantResponse> => {
  const response = await makeRequest.get(`/restaurants/${restaurantId}`);

  return response.data;
};

// Get My Favourite Restaurants
const fetchMyFavouriteRestaurants = async (
  params?: GetMyFavouriteRestaurantsParams
): Promise<GetMyFavouriteRestaurantsResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.size) queryParams.append("size", params.size.toString());

  const response = await makeRequest.get(
    `/restaurants/my-favourites?${queryParams.toString()}`
  );

  // Transform API response to match expected format
  return {
    content: response.data.data || [],
    page: response.data.pagination?.page || 1,
    size: response.data.pagination?.limit || 10,
    totalElements: response.data.pagination?.total || 0,
    totalPages: response.data.pagination?.totalPages || 1,
    first: response.data.pagination?.page === 1,
    last:
      response.data.pagination?.page === response.data.pagination?.totalPages,
  };
};

// Update Restaurant
const updateRestaurant = async ({
  restaurantId,
  ...data
}: UpdateRestaurantRequest & {
  restaurantId: string;
}): Promise<UpdateRestaurantResponse> => {
  const response = await makeRequest.put(`/restaurants/${restaurantId}`, data);
  return response.data;
};

// Delete Restaurant
const deleteRestaurant = async (
  restaurantId: string
): Promise<DeleteRestaurantResponse> => {
  const response = await makeRequest.delete(`/restaurants/${restaurantId}`);
  return response.data;
};

// Toggle Restaurant Favourite - FIXED VERSION
const toggleRestaurantFavourite = async (
  restaurantId: string
): Promise<ToggleRestaurantFavouriteResponse> => {
  // ✅ FIX: Send restaurantId in request body as an object
  const response = await makeRequest.post("/restaurants/toggle", {
    restaurantId: restaurantId,
  });
  return response.data;
};

// *********************************** ((React-Query Hooks)) **************************************** //

// Get All Restaurants (simple)
export const useAllForMap = () => {
  return useQuery({
    queryKey: ["restaurants"],
    queryFn: () => fetchAllForMap(),
  });
};

// Create Restaurant
export const useCreateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRestaurant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
    },
  });
};

// Get All Restaurants
export const useAllRestaurants = (params?: GetAllRestaurantsParams) => {
  return useQuery({
    queryKey: ["restaurants", params],
    queryFn: () => fetchAllRestaurants(params),
  });
};

// Get All Restaurants with Infinite Scroll
export const useInfiniteRestaurants = (
  params?: Omit<GetAllRestaurantsParams, "page">
) => {
  return useInfiniteQuery({
    queryKey: ["restaurants", "infinite", params],
    queryFn: ({ pageParam = 1 }) =>
      fetchAllRestaurants({ ...params, page: pageParam as number }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

// Get Single Restaurant
export const useRestaurant = (
  restaurantId: string,
  options?: Omit<UseQueryOptions<GetRestaurantResponse>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: ["restaurant", restaurantId],
    queryFn: () => fetchRestaurant(restaurantId),
    enabled: !!restaurantId,
    ...options,
  });
};

// Get My Favourite Restaurants
export const useMyFavouriteRestaurants = (
  params?: GetMyFavouriteRestaurantsParams
) => {
  return useQuery({
    queryKey: ["restaurants", "my-favourites", params],
    queryFn: () => fetchMyFavouriteRestaurants(params),
  });
};

// Get My Favourite Restaurants with Infinite Scroll
export const useInfiniteMyFavouriteRestaurants = (
  params?: Omit<GetMyFavouriteRestaurantsParams, "page">
) => {
  return useInfiniteQuery({
    queryKey: ["restaurants", "my-favourites", "infinite", params],
    queryFn: ({ pageParam = 1 }) =>
      fetchMyFavouriteRestaurants({ ...params, page: pageParam as number }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

// Update Restaurant
export const useUpdateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRestaurant,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["restaurant", variables.restaurantId],
      });
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
    },
  });
};

// Delete Restaurant
export const useDeleteRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRestaurant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
    },
  });
};

// Toggle Restaurant Favourite
export const useToggleRestaurantFavourite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleRestaurantFavourite,
    onSuccess: (data, restaurantId) => {
      // Invalidate specific restaurant
      queryClient.invalidateQueries({
        queryKey: ["restaurant", restaurantId],
      });

      // Invalidate all restaurants lists
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });

      // Invalidate favourites list
      queryClient.invalidateQueries({
        queryKey: ["restaurants", "my-favourites"],
      });
    },
  });
};
