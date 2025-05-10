"use client";
import { useSearchVideosQuery } from '../../store/api/videoApi';
import { useEffect, useState } from 'react';

export default function Home() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSearchVideosQuery({
    page,
    limit: 20,
    sortBy: 'views',
    sortOrder: 'desc'
  });

  return (
    <div className="p-4 sm:p-6 bg-dark-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-primary">Trending Videos</h1>
        </div>

        {/* Video Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-video bg-dark-10 rounded-lg"></div>
                <div className="mt-2 space-y-2">
                  <div className="h-4 bg-dark-10 rounded w-3/4"></div>
                  <div className="h-3 bg-dark-10 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {data?.videos?.map((video: any) => {
                const isPremium = ['rent', 'paid'].includes(video.monetization?.type);
                return (
                  <a
                    href={video.type === 'thirdparty' ? video.filePath : `/watch/${video._id}`}
                    target={video.type === 'thirdparty' ? '_blank' : '_self'}
                    rel={video.type === 'thirdparty' ? 'noopener noreferrer' : undefined}
                    key={video._id}
                    className="block"
                  >
                    <div className="bg-dark-10 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200 h-full">
                      <div className="aspect-video bg-dark-15 relative group">
                        <img
                          src={video.thumbnailPath || '/placeholder.jpg'}
                          alt={video.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {video.previewPath && (
                          <img
                            src={video.previewPath}
                            alt="Preview"
                            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            loading="lazy"
                          />
                        )}
                        {isPremium && (
                          <span className="absolute top-2 right-2 bg-red-45 text-primary text-xs font-bold px-1.5 py-0.5 rounded">
                            PREMIUM
                          </span>
                        )}
                      </div>
                      <div className="p-2 sm:p-3">
                        <h3 className="text-primary text-sm sm:text-[15px] font-medium line-clamp-2">{video.title}</h3>
                        <p className="text-grey-70 text-xs sm:text-[13px] mt-1">
                          {video.stats?.views?.toLocaleString() || 0} views • {new Date(video.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="w-full sm:w-auto px-4 py-2 bg-dark-10 text-primary rounded-lg hover:bg-dark-15 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-primary text-sm sm:text-base">
                Page {page} of {Math.ceil((data?.total || 0) / 20)}
              </span>
              <button
                onClick={() => setPage(prev => prev + 1)}
                disabled={!data?.videos || data.videos.length < 20}
                className="w-full sm:w-auto px-4 py-2 bg-dark-10 text-primary rounded-lg hover:bg-dark-15 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
