import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: axiosBaseQuery({
    baseUrl: "/api/dashboard",
  }),
  tagTypes: ["SellerStats"],
  endpoints: (builder) => ({
    // Seller endpoints only
    getSellerStats: builder.query({
      query: () => ({ url: "/seller/stats", method: "GET" }),
      providesTags: ["SellerStats"],
    }),
  }),
});

export const {
  useGetSellerStatsQuery,
} = dashboardApi;
