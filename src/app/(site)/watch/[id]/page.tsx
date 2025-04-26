import VideoPlayer from "../../../components/VideoPlayer";

export default function WatchPage() {
  return (
    <div className="p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <VideoPlayer />

            {/* Video Categories */}
            <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
              <button className="px-4 py-1.5 bg-dark-10 text-primary rounded-full text-[15px] whitespace-nowrap">
                Related Videos
              </button>
              <button className="px-4 py-1.5 bg-dark-10 text-grey-70 rounded-full text-[15px] whitespace-nowrap">
                From EnjoyX
              </button>
              <button className="px-4 py-1.5 bg-dark-10 text-grey-70 rounded-full text-[15px] whitespace-nowrap">
                Recommended
              </button>
            </div>

            {/* Related Videos Grid */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6).fill(null).map((_, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="relative aspect-video bg-dark-10 rounded-lg overflow-hidden">
                    <div className="absolute bottom-1 right-1 bg-black/80 text-primary text-xs px-1 rounded">
                      {Math.floor(Math.random() * 20 + 30)}:00
                    </div>
                    <div className="absolute top-1 right-1 bg-yellow-500 text-black text-xs px-1 rounded font-medium">
                      4K
                    </div>
                  </div>
                  <div className="mt-2">
                    <h3 className="text-primary text-sm font-medium line-clamp-2 group-hover:text-grey-70">
                      LEGENDARYXX Yasmina Khan comes home for dick
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-grey-70 text-xs">
                      <span>Legendary X</span>
                      <span>•</span>
                      <span>3.5M views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:w-[400px] space-y-4">
            {Array(8).fill(null).map((_, i) => (
              <div key={i} className="flex gap-2 group cursor-pointer">
                <div className="relative w-[180px] aspect-video bg-dark-10 rounded-lg overflow-hidden">
                  <div className="absolute bottom-1 right-1 bg-black/80 text-primary text-xs px-1 rounded">
                    {Math.floor(Math.random() * 20 + 30)}:00
                  </div>
                  <div className="absolute top-1 right-1 bg-yellow-500 text-black text-xs px-1 rounded font-medium">
                    4K
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-primary text-sm font-medium line-clamp-2 group-hover:text-grey-70">
                    Exotic Stunner Venus Afrodita Takes it Deep
                  </h3>
                  <div className="mt-1 text-grey-70 text-xs">
                    <div>1.2M views</div>
                    <div>2 hours ago</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 