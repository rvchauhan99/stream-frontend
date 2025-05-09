"use client";
import { useState } from "react";
import Link from "next/link";
import { useGetGenericMasterByKeyQuery } from "../store/api/commonApi";
import {
  RssIcon,
  HandThumbUpIcon,
  ClockIcon,
  BoltIcon,
  SparklesIcon,
  TrophyIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const { data: categoryData = [], isLoading } = useGetGenericMasterByKeyQuery("category");
  // const { data: categoryData = [], isLoading } = useGetGenericMasterByKeyQuery('category');
  const [filter, setFilter] = useState('');

  // // Apply filter to categories
  const filteredCategories = categoryData.filter((cat: any) =>
    cat.value.toLowerCase().includes(filter.toLowerCase())
  );


  return (
    <div className="w-64 min-h-full bg-[#0f1216] text-gray-100">
      <div className="px-4 py-2">
        {/* Main Navigation */}
        <nav className="space-y-2">
          <Link
            href="/subscriptions"
            className="flex items-center gap-3 px-3 py-2.5 text-[15px] hover:bg-white/10 rounded-lg"
          >
            <RssIcon className="h-5 w-5" />
            <span>Subscriptions</span>
          </Link>
          <Link
            href="/liked"
            className="flex items-center gap-3 px-3 py-2.5 text-[15px] hover:bg-white/10 rounded-lg"
          >
            <HandThumbUpIcon className="h-5 w-5" />
            <span>Liked</span>
          </Link>
          <Link
            href="/history"
            className="flex items-center gap-3 px-3 py-2.5 text-[15px] hover:bg-white/10 rounded-lg"
          >
            <ClockIcon className="h-5 w-5" />
            <span>Watch History</span>
          </Link>
        </nav>

        <div className="border-t border-white/10 my-4"></div>

        {/* Video Categories */}
        <nav className="space-y-2">
          <Link
            href="/newest"
            className="flex items-center gap-3 px-3 py-2.5 text-[15px] hover:bg-white/10 rounded-lg"
          >
            <BoltIcon className="h-5 w-5" />
            <span>Newest Videos</span>
          </Link>
          <Link
            href="/best"
            className="flex items-center gap-3 px-3 py-2.5 text-[15px] hover:bg-white/10 rounded-lg"
          >
            <HandThumbUpIcon className="h-5 w-5" />
            <span>Best Videos</span>
          </Link>
          <Link
            href="/moments"
            className="flex items-center gap-3 px-3 py-2.5 text-[15px] hover:bg-white/10 rounded-lg"
          >
            <SparklesIcon className="h-5 w-5" />
            <span>Moments</span>
          </Link>
          <Link
            href="/top-creators"
            className="flex items-center gap-3 px-3 py-2.5 text-[15px] hover:bg-white/10 rounded-lg"
          >
            <TrophyIcon className="h-5 w-5" />
            <span>Top Creators</span>
          </Link>
          <Link
            href="/awards-2024"
            className="flex items-center gap-3 px-3 py-2.5 text-[15px] hover:bg-white/10 rounded-lg"
          >
            <TrophyIcon className="h-5 w-5" />
            <span>Awards 2024</span>
          </Link>
        </nav>

        {/* Category Filter */}
        <div className="mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Filter by category..."
              className="w-full bg-[#1a1f25] rounded-lg py-2 px-4 pl-10 text-[15px] focus:outline-none focus:ring-1 focus:ring-white/20"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>


          {/* Categories List (Dynamic) */}
          <div className="mt-2 max-h-[200px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {isLoading ? (
              <p className="text-sm text-gray-400 px-3 py-2">Loading categories...</p>
            ) : filteredCategories.length === 0 ? (
              <p className="text-sm text-gray-400 px-3 py-2">No matching categories</p>
            ) : (
              filteredCategories.map((cat: any) => (
                <Link
                  key={cat._id}
                  href={`/category/${cat.value?.toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex items-center gap-2 px-3 py-2.5 text-[15px] hover:bg-white/10 rounded-lg"
                >
                  <span>{cat.value}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}