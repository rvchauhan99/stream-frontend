import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import DashboardPage from '../pages/admin/Dashboard';
import UserManagement from '../pages/admin/UserManagement';
import ContentModeration from '../pages/admin/ContentModeration';
import Analytics from '../pages/admin/Analytics';
import SystemSettings from '@/pages/admin/SystemSettings';

const menuItems = [
  { text: 'Dashboard', icon: '📊', path: '/admin' },
  { text: 'User Management', icon: '👥', path: '/admin/users' },
  { text: 'Content Moderation', icon: '🎥', path: '/admin/content' },
  { text: 'Analytics', icon: '📈', path: '/admin/analytics' },
  { text: 'System Settings', icon: '⚙️', path: '/admin/settings' },
];

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div className="flex h-full flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Admin Panel
        </h1>
      </div>
      <nav className="flex-1 space-y-1 px-2">
        {menuItems.map((item) => (
          <div
            key={item.text}
            onClick={() => navigate(item.path)}
            className="group flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
          >
            <span className="mr-3 flex-shrink-0 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
              {item.icon}
            </span>
            <span className="text-gray-900 dark:text-gray-100 group-hover:text-gray-900 dark:group-hover:text-white">
              {item.text}
            </span>
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={handleDrawerToggle}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition duration-200 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {drawer}
      </div>

      {/* Desktop drawer */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="w-64">
          {drawer}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-4">
            <h1 className="text-lg font-medium text-gray-900 dark:text-white">
              Admin Panel
            </h1>
            <button
              onClick={handleDrawerToggle}
              className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 focus:outline-none">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              <Routes>
                <Route path="/admin" element={<DashboardPage />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/content" element={<ContentModeration />} />
                <Route path="/admin/analytics" element={<Analytics />} />
                <Route path="/admin/settings" element={<SystemSettings />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 