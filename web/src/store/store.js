import { configureStore } from "@reduxjs/toolkit";

// Users
import { usersSlice } from "./users/usersSlice";
// Restaurants
import { restaurantsSlice } from "./restaurants/restaurantsSlice";
// Products-Categories
import { productCategoriesSlice } from "./products-category/productsCategoriesSlice";
// Products
import { productsSlice } from "./products/productsSlice";

export const store = configureStore({
  reducer: {
    [usersSlice.reducerPath]: usersSlice.reducer,
    [restaurantsSlice.reducerPath]: restaurantsSlice.reducer,
    [productCategoriesSlice.reducerPath]: productCategoriesSlice.reducer,
    [productsSlice.reducerPath]: productsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(usersSlice.middleware)
      .concat(restaurantsSlice.middleware)
      .concat(productCategoriesSlice.middleware)
      .concat(productsSlice.middleware),
});
