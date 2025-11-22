import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../requestMethod";

export const productsSlice = createApi({
  reducerPath: "productsApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/products" }),
  tagTypes: ["Product", "Favourite"],
  endpoints: (builder) => ({
    // Get all products with pagination and filters
    getAllProducts: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        restaurantId = "",
        categoryId = "",
        isAvailable,
      } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(search && { search }),
          ...(restaurantId && { restaurantId }),
          ...(categoryId && { categoryId }),
          ...(isAvailable !== undefined && {
            isAvailable: isAvailable.toString(),
          }),
        });
        return {
          url: `/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Product", id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    // Get product by ID
    getProductById: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // Get products by restaurant
    getProductsByRestaurant: builder.query({
      query: ({
        restaurantId,
        page = 1,
        limit = 10,
        search = "",
        categoryId = "",
        isAvailable,
      }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(search && { search }),
          ...(categoryId && { categoryId }),
          ...(isAvailable !== undefined && {
            isAvailable: isAvailable.toString(),
          }),
        });
        return {
          url: `/restaurant/${restaurantId}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Product", id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    // Get products by category
    getProductsByCategory: builder.query({
      query: ({
        categoryId,
        page = 1,
        limit = 10,
        search = "",
        isAvailable,
      }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(search && { search }),
          ...(isAvailable !== undefined && {
            isAvailable: isAvailable.toString(),
          }),
        });
        return {
          url: `/category/${categoryId}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Product", id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    // Create product (ADMIN & RESTAURANT_OWNER)
    createProduct: builder.mutation({
      query: (productData) => ({
        url: "/",
        method: "POST",
        data: productData,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    // Update product (ADMIN & RESTAURANT_OWNER)
    updateProduct: builder.mutation({
      query: ({ id, ...productData }) => ({
        url: `/${id}`,
        method: "PUT",
        data: productData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),

    // Delete product (ADMIN & RESTAURANT_OWNER)
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    // Toggle favourite
    toggleFavourite: builder.mutation({
      query: (productId) => ({
        url: "/toggle-like",
        method: "POST",
        data: { productId },
      }),
      invalidatesTags: (result, error, productId) => [
        { type: "Product", id: productId },
        { type: "Favourite", id: "LIST" },
      ],
    }),

    // Get user's favourite products
    getMyFavourites: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        return {
          url: `/my-favourites?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Favourite", id })),
              { type: "Favourite", id: "LIST" },
            ]
          : [{ type: "Favourite", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useGetProductsByRestaurantQuery,
  useGetProductsByCategoryQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useToggleFavouriteMutation,
  useGetMyFavouritesQuery,
} = productsSlice;
