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
  GetUserResponse,
  GetAllUsersResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  DeleteUserResponse,
  GetAllUsersParams,
} from "../../types/users.types";

// *********************************** ((API Functions)) **************************************** //

// Get All Users
const fetchAllUsers = async (
  params?: GetAllUsersParams
): Promise<GetAllUsersResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.size) queryParams.append("size", params.size.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.role) queryParams.append("role", params.role);

  const response = await makeRequest.get(`/users?${queryParams.toString()}`);
  return response.data;
};

// Get Single User
const fetchUser = async (userId: string): Promise<GetUserResponse> => {
  const response = await makeRequest.get(`/users/${userId}`);
  return response.data;
};

// Get Current User Profile
const fetchMyProfile = async (): Promise<GetUserResponse> => {
  const response = await makeRequest.get("/users/me");
  return response.data;
};

// Update Current User
const updateUser = async (
  data: UpdateUserRequest
): Promise<UpdateUserResponse> => {
  const response = await makeRequest.patch("/users/me", data);
  return response.data;
};

// Delete Current User
const deleteUser = async (): Promise<DeleteUserResponse> => {
  const response = await makeRequest.delete("/users/me");
  return response.data;
};

// *********************************** ((React-Query Hooks)) **************************************** //

// Get All Users
export const useAllUsers = (params?: GetAllUsersParams) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => fetchAllUsers(params),
  });
};

// Get All Users with Infinite Scroll
export const useInfiniteUsers = (params?: Omit<GetAllUsersParams, "page">) => {
  return useInfiniteQuery({
    queryKey: ["users", "infinite", params],
    queryFn: ({ pageParam = 1 }) =>
      fetchAllUsers({ ...params, page: pageParam as number }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

// Get Single User
export const useUser = (
  userId: string,
  options?: Omit<UseQueryOptions<GetUserResponse>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
    ...options,
  });
};

// Get Current User Profile
export const useMyProfile = (
  options?: Omit<UseQueryOptions<GetUserResponse>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: fetchMyProfile,
    ...options,
  });
};

// Update Current User
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// Delete Current User
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // You might want to redirect to login or clear auth state here
    },
  });
};
