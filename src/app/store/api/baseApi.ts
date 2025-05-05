import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define your base API URL
const BASE_URL = 'http://localhost:3000'

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  endpoints: () => ({}), // We'll add endpoints in separate files
  // tagTypes: [], // Add tag types for cache invalidation
}) 