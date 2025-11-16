import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../requestMethod";

export const restaurantsSlice = createApi({
  reducerPath: "restaurantsApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/restaurants" }),
  tagTypes: ["Restaurants", "Favourites"],
  endpoints: (builder) => ({
    // Get all restaurants with pagination and search
    getAllRestaurants: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: "/",
        method: "GET",
        params: { page, limit, search },
      }),
      providesTags: ["Restaurants"],
    }),

    // Get restaurant by ID
    getRestaurantById: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Restaurants", id }],
    }),

    // Create new restaurant (ADMIN/RESTAURANT_OWNER)
    createRestaurant: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Restaurants"],
    }),

    // Update restaurant (ADMIN/RESTAURANT_OWNER)
    updateRestaurant: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Restaurants",
        { type: "Restaurants", id },
      ],
    }),

    // Delete restaurant (ADMIN/RESTAURANT_OWNER)
    deleteRestaurant: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Restaurants"],
    }),

    // Toggle favourite
    toggleFavourite: builder.mutation({
      query: (restaurantId) => ({
        url: "/toggle",
        method: "POST",
        data: { restaurantId },
      }),
      invalidatesTags: ["Favourites", "Restaurants"],
    }),

    // Get my favourites
    getMyFavourites: builder.query({
      query: () => ({
        url: "/my-favourites",
        method: "GET",
      }),
      providesTags: ["Favourites"],
    }),
  }),
});

export const {
  useGetAllRestaurantsQuery,
  useGetRestaurantByIdQuery,
  useCreateRestaurantMutation,
  useUpdateRestaurantMutation,
  useDeleteRestaurantMutation,
  useToggleFavouriteMutation,
  useGetMyFavouritesQuery,
} = restaurantsSlice;
