// store/api/videoApi.ts

import { baseApi } from './baseApi';

interface UploadVideoResponse {
  message: string;
  videoId: string;
}

interface DeleteVideoResponse {
  message: string;
}
interface GetVideosResponse {
  videos: [];
  page: number;
  totalPages: number;
  total: number;
}

interface GetVideosParams {
  page?: number;
  limit?: number;
  search?: string;
}
export const videoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Upload Video (with socket ID, metadata, and file)
    uploadVideo: builder.mutation<UploadVideoResponse, FormData>({
      query: (formData) => ({
        url: '/video/upload',
        method: 'POST',
        body: formData,
      }),
    }),

    // Delete uploaded video
    deleteVideo: builder.mutation<DeleteVideoResponse, string>({
      query: (videoId) => ({
        url: `/video/deleteUploadedVideo/${videoId}`,
        method: 'DELETE',
      }),
    }),

    getVideos: builder.query<GetVideosResponse, GetVideosParams>({
        query: ({ page = 1, limit = 10, search = '' }) => ({
          url: '/video/getVideos',
          method: 'GET',
          params: { page, limit, search },
        }),
        // providesTags: ['Videos'],
      }),

  }),
});

export const {
  useUploadVideoMutation,
  useDeleteVideoMutation,
  useGetVideosQuery
} = videoApi;
