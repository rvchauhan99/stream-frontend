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

interface GetRelatedVideosParams {
  videoId: string;
  limit?: number;
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

    //  Delet third Party  video

    deletethirdpartyVideo: builder.mutation<DeleteVideoResponse, string>({
      query: (videoId) => ({
        url: `/video/deleteThirdPartyVideo/${videoId}`,
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

      //  upload thridPary  video
      uploadExternalVideo : builder.mutation<UploadVideoResponse, FormData>({
        query: (formData) => ({
          url: '/video/thirdparty/upload',
          method: 'POST',
          body: formData,
        }),
      }),
      searchVideos: builder.query<GetVideosResponse, {
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
        monetization?: string;
        visibility?: string;
        tags?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
      }>({
        query: (params) => ({
          url: '/video/search',
          method: 'GET',
          params,
        }),
      }),
  
      getVideoById: builder.query<any, string>({
        query: (id) => `/video/${id}`,
      }),

      getRelatedVideos: builder.query<GetVideosResponse, GetRelatedVideosParams>({
        query: ({ videoId, limit = 20 }) => ({
          url: `/video/related/${videoId}`,
          method: 'GET',
          params: { limit },
        }),
      }),

  }),
});

export const {
  useUploadVideoMutation,
  useDeleteVideoMutation,
  useGetVideosQuery,
  useUploadExternalVideoMutation,
  useDeletethirdpartyVideoMutation,
  useSearchVideosQuery,
  useGetVideoByIdQuery,
  useGetRelatedVideosQuery
} = videoApi;
