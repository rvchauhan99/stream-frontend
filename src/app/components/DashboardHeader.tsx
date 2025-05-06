'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bars3Icon, 
  MagnifyingGlassIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
  BellIcon
} from '@heroicons/react/24/outline';

interface DashboardHeaderProps {
  onMobileMenuToggle: () => void;
}

export default function DashboardHeader({ onMobileMenuToggle }: DashboardHeaderProps) {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userNavigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Profile', href: '/profile', icon: UserCircleIcon },
    // { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
    { name: 'Sign out', href: '/logout', icon: ArrowRightOnRectangleIcon },
  ];

  const userName = "Rahul Vibs";
  const userEmail = "rahul@example.com";
  const userInitial = userName.charAt(0);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-dark-6 border-b border-dark-20">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            className="md:hidden text-grey-70 hover:text-primary p-2 rounded-lg"
            onClick={onMobileMenuToggle}
            aria-label="Toggle menu"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <Link href="/" className="flex-shrink-0 text-2xl font-bold text-red-45">
            NightKing
          </Link>

        </div>

        {/* Search bar - desktop */}
        <div className="flex-1 max-w-2xl mx-auto px-4 hidden md:block">
          <div className="relative">
            <input
              type="search"
              placeholder="Search"
              className="w-full bg-dark-10 text-primary placeholder-grey-70 px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45 border border-dark-20"
            />
            <MagnifyingGlassIcon className="h-5 w-5 absolute right-3 top-2.5 text-grey-70" />
          </div>
        </div>

        {/* Right section with notifications and profile */}
        <div className="flex items-center space-x-4">
          {/* Mobile search button */}
          <button
            className="md:hidden text-grey-70 hover:text-primary p-2 rounded-lg"
            onClick={() => setIsSearchVisible(!isSearchVisible)}
          >
            <MagnifyingGlassIcon className="h-6 w-6" />
          </button>

          {/* Notifications */}
          <button className="text-grey-70 hover:text-primary p-2 rounded-lg relative">
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-45 rounded-full"></span>
          </button>

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center space-x-3 text-grey-70 hover:text-primary p-2 rounded-lg"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="relative w-8 h-8 rounded-full bg-dark-15 flex items-center justify-center text-primary">
                {avatarError ? (
                  <span className="text-sm font-medium">{userInitial}</span>
                ) : (
                  <img
                    src="/avatar.jpg"
                    alt={`${userName}'s avatar`}
                    className="w-full h-full object-cover rounded-full"
                    onError={() => setAvatarError(true)}
                  />
                )}
              </div>
              <span className="hidden sm:inline text-sm font-medium">{userName}</span>
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-dark-10 rounded-lg shadow-lg border border-dark-20 py-2">
                <div className="px-4 py-3 border-b border-dark-20">
                  <p className="text-sm text-primary font-medium">{userName}</p>
                  <p className="text-sm text-grey-70">{userEmail}</p>
                </div>
                {userNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-grey-70 hover:text-primary hover:bg-dark-15"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Mobile search overlay */}
        {isSearchVisible && (
          <div className="absolute top-16 left-0 right-0 p-4 bg-dark-6 border-b border-dark-20 md:hidden">
            <div className="relative">
              <input
                type="search"
                placeholder="Search"
                className="w-full bg-dark-10 text-primary placeholder-grey-70 px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-45 border border-dark-20"
              />
              <MagnifyingGlassIcon className="h-5 w-5 absolute right-3 top-2.5 text-grey-70" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

