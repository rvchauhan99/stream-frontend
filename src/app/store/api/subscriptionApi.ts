import { baseApi } from './baseApi';

export interface SubscribeRequest {
  planId: string;
  paymentMethod: string;
  transactionId: string;
  amountPaid: number;
}

export interface SubscriptionResponse {
  _id: string;
  userId: string;
  planId: string;
  startDate: string;
  endDate: string;
  status: string;
  paymentDetails: {
    paymentMethod: string;
    transactionId: string;
    amountPaid: number;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Subscribe to a plan
    subscribeToPlan: builder.mutation<any, SubscribeRequest>({
      query: (body) => ({
        url: '/subscription/subscribe',
        method: 'POST',
        body
      })
    }),

    // ✅ Cancel active subscription
    cancelSubscription: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/subscription/cancel',
        method: 'POST'
      })
    }),

    // ✅ Get current subscription for the logged-in user
    getSubscription: builder.query<SubscriptionResponse, void>({
      query: () => ({
        url: '/subscription/getSubscription',
        method: 'GET'
      })
    })
  })
});

export const {
  useSubscribeToPlanMutation,
  useCancelSubscriptionMutation,
  useGetSubscriptionQuery
} = subscriptionApi;
