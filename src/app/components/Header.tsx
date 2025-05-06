'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Bars3Icon,
  UserCircleIcon,
  Cog6ToothIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon

} from '@heroicons/react/24/outline';

import {
  MagnifyingGlassIcon, GlobeAltIcon, VideoCameraIcon, ChatBubbleLeftIcon,
  UserGroupIcon, PhotoIcon, StarIcon, HandThumbUpIcon,
  ClockIcon, ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useAppSelector } from '../store/hooks';
import { selectCurrentUser, selectIsAuthenticated } from '../store/slices/authSlice';
interface HeaderProps {
  hideNavMenu?: boolean;
}


export default function Header({ hideNavMenu = false }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropDown, setprofileDropDown] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  

  console.log("user", user);


  const userName = user?.name || "Rahul Vibs";
  const userEmail = user?.email || "rahul@example.com";
  const userInitial = userName.charAt(0).toUpperCase();


  const userNavigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    // { name: 'Profile', href: '/dashboard/profile', icon: UserCircleIcon },
    { name: 'Profile', href: '/profile', icon: Cog6ToothIcon },
    { name: 'Sign out', href: '/logout', icon: ArrowRightOnRectangleIcon },
  ];



  return (
    <header className="bg-dark-6 text-primary fixed w-full z-[9999] shadow-xl">
      <div className="max-w-screen-xl mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 text-2xl font-bold text-red-45">
            NightKing
          </Link>

          {/* Search */}
          <div className="flex-1 w-full sm:w-auto max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for videos"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-dark-10 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-red-45 text-primary"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-grey-70" />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-end">
            <button className="flex items-center gap-1 hover:text-red-45">
              <GlobeAltIcon className="h-5 w-5" />
              <span className="hidden sm:inline">EN</span>
            </button>

            {!isAuthenticated ? (
              <>
                <Link href="/login" className="px-4 py-2 text-dark-6 bg-grey-70 hover:bg-grey-80 rounded-md font-medium">
                  Login
                </Link>
                <Link href="/signup" className="px-4 py-2 bg-red-45 hover:bg-red-55 rounded-md font-medium">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                {/* {!user?.subscriptionId && (
                  <Link href="/subscribe" className="px-4 py-2 bg-yellow-400 text-black hover:bg-yellow-300 rounded-md font-medium">
                    Subscribe
                  </Link>
                )} */}
                <div className="relative">
                  {/* <button
                    onClick={() => setprofileDropDown(!profileDropDown)}
                    className="w-10 h-10 rounded-full bg-grey-70 text-dark-10 flex items-center justify-center hover:ring-2 hover:ring-red-45"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0H4.5z" />
                    </svg>
                  </button> */}

                  <button
                    className="flex items-center space-x-3 text-grey-70 hover:text-primary p-2 rounded-lg"
                    onClick={() => setprofileDropDown(!profileDropDown)}
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


                  {/* {profileDropDown && (
                    <div
                      className="absolute right-0 mt-2 w-40 bg-dark-10 border border-dark-20 rounded-lg shadow-lg z-[99999]"
                      onMouseLeave={() => setprofileDropDown(false)}
                    >
                      <Link href="/settings" className="block px-4 py-2 text-sm text-grey-70 hover:bg-dark-15 hover:text-primary">
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          localStorage.removeItem('token');
                          localStorage.removeItem('user');
                          window.location.href = '/login';
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-grey-70 hover:bg-dark-15 hover:text-primary"
                      >
                        Logout
                      </button>
                    </div>
                  )} */}



                  {profileDropDown && (
                    <div
                      className="absolute right-0 mt-2 w-40 bg-dark-10 border border-dark-20 rounded-lg shadow-lg z-[99999]"
                      onMouseLeave={() => setprofileDropDown(false)}
                    >
                      {userNavigation.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-grey-70 hover:text-primary hover:bg-dark-15"
                            onClick={() => setprofileDropDown(false)}
                          >
                            <Icon className="h-5 w-5" />
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}


                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {!hideNavMenu && (
      <nav className="border-t border-dark-20 overflow-x-auto">
        <div className="max-w-screen-xl mx-auto px-4">
          <ul className="flex items-center gap-4 sm:gap-6 text-sm whitespace-nowrap">
            <li className="relative">
              <button
                className="flex items-center gap-1 px-3 py-3 hover:text-red-45"
                onMouseEnter={() => setprofileDropDown(true)}
                onMouseLeave={() => setprofileDropDown(false)}
              >
                <VideoCameraIcon className="h-5 w-5" />
                <span>Videos</span>
                <ChevronDownIcon className={`h-4 w-4 ml-1 transition-transform duration-200 ${profileDropDown ? 'rotate-180' : ''}`} />
              </button>
              {profileDropDown && (
                <div
                  style={{ zIndex: 99999 }}
                  className="fixed mt-1 w-48 bg-dark-10 rounded-md shadow-xl py-1"
                  onMouseEnter={() => setprofileDropDown(true)}
                  onMouseLeave={() => setprofileDropDown(false)}
                >
                  <Link href="/videos/best" className="flex items-center gap-2 px-4 py-2 text-sm text-grey-70 hover:bg-dark-15 hover:text-primary">
                    <HandThumbUpIcon className="h-5 w-5" />
                    Best Videos
                  </Link>
                  <Link href="/videos/moments" className="flex items-center gap-2 px-4 py-2 text-sm text-grey-70 hover:bg-dark-15 hover:text-primary">
                    <VideoCameraIcon className="h-5 w-5" />
                    Moments
                  </Link>
                  <Link href="/videos/history" className="flex items-center gap-2 px-4 py-2 text-sm text-grey-70 hover:bg-dark-15 hover:text-primary">
                    <ClockIcon className="h-5 w-5" />
                    Watch History
                  </Link>
                  <div className="border-t border-dark-20 my-1"></div>
                  <Link href="/videos/indian" className="flex items-center gap-2 px-4 py-2 text-sm text-grey-70 hover:bg-dark-15 hover:text-primary">
                    <span className="w-5 h-5 flex items-center">🇮🇳</span>
                    Indian
                  </Link>
                  <Link href="/videos/amateur" className="flex items-center gap-2 px-4 py-2 text-sm text-grey-70 hover:bg-dark-15 hover:text-primary">
                    Amateur
                  </Link>
                  <Link href="/videos/mature" className="flex items-center gap-2 px-4 py-2 text-sm text-grey-70 hover:bg-dark-15 hover:text-primary">
                    Mature
                  </Link>
                  <Link href="/videos/old-young" className="flex items-center gap-2 px-4 py-2 text-sm text-grey-70 hover:bg-dark-15 hover:text-primary">
                    Old & Young
                  </Link>
                </div>
              )}
            </li>
            <li><Link href="/live" className="flex items-center gap-1 px-3 py-3 hover:text-red-45"><span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-45 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-55"></span></span><span>Live Cams</span></Link></li>
            <li><Link href="/categories" className="px-3 py-3 hover:text-red-45">Categories</Link></li>
            <li><Link href="/stars" className="px-3 py-3 hover:text-red-45">Stars</Link></li>
            <li><Link href="/creators" className="px-3 py-3 hover:text-red-45">Creators</Link></li>
            <li><Link href="/channels" className="px-3 py-3 hover:text-red-45">Channels</Link></li>
            <li><Link href="/photos" className="flex items-center gap-1 px-3 py-3 hover:text-red-45"><PhotoIcon className="h-5 w-5" /><span>Photos</span></Link></li>
            <li><Link href="/chat" className="flex items-center gap-1 px-3 py-3 hover:text-red-45"><ChatBubbleLeftIcon className="h-5 w-5" /><span>Chat</span></Link></li>
            <li><Link href="/premium" className="flex items-center gap-1 px-3 py-3 text-yellow-400 hover:text-yellow-300"><StarIcon className="h-5 w-5" /><span>Premium Videos</span></Link></li>
            <li><Link href="/dating" className="flex items-center gap-1 px-3 py-3 hover:text-red-45"><UserGroupIcon className="h-5 w-5" /><span>Dating</span></Link></li>
          </ul>
        </div>
      </nav>
      )}
    </header>
  );
}
