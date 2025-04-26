'use client';

import { ArrowUpIcon } from '@heroicons/react/24/solid';
import { 
  ChartBarIcon, 
  VideoCameraIcon, 
  UsersIcon, 
  CurrencyDollarIcon,
  HandThumbUpIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, ResponsiveContainer } from 'recharts';

const viewsData = [
  { year: '2023-Q1', views: 150000, engagement: 25000, subscribers: 5000 },
  { year: '2023-Q2', views: 350000, engagement: 45000, subscribers: 8000 },
  { year: '2023-Q3', views: 550000, engagement: 75000, subscribers: 12000 },
  { year: '2023-Q4', views: 750000, engagement: 95000, subscribers: 15000 },
  { year: '2024-Q1', views: 950000, engagement: 125000, subscribers: 20000 },
];

const revenueData = [
  { month: 'Jan', adsRevenue: 2000, sponsorships: 1000 },
  { month: 'Feb', adsRevenue: 2500, sponsorships: 1500 },
  { month: 'Mar', adsRevenue: 3000, sponsorships: 2000 },
  { month: 'Apr', adsRevenue: 3500, sponsorships: 2500 },
  { month: 'May', adsRevenue: 4000, sponsorships: 3000 },
];

const recentVideos = [
  { 
    id: 1,
    thumbnail: '/video1.jpg',
    title: 'Getting Started with React',
    views: '12.5K',
    publishedAt: '2 hours ago',
    status: 'Published'
  },
  { 
    id: 2,
    thumbnail: '/video2.jpg',
    title: 'Advanced TypeScript Tips',
    views: '8.3K',
    publishedAt: '1 day ago',
    status: 'Published'
  },
  { 
    id: 3,
    thumbnail: '/video3.jpg',
    title: 'Web Development in 2024',
    views: '5.1K',
    publishedAt: '2 days ago',
    status: 'Processing'
  },
];

interface StatCardProps {
  title: string;
  value: string;
  change: {
    value: string;
    timeframe: string;
    isPositive: boolean;
  };
  icon: React.ElementType;
}

function StatCard({ title, value, change, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-dark-10 rounded-xl p-6 border border-dark-20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-grey-70 text-lg font-medium">{title}</h3>
        <Icon className="h-6 w-6 text-grey-70" />
      </div>
      <div className="space-y-2">
        <div className="text-3xl font-bold text-white">{value}</div>
        <div className="flex items-center space-x-2">
          <div className={`flex items-center ${change.isPositive ? 'text-green-500' : 'text-red-45'}`}>
            <ArrowUpIcon className={`h-4 w-4 ${!change.isPositive && 'rotate-180'}`} />
            <span className="font-medium">{change.value}</span>
          </div>
          <span className="text-grey-60">{change.timeframe}</span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Views',
      value: '2.5M',
      change: {
        value: '+25%',
        timeframe: 'this month',
        isPositive: true
      },
      icon: ChartBarIcon
    },
    {
      title: 'Total Videos',
      value: '156',
      change: {
        value: '+3',
        timeframe: 'this week',
        isPositive: true
      },
      icon: VideoCameraIcon
    },
    {
      title: 'Subscribers',
      value: '45.6K',
      change: {
        value: '+1.2K',
        timeframe: 'this month',
        isPositive: true
      },
      icon: UsersIcon
    },
    {
      title: 'Revenue',
      value: '$15.2K',
      change: {
        value: '+18%',
        timeframe: 'this month',
        isPositive: true
      },
      icon: CurrencyDollarIcon
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-grey-70">Track your channel performance and growth</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="chart-container">
          <h3 className="chart-title">Views Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={viewsData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--gradient-start)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--gradient-end)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="chart-grid" />
                <XAxis dataKey="year" className="chart-axis" />
                <YAxis className="chart-axis" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--tw-color-dark-8)',
                    borderColor: 'var(--tw-color-dark-20)',
                    borderRadius: '0.5rem',
                  }}
                  wrapperClassName="chart-tooltip"
                  labelStyle={{ color: 'var(--tw-color-white)' }}
                  itemStyle={{ color: 'var(--tw-color-grey-70)' }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  className="chart-primary chart-gradient-primary"
                  fillOpacity={1}
                  fill="url(#colorViews)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Revenue Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="chart-grid" />
                <XAxis dataKey="month" className="chart-axis" />
                <YAxis className="chart-axis" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--tw-color-dark-8)',
                    borderColor: 'var(--tw-color-dark-20)',
                    borderRadius: '0.5rem',
                  }}
                  wrapperClassName="chart-tooltip"
                  labelStyle={{ color: 'var(--tw-color-white)' }}
                  itemStyle={{ color: 'var(--tw-color-grey-70)' }}
                />
                <Legend className="chart-legend" />
                <Bar dataKey="adsRevenue" name="Ads Revenue" className="chart-primary" />
                <Bar dataKey="sponsorships" name="Sponsorships" className="chart-secondary" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-dark-10 rounded-xl p-6 border border-dark-20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-grey-70">Recent Videos</h3>
          <button className="text-red-45 hover:text-red-60 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {recentVideos.map((video) => (
            <div key={video.id} className="flex items-center justify-between py-3 border-b border-dark-20 last:border-0">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-10 bg-dark-15 rounded-lg overflow-hidden">
                  {/* Video thumbnail placeholder */}
                  <div className="w-full h-full bg-dark-20"></div>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{video.title}</div>
                  <div className="text-sm text-grey-60">{video.publishedAt}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-grey-70">{video.views} views</div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  video.status === 'Published' 
                    ? 'bg-green-500/10 text-green-500' 
                    : 'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {video.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 