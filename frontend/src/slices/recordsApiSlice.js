import { apiSlice } from "./apiSlice";
const RECORDS_URL = "/api/records";

export const recordApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createUserRecord: builder.mutation({
      query: (data) => ({
        url: `${RECORDS_URL}/createRecord`,
        method: "POST",
        body: data,
      }),
    }),
    getUserRecord: builder.mutation({
      query: (data) => ({
        url: `${RECORDS_URL}/getRecord`,
        method: "POST",
        body: data,
      }),
    }),
    getGameRecordTop10: builder.mutation({
      query: ({ data, gameId }) => ({
        url: `${RECORDS_URL}/${gameId}/top10`,
        method: "POST",
        body: data,
      }),
    }),
    getGameRecord: builder.mutation({
      query: ({ data, gameId }) => ({
        url: `${RECORDS_URL}/${gameId}/records`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateUserRecordMutation,
  useGetUserRecordMutation,
  useGetGameRecordTop10Mutation,
  useGetGameRecordMutation,
} = recordApiSlice;
