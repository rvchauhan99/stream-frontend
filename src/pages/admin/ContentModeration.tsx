import { useState } from 'react'
import { baseApi } from '@src/store/api/baseApi'

interface Content {
  id: string
  title: string
  type: 'post' | 'comment' | 'video'
  status: 'pending' | 'approved' | 'rejected'
  reportCount: number
  createdAt: string
  author: {
    name: string
    id: string
  }
}

// Extend the base API with content moderation endpoints
const contentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReportedContent: builder.query<Content[], void>({
      query: () => '/content/reported',
    }),
    updateContentStatus: builder.mutation<void, { contentId: string; status: Content['status'] }>({
      query: ({ contentId, status }) => ({
        url: `/content/${contentId}/status`,
        method: 'PATCH',
        body: { status },
      }),
    }),
  }),
})

export const { useGetReportedContentQuery, useUpdateContentStatusMutation } = contentApi

const ContentModeration = () => {
  const [filter, setFilter] = useState<Content['status'] | 'all'>('all')
  const { data: content = [], isLoading } = useGetReportedContentQuery()
  const [updateStatus] = useUpdateContentStatusMutation()

  const filteredContent = filter === 'all' 
    ? content 
    : content.filter(item => item.status === filter)

  const getStatusColor = (status: Content['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500'
      case 'approved':
        return 'bg-green-500/20 text-green-500'
      case 'rejected':
        return 'bg-red-500/20 text-red-500'
      default:
        return ''
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Moderation</h1>
        <div className="space-x-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg ${
                filter === status 
                  ? 'bg-red-45 text-white' 
                  : 'bg-dark-6 text-grey-60 hover:bg-dark-8'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="space-y-4">
          {filteredContent.map((item) => (
            <div key={item.id} className="bg-dark-6 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-grey-60 text-sm">
                    By {item.author.name} • {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                  <span className="bg-dark-8 px-2 py-1 rounded-full text-xs">
                    {item.reportCount} reports
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => updateStatus({ contentId: item.id, status: 'approved' })}
                  className="px-4 py-2 bg-dark-8 text-green-500 rounded hover:bg-dark-10"
                  disabled={item.status === 'approved'}
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus({ contentId: item.id, status: 'rejected' })}
                  className="px-4 py-2 bg-dark-8 text-red-500 rounded hover:bg-dark-10"
                  disabled={item.status === 'rejected'}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ContentModeration 