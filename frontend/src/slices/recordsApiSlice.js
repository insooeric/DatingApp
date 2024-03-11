/* eslint-disable no-unused-vars */
import { apiSlice } from "./apiSlice";
const RECORDS_URL = "/api/records";

export const recordApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserRecord: builder.mutation({
      query: (data) => ({
        url: `${RECORDS_URL}/`,
        method: "GET",
      }),
    }),
    postUserRecord: builder.mutation({
      query: (data) => ({
        url: `${RECORDS_URL}/`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetUserRecordMutation, usePostUserRecordMutation } =
  recordApiSlice;
