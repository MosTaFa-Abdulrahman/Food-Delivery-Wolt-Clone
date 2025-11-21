import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../requestMethod";

export const usersSlice = createApi({
  reducerPath: "usersApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/users" }),
  tagTypes: ["User"],

  endpoints: (builder) => ({
    // Get all users with pagination and search
    getUsers: builder.query({
      query: ({ page = 1, size = 10, search = "" } = {}) => ({
        url: `?page=${page}&size=${size}${search ? `&search=${search}` : ""}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        console.log("Raw API Response:", response);

        // Handle different response structures
        // If response is already the data object
        if (response?.content) {
          return {
            data: response,
            status: "success",
            errors: null,
          };
        }

        // If response has a data property
        return {
          data: response?.data || response,
          status: response?.status || "success",
          errors: response?.errors || null,
        };
      },
      providesTags: (result, error, arg) =>
        result?.data?.content
          ? [
              ...result.data.content.map(({ id }) => ({ type: "User", id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    // Get single User by ID
    getUserById: builder.query({
      query: (userId) => ({
        url: `/${userId}`,
        method: "GET",
      }),
      providesTags: (result, error, userId) => [{ type: "User", id: userId }],
    }),

    // Update Current User (me)
    updateCurrentUser: builder.mutation({
      query: (userData) => ({
        url: `/me`,
        method: "PATCH",
        data: userData,
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: (result, error) => [
        { type: "User", id: result?.id },
        { type: "User", id: "LIST" },
      ],
    }),

    // Update Any User by ID (Admin)
    updateUser: builder.mutation({
      query: ({ userId, ...userData }) => ({
        url: `/${userId}`,
        method: "PATCH",
        data: userData,
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: (result, error, { userId }) => [
        { type: "User", id: userId },
        { type: "User", id: "LIST" },
      ],
    }),

    // Delete Current User (me)
    deleteCurrentUser: builder.mutation({
      query: () => ({
        url: `/me`,
        method: "DELETE",
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    // Delete User by ID (Admin)
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/${userId}`,
        method: "DELETE",
      }),
      transformResponse: (response) => {
        return response.data || null;
      },
      invalidatesTags: (result, error, userId) => [
        { type: "User", id: userId },
        { type: "User", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateCurrentUserMutation,
  useUpdateUserMutation,
  useDeleteCurrentUserMutation,
  useDeleteUserMutation,
} = usersSlice;
