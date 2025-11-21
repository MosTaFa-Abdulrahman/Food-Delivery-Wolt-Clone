import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../requestMethod";

export const ordersSlice = createApi({
  reducerPath: "ordersApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/orders" }),
  tagTypes: ["Orders", "MyOrders"],
  endpoints: (builder) => ({
    // Get all orders (ADMIN & RESTAURANT_OWNER) with pagination, search, and status filter
    getAllOrders: builder.query({
      query: ({ page = 1, limit = 10, search = "", status = "" }) => ({
        url: "/",
        method: "GET",
        params: {
          page,
          limit,
          search,
          ...(status && { status }), // Only include status if it's not empty
        },
      }),
      providesTags: ["Orders"],
    }),

    // Get my orders (authenticated user)
    getMyOrders: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: "/my-orders",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["MyOrders"],
    }),

    // Get order by ID
    getOrderById: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "Orders", id },
        { type: "MyOrders", id },
      ],
    }),

    // Create new order (authenticated user)
    createOrder: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Orders", "MyOrders"],
    }),

    // Update order status (ADMIN & RESTAURANT_OWNER only)
    // Prevents updating DELIVERED or CANCELLED orders
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => {
        // Validate status
        const validStatuses = [
          "PENDING",
          "CONFIRMED",
          "PREPARING",
          "READY",
          "DELIVERING",
          "DELIVERED",
          "CANCELLED",
        ];

        if (!validStatuses.includes(status)) {
          throw new Error(
            `Invalid status. Must be one of: ${validStatuses.join(", ")}`
          );
        }

        return {
          url: `/${id}/status`,
          method: "PUT",
          data: { status },
        };
      },
      invalidatesTags: (result, error, { id }) => [
        "Orders",
        "MyOrders",
        { type: "Orders", id },
        { type: "MyOrders", id },
      ],
      // Transform error to provide better messages
      transformErrorResponse: (response) => {
        if (response.data?.error) {
          // Check if error is about locked status
          if (
            response.data.error.includes("DELIVERED") ||
            response.data.error.includes("CANCELLED")
          ) {
            return {
              ...response,
              data: {
                ...response.data,
                error:
                  "Cannot update orders that are already DELIVERED or CANCELLED",
              },
            };
          }
        }
        return response;
      },
    }),

    // Delete order (authenticated user - own orders only)
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders", "MyOrders"],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} = ordersSlice;

// Export constants for use in components
export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "DELIVERING",
  "DELIVERED",
  "CANCELLED",
];

export const LOCKED_ORDER_STATUSES = ["DELIVERED", "CANCELLED"];
