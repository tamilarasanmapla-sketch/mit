import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/api/cart" }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: (body) => ({
        url: "/",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: "/",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;
