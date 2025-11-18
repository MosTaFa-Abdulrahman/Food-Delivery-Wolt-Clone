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
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrderResponse,
  GetMyOrdersResponse,
  GetAllOrdersResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
  GetMyOrdersParams,
  GetAllOrdersParams,
} from "../../types/orders.types";

// *********************************** ((API Functions)) **************************************** //

// Create Order
const createOrder = async (
  data: CreateOrderRequest
): Promise<CreateOrderResponse> => {
  const response = await makeRequest.post("/orders", data);
  return response.data;
};

// Get My Orders
const fetchMyOrders = async (
  params?: GetMyOrdersParams
): Promise<GetMyOrdersResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.size) queryParams.append("size", params.size.toString());
  if (params?.status) queryParams.append("status", params.status);

  const response = await makeRequest.get(
    `/orders/my-orders?${queryParams.toString()}`
  );
  return response.data;
};

// Get All Orders (Admin)
const fetchAllOrders = async (
  params?: GetAllOrdersParams
): Promise<GetAllOrdersResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.size) queryParams.append("size", params.size.toString());
  if (params?.status) queryParams.append("status", params.status);
  if (params?.userId) queryParams.append("userId", params.userId);
  if (params?.restaurantId)
    queryParams.append("restaurantId", params.restaurantId);

  const response = await makeRequest.get(`/orders?${queryParams.toString()}`);
  return response.data;
};

// Get Single Order
const fetchOrder = async (orderId: string): Promise<GetOrderResponse> => {
  const response = await makeRequest.get(`/orders/${orderId}`);
  return response.data;
};

// Update Order Status (Admin)
const updateOrderStatus = async ({
  orderId,
  ...data
}: UpdateOrderStatusRequest & {
  orderId: string;
}): Promise<UpdateOrderStatusResponse> => {
  const response = await makeRequest.put(`/orders/${orderId}/status`, data);
  return response.data;
};

// *********************************** ((React-Query Hooks)) **************************************** //

// Create Order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
    },
  });
};

// Get My Orders
export const useMyOrders = (params?: GetMyOrdersParams) => {
  return useQuery({
    queryKey: ["my-orders", params],
    queryFn: () => fetchMyOrders(params),
  });
};

// Get My Orders with Infinite Scroll
export const useInfiniteMyOrders = (
  params?: Omit<GetMyOrdersParams, "page">
) => {
  return useInfiniteQuery({
    queryKey: ["my-orders", "infinite", params],
    queryFn: ({ pageParam = 1 }) =>
      fetchMyOrders({ ...params, page: pageParam as number }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

// Get All Orders (Admin)
export const useAllOrders = (params?: GetAllOrdersParams) => {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => fetchAllOrders(params),
  });
};

// Get All Orders with Infinite Scroll (Admin)
export const useInfiniteAllOrders = (
  params?: Omit<GetAllOrdersParams, "page">
) => {
  return useInfiniteQuery({
    queryKey: ["orders", "infinite", params],
    queryFn: ({ pageParam = 1 }) =>
      fetchAllOrders({ ...params, page: pageParam as number }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

// Get Single Order
export const useOrder = (
  orderId: string,
  options?: Omit<UseQueryOptions<GetOrderResponse>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrder(orderId),
    enabled: !!orderId,
    ...options,
  });
};

// Update Order Status (Admin)
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["order", variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
    },
  });
};
