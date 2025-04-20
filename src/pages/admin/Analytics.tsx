import { useState } from 'react'
import { baseApi } from '@src/store/api/baseApi'

interface AnalyticsData {
  overview: {
    totalUsers: number
    activeUsers: number
    totalRevenue: number
    conversionRate: number
  }
  userMetrics: {
    newUsers: number
    returningUsers: number
    averageSessionDuration: number
    bounceRate: number
  }
  trafficSources: {
    source: string
    visits: number
    percentage: number
  }[]
  recentActivity: {
    id: string
    type: string
    description: string
    timestamp: string
  }[]
}

const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnalytics: builder.query<AnalyticsData, void>({
      query: () => '/analytics/dashboard',
      pollingInterval: 300000, // Poll every 5 minutes
    }),
  }),
})

export const { useGetAnalyticsQuery } = analyticsApi

const Analytics = () => {
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('day')
  const { data, isLoading } = useGetAnalyticsQuery()

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
    }).format(num)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      compactDisplay: 'short',
    }).format(amount)
  }

  if (isLoading || !data) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <div className="space-x-2">
          {(['day', 'week', 'month'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-4 py-2 rounded-lg ${
                timeframe === period
                  ? 'bg-red-45 text-white'
                  : 'bg-dark-6 text-grey-60 hover:bg-dark-8'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Overview Cards */}
        <div className="bg-dark-6 p-6 rounded-lg">
          <h3 className="text-sm text-grey-60 mb-2">Total Users</h3>
          <p className="text-2xl font-bold">{formatNumber(data.overview.totalUsers)}</p>
          <div className="mt-2 text-sm text-green-500">+5.2% from last {timeframe}</div>
        </div>

        <div className="bg-dark-6 p-6 rounded-lg">
          <h3 className="text-sm text-grey-60 mb-2">Active Users</h3>
          <p className="text-2xl font-bold">{formatNumber(data.overview.activeUsers)}</p>
          <div className="mt-2 text-sm text-green-500">+2.1% from last {timeframe}</div>
        </div>

        <div className="bg-dark-6 p-6 rounded-lg">
          <h3 className="text-sm text-grey-60 mb-2">Total Revenue</h3>
          <p className="text-2xl font-bold">{formatCurrency(data.overview.totalRevenue)}</p>
          <div className="mt-2 text-sm text-green-500">+8.3% from last {timeframe}</div>
        </div>

        <div className="bg-dark-6 p-6 rounded-lg">
          <h3 className="text-sm text-grey-60 mb-2">Conversion Rate</h3>
          <p className="text-2xl font-bold">{data.overview.conversionRate}%</p>
          <div className="mt-2 text-sm text-red-500">-1.2% from last {timeframe}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Sources */}
        <div className="bg-dark-6 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Traffic Sources</h2>
          <div className="space-y-4">
            {data.trafficSources.map((source) => (
              <div key={source.source} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{source.source}</p>
                  <p className="text-xs text-grey-60">{formatNumber(source.visits)} visits</p>
                </div>
                <div className="flex items-center">
                  <div className="w-24 h-2 bg-dark-8 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-45"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                  <span className="ml-2 text-sm text-grey-60">{source.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Metrics */}
        <div className="bg-dark-6 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">User Metrics</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-grey-60">New vs Returning Users</p>
              <div className="flex items-center mt-2">
                <div className="flex-1 h-2 bg-dark-8 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-45"
                    style={{
                      width: `${(data.userMetrics.newUsers /
                        (data.userMetrics.newUsers + data.userMetrics.returningUsers)) *
                        100}%`,
                    }}
                  />
                </div>
                <span className="ml-2 text-sm">
                  {Math.round(
                    (data.userMetrics.newUsers /
                      (data.userMetrics.newUsers + data.userMetrics.returningUsers)) *
                      100
                  )}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-grey-60">Avg. Session Duration</p>
              <p className="text-lg font-semibold">
                {Math.round(data.userMetrics.averageSessionDuration / 60)} min
              </p>
            </div>
            <div>
              <p className="text-sm text-grey-60">Bounce Rate</p>
              <p className="text-lg font-semibold">{data.userMetrics.bounceRate}%</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-dark-6 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {data.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-2 h-2 mt-1.5 bg-red-45 rounded-full" />
                <div>
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-grey-60">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics 