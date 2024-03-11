/* eslint-disable no-unused-vars */
import { apiSlice } from "./apiSlice";
const RECORDS_URL = "/api/locations";

export const locationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCountries: builder.mutation({
      query: (data) => ({
        url: `${RECORDS_URL}/countries`,
        method: "GET",
      }),
    }),
    getProvinces: builder.mutation({
      query: (data) => ({
        url: `${RECORDS_URL}/provinces`,
        method: "POST",
        body: data,
      }),
    }),
    getCities: builder.mutation({
      query: (data) => ({
        url: `${RECORDS_URL}/cities`,
        method: "POST",
        body: data,
      }),
    }),
    getLatLon: builder.mutation({
      query: (data) => ({
        url: `${RECORDS_URL}/geo-location`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetCountriesMutation,
  useGetProvincesMutation,
  useGetCitiesMutation,
  useGetLatLonMutation,
} = locationApiSlice;
