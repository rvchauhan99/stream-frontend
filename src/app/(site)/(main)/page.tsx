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
    <div className="p-6 bg-dark-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-primary">Trending Videos</h1>
        </div>

        {/* Video Grid */}
        {isLoading ? (
          <p className="text-white">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {data?.videos?.map((video: any) => {
              const isPremium = ['rent', 'paid'].includes(video.monetization?.type);
              return (
                <a
                href={video.type === 'thirdparty' ? video.filePath : `/watch/${video._id}`}
                target={video.type === 'thirdparty' ? '_blank' : '_self'}
                rel={video.type === 'thirdparty' ? 'noopener noreferrer' : undefined}
                key={video._id}
              >
                  <div className="bg-dark-10 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200">
                    <div className="aspect-video bg-dark-15 relative group">
                      <img
                        src={video.thumbnailPath || '/placeholder.jpg'}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      {video.previewPath && (
                        <img
                          src={video.previewPath}
                          alt="Preview"
                          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                      )}
                      {isPremium && (
                        <span className="absolute top-2 right-2 bg-red-45 text-primary text-xs font-bold px-1.5 py-0.5 rounded">
                          PREMIUM
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-primary text-[15px] font-medium truncate">{video.title}</h3>
                      <p className="text-grey-70 text-[13px] mt-1">
                        {video.stats?.views?.toLocaleString() || 0} views • {new Date(video.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
