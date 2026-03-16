import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/api/orders" }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (body) => ({
        url: "/new",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Order"],
    }),
    myOrders: builder.query({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
      providesTags: ["Order"],
    }),
    getOrderDetails: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),
    updateOrder: builder.mutation({
      query: ({ id, status }) => ({
        url: `/${id}`,
        method: "PUT",
        data: { status },
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useMyOrdersQuery,
  useGetOrderDetailsQuery,
  useUpdateOrderMutation,
} = orderApi;
