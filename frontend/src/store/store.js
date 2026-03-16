import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { productsApi } from "../slices/productsApi";
import { cartApi } from "../slices/cartApi";
import { orderApi } from "../slices/orderApi";
import { dashboardApi } from "../slices/dashboardApi";
import authReducer from "../slices/authSlice";

export const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productsApi.middleware,
      cartApi.middleware,
      orderApi.middleware,
      dashboardApi.middleware,
    ),
});

setupListeners(store.dispatch);
