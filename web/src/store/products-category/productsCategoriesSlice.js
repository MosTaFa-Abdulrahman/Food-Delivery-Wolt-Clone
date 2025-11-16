import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../requestMethod";

export const productCategoriesSlice = createApi({
  reducerPath: "productCategoriesApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/product-categories" }),
  tagTypes: ["ProductCategory"],
  endpoints: (builder) => ({
    // Get all product categories with pagination and filters
    getAllProductCategories: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        restaurantId = "",
      } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(search && { search }),
          ...(restaurantId && { restaurantId }),
        });
        return {
          url: `/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "ProductCategory", id })),
              { type: "ProductCategory", id: "LIST" },
            ]
          : [{ type: "ProductCategory", id: "LIST" }],
    }),

    // Get product category by ID
    getProductCategoryById: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "ProductCategory", id }],
    }),

    // Get product categories by restaurant
    getProductCategoriesByRestaurant: builder.query({
      query: ({ restaurantId, page = 1, limit = 10, search = "" }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(search && { search }),
        });
        return {
          url: `/restaurant/${restaurantId}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "ProductCategory", id })),
              { type: "ProductCategory", id: "LIST" },
            ]
          : [{ type: "ProductCategory", id: "LIST" }],
    }),

    // Create product category (ADMIN & RESTAURANT_OWNER)
    createProductCategory: builder.mutation({
      query: (categoryData) => ({
        url: "/",
        method: "POST",
        data: categoryData,
      }),
      invalidatesTags: [{ type: "ProductCategory", id: "LIST" }],
    }),

    // Update product category (ADMIN & RESTAURANT_OWNER)
    updateProductCategory: builder.mutation({
      query: ({ id, ...categoryData }) => ({
        url: `/${id}`,
        method: "PUT",
        data: categoryData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ProductCategory", id },
        { type: "ProductCategory", id: "LIST" },
      ],
    }),

    // Delete product category (ADMIN & RESTAURANT_OWNER)
    deleteProductCategory: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "ProductCategory", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllProductCategoriesQuery,
  useGetProductCategoryByIdQuery,
  useGetProductCategoriesByRestaurantQuery,
  useCreateProductCategoryMutation,
  useUpdateProductCategoryMutation,
  useDeleteProductCategoryMutation,
} = productCategoriesSlice;
