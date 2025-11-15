import { configureStore } from "@reduxjs/toolkit";

// User
import { userSlice } from "./user/userSlice";

export const store = configureStore({
  reducer: {
    [userSlice.reducerPath]: userSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userSlice.middleware),
});
