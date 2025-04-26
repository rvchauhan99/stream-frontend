'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts';
import {
  ChartBarIcon,
  VideoCameraIcon,
  UsersIcon,
  CurrencyDollarIcon,
  VideoCameraIcon as VideoCallIcon,
  CloudArrowUpIcon,
  Cog6ToothIcon,
  ChartPieIcon,
} from '@heroicons/react/24/outline';

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
  { date: '2024-03-01', title: 'Getting Started with React', views: '12.5K', likes: '1.2K', status: 'Published' },
  { date: '2024-02-28', title: 'Advanced TypeScript Tips', views: '8.3K', likes: '950', status: 'Published' },
  { date: '2024-02-27', title: 'Web Development in 2024', views: '5.1K', likes: '620', status: 'Processing' },
];

const latestComments = [
  { 
    id: 'CMT-001',
    date: '2024-02-20 14:30',
    user: 'Alice Johnson',
    video: 'Getting Started with React',
    comment: 'Great tutorial! Very helpful.',
    status: 'Approved'
  },
  { 
    id: 'CMT-002',
    date: '2024-02-20 13:15',
    user: 'Bob Smith',
    video: 'Advanced TypeScript Tips',
    comment: 'Could you explain generics more?',
    status: 'Pending'
  },
  { 
    id: 'CMT-003',
    date: '2024-02-20 12:45',
    user: 'Carol White',
    video: 'Web Development in 2024',
    comment: 'Looking forward to more content!',
    status: 'Approved'
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Platform Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-dark-8 p-4 rounded-lg flex items-start justify-between">
          <div>
            <p className="text-grey-70">Total Views</p>
            <h3 className="text-2xl font-bold text-white mt-2">2.5M</h3>
            <p className="text-green-500 text-sm">+25% this month</p>
          </div>
          <ChartBarIcon className="text-red-45 text-3xl" />
        </div>

        <div className="bg-dark-8 p-4 rounded-lg flex items-start justify-between">
          <div>
            <p className="text-grey-70">Total Videos</p>
            <h3 className="text-2xl font-bold text-white mt-2">156</h3>
            <p className="text-green-500 text-sm">+3 this week</p>
          </div>
          <VideoCameraIcon className="text-red-45 text-3xl" />
        </div>

        <div className="bg-dark-8 p-4 rounded-lg flex items-start justify-between">
          <div>
            <p className="text-grey-70">Subscribers</p>
            <h3 className="text-2xl font-bold text-white mt-2">45.6K</h3>
            <p className="text-green-500 text-sm">+1.2K this month</p>
          </div>
          <UsersIcon className="text-red-45 text-3xl" />
        </div>

        <div className="bg-dark-8 p-4 rounded-lg flex items-start justify-between">
          <div>
            <p className="text-grey-70">Revenue</p>
            <h3 className="text-2xl font-bold text-white mt-2">$15.2K</h3>
            <p className="text-green-500 text-sm">+18% this month</p>
          </div>
          <CurrencyDollarIcon className="text-red-45 text-3xl" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <button className="bg-dark-8 p-6 rounded-lg flex flex-col items-center justify-center hover:bg-dark-10 transition-colors">
          <VideoCallIcon className="text-red-45 text-4xl mb-2" />
          <span className="text-white">Upload Video</span>
        </button>
        <button className="bg-dark-8 p-6 rounded-lg flex flex-col items-center justify-center hover:bg-dark-10 transition-colors">
          <CloudArrowUpIcon className="text-red-45 text-4xl mb-2" />
          <span className="text-white">Manage Content</span>
        </button>
        <button className="bg-dark-8 p-6 rounded-lg flex flex-col items-center justify-center hover:bg-dark-10 transition-colors">
          <Cog6ToothIcon className="text-red-45 text-4xl mb-2" />
          <span className="text-white">Channel Settings</span>
        </button>
        <button className="bg-dark-8 p-6 rounded-lg flex flex-col items-center justify-center hover:bg-dark-10 transition-colors">
          <ChartPieIcon className="text-red-45 text-4xl mb-2" />
          <span className="text-white">Analytics</span>
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-8 p-4 rounded-lg">
          <h3 className="text-white font-semibold mb-4">Growth Overview</h3>
          <AreaChart
            width={500}
            height={300}
            data={viewsData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E30000" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#E30000" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="year" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A1A1A',
                border: '1px solid #333',
                borderRadius: '4px',
              }}
            />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#E30000"
              fillOpacity={1}
              fill="url(#colorViews)"
            />
          </AreaChart>
        </div>

        <div className="bg-dark-8 p-4 rounded-lg">
          <h3 className="text-white font-semibold mb-4">Revenue Breakdown</h3>
          <BarChart
            width={500}
            height={300}
            data={revenueData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="month" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A1A1A',
                border: '1px solid #333',
                borderRadius: '4px',
              }}
            />
            <Legend />
            <Bar dataKey="adsRevenue" name="Ads Revenue" fill="#E30000" />
            <Bar dataKey="sponsorships" name="Sponsorships" fill="#FF3333" />
          </BarChart>
        </div>
      </div>

      {/* Recent Videos */}
      <div className="bg-dark-8 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-semibold">Recent Videos</h3>
          <button className="text-red-45 hover:text-red-60">Show All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-grey-70 border-b border-dark-15">
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Views</th>
                <th className="py-3 px-4 text-left">Likes</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentVideos.map((video, index) => (
                <tr key={index} className="border-b border-dark-15">
                  <td className="py-3 px-4 text-grey-70">{video.date}</td>
                  <td className="py-3 px-4 text-grey-70">{video.title}</td>
                  <td className="py-3 px-4 text-grey-70">{video.views}</td>
                  <td className="py-3 px-4 text-grey-70">{video.likes}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      video.status === 'Published' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                    }`}>
                      {video.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="bg-red-45 text-white px-4 py-1 rounded hover:bg-red-60">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Latest Comments */}
      <div className="bg-dark-8 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-semibold">Latest Comments</h3>
          <button className="text-red-45 hover:text-red-60">Show All</button>
        </div>
        <div className="space-y-4">
          {latestComments.map((comment) => (
            <div key={comment.id} className="border-b border-dark-15 pb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-white">{comment.user}</p>
                  <p className="text-grey-70 text-sm">{comment.video}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  comment.status === 'Approved' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                }`}>
                  {comment.status}
                </span>
              </div>
              <p className="text-grey-70">{comment.comment}</p>
              <p className="text-grey-60 text-sm mt-2">{comment.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 