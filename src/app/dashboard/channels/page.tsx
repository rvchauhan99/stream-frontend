'use client';
import React from 'react';
import type { JSX } from 'react';
import { useState } from 'react';
import { Formik, Form, Field, FormikErrors, FormikTouched } from 'formik';
import * as Yup from 'yup';
import {
  ChartBarIcon,
  VideoCameraIcon,
  UsersIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  HandThumbUpIcon,
  EyeIcon,
  PencilIcon,
  PaintBrushIcon,
  LinkIcon,
  LanguageIcon,
  CheckBadgeIcon,
  BellIcon,
  ShieldCheckIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface ChannelTab {
  id: string;
  title: string;
  icon: JSX.Element;
}

interface ChannelStats {
  totalViews: number;
  totalSubscribers: number;
  totalRevenue: number;
  totalLikes: number;
  viewsGrowth: number;
  subscriberGrowth: number;
  revenueGrowth: number;
  likesGrowth: number;
}

interface ChannelInfo {
  name: string;
  description: string;
  category: string;
  joinDate: string;
  location: string;
  website: string;
  socialLinks: {
    youtube: string;
    twitter: string;
    instagram: string;
  };
}

interface ChannelFormValues {
  name: string;
  description: string;
  category: string;
  website: string;
  socialLinks: {
    youtube: string;
    twitter: string;
    instagram: string;
  };
  language: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Channel name is required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
  website: Yup.string().url('Must be a valid URL'),
  socialLinks: Yup.object({
    youtube: Yup.string().url('Must be a valid URL'),
    twitter: Yup.string().url('Must be a valid URL'),
    instagram: Yup.string().url('Must be a valid URL'),
  }),
  language: Yup.string().required('Language is required'),
});

export default function ChannelDetails() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  const channelStats: ChannelStats = {
    totalViews: 1234567,
    totalSubscribers: 50000,
    totalRevenue: 25000,
    totalLikes: 75000,
    viewsGrowth: 12.5,
    subscriberGrowth: 8.3,
    revenueGrowth: 15.7,
    likesGrowth: 10.2,
  };

  const [channelInfo, setChannelInfo] = useState<ChannelInfo>({
    name: 'Crypto Education Hub',
    description: 'Your trusted source for cryptocurrency education and trading insights.',
    category: 'Education & Finance',
    joinDate: 'January 2023',
    location: 'Global',
    website: 'www.cryptoedhub.com',
    socialLinks: {
      youtube: 'youtube.com/cryptoedhub',
      twitter: 'twitter.com/cryptoedhub',
      instagram: 'instagram.com/cryptoedhub',
    },
  });

  const mockChartData = {
    views: [10000, 15000, 12000, 18000, 22000, 20000, 25000],
    revenue: [500, 750, 600, 900, 1100, 1000, 1250],
    dates: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  };

  const tabs: ChannelTab[] = [
    { id: 'overview', title: 'Channel Overview', icon: <ChartBarIcon className="w-6 h-6" /> },
    { id: 'settings', title: 'Channel Settings', icon: <Cog6ToothIcon className="w-6 h-6" /> },
  ];

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const renderStatCard = (title: string, value: number, growth: number, icon: JSX.Element) => (
    <div className="bg-dark-10 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {icon}
          <h3 className="text-grey-70">{title}</h3>
        </div>
        <span className={`text-sm ${growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {growth >= 0 ? '+' : ''}{growth}%
        </span>
      </div>
      <p className="text-2xl font-bold text-white">{formatNumber(value)}</p>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Channel Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-24 h-24 bg-dark-15 rounded-lg flex items-center justify-center text-3xl text-grey-70">
          {channelInfo.name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{channelInfo.name}</h1>
              <p className="text-grey-70">{channelInfo.category}</p>
            </div>
          
          </div>
          <p className="text-grey-70 mt-2">{channelInfo.description}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderStatCard('Total Views', channelStats.totalViews, channelStats.viewsGrowth, <EyeIcon className="w-6 h-6 text-blue-500" />)}
        {renderStatCard('Subscribers', channelStats.totalSubscribers, channelStats.subscriberGrowth, <UsersIcon className="w-6 h-6 text-purple-500" />)}
        {renderStatCard('Revenue', channelStats.totalRevenue, channelStats.revenueGrowth, <CurrencyDollarIcon className="w-6 h-6 text-green-500" />)}
        {renderStatCard('Total Likes', channelStats.totalLikes, channelStats.likesGrowth, <HandThumbUpIcon className="w-6 h-6 text-yellow-500" />)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-10 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Views Trend</h3>
          <div className="relative h-[300px]">
            <div className="absolute inset-0 flex items-end space-x-1">
              {mockChartData.views.map((value, index) => {
                const height = (value / Math.max(...mockChartData.views)) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500/20 to-blue-500/5 rounded-t"
                      style={{ height: `${height}%` }}
                    >
                      <div
                        className="w-full h-1 bg-blue-500"
                        style={{ marginTop: `${height}%` }}
                      />
                    </div>
                    <span className="text-xs text-grey-70 mt-2">{mockChartData.dates[index]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="bg-dark-10 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Revenue Trend</h3>
          <div className="relative h-[300px]">
            <div className="absolute inset-0 flex items-end space-x-1">
              {mockChartData.revenue.map((value, index) => {
                const height = (value / Math.max(...mockChartData.revenue)) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-green-500/20 to-green-500/5 rounded-t"
                      style={{ height: `${height}%` }}
                    >
                      <div
                        className="w-full h-1 bg-green-500"
                        style={{ marginTop: `${height}%` }}
                      />
                    </div>
                    <span className="text-xs text-grey-70 mt-2">{mockChartData.dates[index]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Channel Info */}
      <div className="bg-dark-10 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-4">Channel Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-grey-70">Join Date</p>
              <p className="text-white">{channelInfo.joinDate}</p>
            </div>
            <div>
              <p className="text-grey-70">Location</p>
              <p className="text-white">{channelInfo.location}</p>
            </div>
            <div>
              <p className="text-grey-70">Website</p>
              <a href={`https://${channelInfo.website}`} className="text-red-45 hover:text-red-60" target="_blank" rel="noopener noreferrer">
                {channelInfo.website}
              </a>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-grey-70">Social Links</p>
              <div className="space-y-2">
                <a href={`https://${channelInfo.socialLinks.youtube}`} className="text-red-45 hover:text-red-60 block">
                  YouTube
                </a>
                <a href={`https://${channelInfo.socialLinks.twitter}`} className="text-red-45 hover:text-red-60 block">
                  Twitter
                </a>
                <a href={`https://${channelInfo.socialLinks.instagram}`} className="text-red-45 hover:text-red-60 block">
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderChannelSettings = () => {
    const initialValues: ChannelFormValues = {
      name: channelInfo.name,
      description: channelInfo.description,
      category: channelInfo.category,
      website: channelInfo.website,
      socialLinks: channelInfo.socialLinks,
      language: 'en',
    };

    const handleSubmit = (values: ChannelFormValues) => {
      console.log('Form submitted:', values);
      setChannelInfo({
        ...channelInfo,
        ...values,
      });
    };

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }: { 
          errors: FormikErrors<ChannelFormValues>;
          touched: FormikTouched<ChannelFormValues>;
          isSubmitting: boolean;
        }) => (
          <Form className="space-y-6">
            {/* Branding Section */}
            <div className="bg-dark-10 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-6">
                <PaintBrushIcon className="w-6 h-6 text-purple-500" />
                <h3 className="text-white font-semibold">Branding</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-grey-70 mb-2">Channel Icon</p>
                  <div className="w-32 h-32 bg-dark-15 rounded-lg flex items-center justify-center">
                    <button type="button" className="text-red-45 hover:text-red-60">
                      <PencilIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-grey-70 mb-2">Banner Image</p>
                  <div className="w-full h-32 bg-dark-15 rounded-lg flex items-center justify-center">
                    <button type="button" className="text-red-45 hover:text-red-60">
                      <PencilIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Info Section */}
            <div className="bg-dark-10 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-6">
                <PencilIcon className="w-6 h-6 text-blue-500" />
                <h3 className="text-white font-semibold">Basic Info</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-grey-70 mb-2">Channel Name</label>
                  <Field
                    name="name"
                    type="text"
                    className="w-full bg-dark-15 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
                  />
                  {errors.name && touched.name && (
                    <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                  )}
                </div>
                <div>
                  <label className="block text-grey-70 mb-2">Description</label>
                  <Field
                    as="textarea"
                    name="description"
                    rows={4}
                    className="w-full bg-dark-15 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
                  />
                  {errors.description && touched.description && (
                    <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                  )}
                </div>
                <div>
                  <label className="block text-grey-70 mb-2">Category</label>
                  <Field
                    as="select"
                    name="category"
                    className="w-full bg-dark-15 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
                  >
                    <option value="Education & Finance">Education & Finance</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Music">Music</option>
                    <option value="Technology">Technology</option>
                  </Field>
                  {errors.category && touched.category && (
                    <div className="text-red-500 text-sm mt-1">{errors.category}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Links Section */}
            <div className="bg-dark-10 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-6">
                <LinkIcon className="text-green-500 w-6 h-6" />
                <h3 className="text-white font-semibold">Links & Social</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-grey-70 mb-2">Website</label>
                  <Field
                    type="url"
                    name="website"
                    className="w-full bg-dark-15 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
                  />
                  {errors.website && touched.website && (
                    <div className="text-red-500 text-sm mt-1">{errors.website}</div>
                  )}
                </div>
                <div>
                  <label className="block text-grey-70 mb-2">YouTube</label>
                  <Field
                    type="url"
                    name="socialLinks.youtube"
                    className="w-full bg-dark-15 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
                  />
                  {errors.socialLinks?.youtube && touched.socialLinks?.youtube && (
                    <div className="text-red-500 text-sm mt-1">{errors.socialLinks.youtube}</div>
                  )}
                </div>
                <div>
                  <label className="block text-grey-70 mb-2">Twitter</label>
                  <Field
                    type="url"
                    name="socialLinks.twitter"
                    className="w-full bg-dark-15 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
                  />
                  {errors.socialLinks?.twitter && touched.socialLinks?.twitter && (
                    <div className="text-red-500 text-sm mt-1">{errors.socialLinks.twitter}</div>
                  )}
                </div>
                <div>
                  <label className="block text-grey-70 mb-2">Instagram</label>
                  <Field
                    type="url"
                    name="socialLinks.instagram"
                    className="w-full bg-dark-15 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
                  />
                  {errors.socialLinks?.instagram && touched.socialLinks?.instagram && (
                    <div className="text-red-500 text-sm mt-1">{errors.socialLinks.instagram}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="bg-dark-10 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-6">
                <ShieldCheckIcon className="w-6 h-6 text-yellow-500" />
                <h3 className="text-white font-semibold">Advanced Settings</h3>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between py-2 border-b border-dark-15">
                  <div>
                    <p className="text-white">Channel Language</p>
                    <p className="text-grey-70 text-sm">Set your channel's primary language</p>
                  </div>
                  <Field
                    as="select"
                    name="language"
                    className="bg-dark-15 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </Field>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-dark-15">
                  <div>
                    <p className="text-white">Channel Verification</p>
                    <p className="text-grey-70 text-sm">Verify your channel to access additional features</p>
                  </div>
                  <button
                    type="button"
                    className="bg-dark-15 text-white px-4 py-2 rounded-lg hover:bg-dark-20 flex items-center space-x-2"
                  >
                    <CheckBadgeIcon className="w-6 h-6 text-blue-500" />
                    <span>Verify Now</span>
                  </button>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-dark-15">
                  <div>
                    <p className="text-white">Notification Settings</p>
                    <p className="text-grey-70 text-sm">Manage your channel notifications</p>
                  </div>
                  <button
                    type="button"
                    className="bg-dark-15 text-white px-4 py-2 rounded-lg hover:bg-dark-20 flex items-center space-x-2"
                  >
                    <BellIcon className="w-6 h-6 text-red-45" />
                    <span>Configure</span>
                  </button>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-red-500">Delete Channel</p>
                    <p className="text-grey-70 text-sm">Permanently delete your channel and all its content</p>
                  </div>
                  <button
                    type="button"
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center space-x-2"
                  >
                    <TrashIcon className="w-6 h-6" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-red-45 text-white px-6 py-2 rounded-lg hover:bg-red-60 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'settings':
        return renderChannelSettings();
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Top Tabs */}
      <div className="bg-dark-8 rounded-lg">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 ${
                activeTab === tab.id
                  ? 'text-red-45 border-b-2 border-red-45'
                  : 'text-grey-70 hover:text-white hover:bg-dark-15'
              }`}
            >
              {tab.icon}
              <>{tab.title}</>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-dark-8 rounded-lg">
        {renderContent()}
      </div>
    </div>
  );
} 