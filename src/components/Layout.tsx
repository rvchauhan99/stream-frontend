import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WidgetsIcon from '@mui/icons-material/Widgets';
import TableChartIcon from '@mui/icons-material/TableChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import ArticleIcon from '@mui/icons-material/Article';
import EmailIcon from '@mui/icons-material/Email';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/users', label: 'Users', icon: <ViewModuleIcon /> },
    // { path: '/elements', label: 'Elements', icon: <ViewModuleIcon />, hasSubmenu: true },
    { path: '/videos', label: 'Videos', icon: <ViewModuleIcon /> },

    { path: '/channel-details', label: 'Channel Details', icon: <ViewModuleIcon /> },
    { path: '/withdrawals', label: 'Withdrawals', icon: <ViewModuleIcon /> },
    { path: '/settings', label: 'Settings', icon: <ViewModuleIcon /> },

  ];

  return (
    <div className="min-h-screen bg-primary">
      {/* Top Header */}
      <header className="bg-dark-8 h-16 fixed w-full z-10 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-red-45 text-2xl font-bold flex items-center">
            <span className="text-3xl">🎬</span>
            <span className="ml-2">RahulVibs</span>
          </Link>
          <button className="text-grey-70 p-2 hover:text-white">
            <MenuIcon />
          </button>
          <div className="relative">
            <input
              type="search"
              placeholder="Search"
              className="bg-dark-10 text-grey-70 px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-1 focus:ring-red-45"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <button className="text-grey-70 hover:text-white relative">
            <EmailIcon />
            <span className="absolute -top-1 -right-1 bg-red-45 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </button>
          <button className="text-grey-70 hover:text-white relative">
            <NotificationsIcon />
            <span className="absolute -top-1 -right-1 bg-red-45 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">5</span>
          </button>
          <div className="flex items-center space-x-2 text-grey-70 hover:text-white cursor-pointer">
            <img src="https://i.pinimg.com/736x/bb/a3/e7/bba3e76072dbd2a41e4d54e4b112bae0.jpg" alt="Profile" className="w-8 h-8 rounded-full" />
            <span>John Doe</span>
            <KeyboardArrowDownIcon />
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="bg-dark-8 w-64 fixed left-0 top-16 bottom-0 overflow-y-auto">
        <div className="p-4">
          
          
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link group ${
                  location.pathname === item.path ? 'active' : ''
                }`}
              >
                <span className="text-current">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.hasSubmenu && (
                  <KeyboardArrowDownIcon className="text-grey-70 group-hover:text-white" />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 pt-16 p-6">
        {children}
      </main>
    </div>
  );
} 