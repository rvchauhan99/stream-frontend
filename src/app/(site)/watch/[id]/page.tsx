"use client";
import VideoPlayer from "../../../components/VideoPlayer";
import { useParams } from 'next/navigation';
import { useGetVideoByIdQuery, useGetRelatedVideosQuery } from "../../../store/api/videoApi";

export default function WatchPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data: videoData, isLoading, isError } = useGetVideoByIdQuery(id, {
    skip: !id,
  });
  const { data: relatedVideosData, isLoading: isLoadingRelated } = useGetRelatedVideosQuery({ videoId: id }, {
    skip: !id,
  });

  console.log("relatedVideosData", relatedVideosData);  

  if (isLoading) return <div className="p-6 text-primary">Loading video...</div>;
  if (isError) return <div className="p-6 text-red-500">Failed to load video details.</div>;
  
  // Create empty arrays for loading state
  const mainGridVideos = relatedVideosData?.videos || [];
  const sidebarVideos = relatedVideosData?.videos?.slice(0, 5) || [];

  console.log("mainGridVideos", mainGridVideos);
  console.log("sidebarVideos", sidebarVideos);
  
  return (
    <div className="p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <VideoPlayer data={videoData}/>

            {/* Related Videos Grid */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoadingRelated ? (
                // Loading skeleton
                Array(6).fill(null).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-video bg-dark-10 rounded-lg"></div>
                    <div className="mt-2 space-y-2">
                      <div className="h-4 bg-dark-10 rounded w-3/4"></div>
                      <div className="h-3 bg-dark-10 rounded w-1/2"></div>
                    </div>
                  </div>
                ))
              ) : (
                mainGridVideos.map((video: any) => (
                  <div key={video._id} className="group cursor-pointer">
                    <div className="relative aspect-video bg-dark-10 rounded-lg overflow-hidden">
                      <div className="absolute bottom-1 right-1 bg-black/80 text-primary text-xs px-1 rounded">
                        {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                      </div>
                      {video.drmEnabled && (
                        <div className="absolute top-1 right-1 bg-yellow-500 text-black text-xs px-1 rounded font-medium">
                          DRM
                        </div>
                      )}
                    </div>
                    <div className="mt-2">
                      <h3 className="text-primary text-sm font-medium line-clamp-2 group-hover:text-grey-70">
                        {video.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-grey-70 text-xs">
                        <span>{video.creatorId}</span>
                        <span>•</span>
                        <span>{video.stats.views.toLocaleString()} views</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:w-[400px] space-y-4">
            {isLoadingRelated ? (
              // Loading skeleton for sidebar
              Array(8).fill(null).map((_, i) => (
                <div key={i} className="flex gap-2 animate-pulse">
                  <div className="w-[180px] aspect-video bg-dark-10 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-dark-10 rounded w-3/4"></div>
                    <div className="h-3 bg-dark-10 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : (
              sidebarVideos.map((video: any) => (
                <div key={video._id} className="flex gap-2 group cursor-pointer">
                  <div className="relative w-[180px] aspect-video bg-dark-10 rounded-lg overflow-hidden">
                    <div className="absolute bottom-1 right-1 bg-black/80 text-primary text-xs px-1 rounded">
                      {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                    </div>
                    {video.drmEnabled && (
                      <div className="absolute top-1 right-1 bg-yellow-500 text-black text-xs px-1 rounded font-medium">
                        DRM
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-primary text-sm font-medium line-clamp-2 group-hover:text-grey-70">
                      {video.title}
                    </h3>
                    <div className="mt-1 text-grey-70 text-xs">
                      <div>{video.stats.views.toLocaleString()} views</div>
                      <div>{new Date(video.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 