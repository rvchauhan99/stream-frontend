export default function Home() {
  return (
    <div className="p-6 bg-dark-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header with quality filters */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-primary">Trending Videos</h1>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 bg-dark-10 text-primary rounded-full text-[15px] hover:bg-dark-15">
              All
            </button>
            <button className="px-4 py-1.5 bg-dark-10 text-grey-70 rounded-full text-[15px] hover:bg-dark-15">
              HD
            </button>
            <button className="px-4 py-1.5 bg-dark-10 text-grey-70 rounded-full text-[15px] hover:bg-dark-15">
              4K
            </button>
            <button className="px-4 py-1.5 bg-dark-10 text-grey-70 rounded-full text-[15px] hover:bg-dark-15">
              VR
            </button>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {/* Video cards will be added here */}
          {Array(15).fill(null).map((_, i) => {
            const isPremium = Math.random() > 0.7; // 30% chance of being premium
            const is4K = Math.random() > 0.6; // 40% chance of being 4K
            
            return (
              <a href={`/watch/${i}`} key={i}>
                <div className="bg-dark-10 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200">
                  <div className="aspect-video bg-dark-15 relative">
                    {/* Badges Container */}
                    <div className="absolute top-2 right-2 flex gap-2">
                      {is4K && (
                        <span className="bg-yellow-500 text-dark-6 text-xs font-bold px-1.5 py-0.5 rounded">
                          4K
                        </span>
                      )}
                      {isPremium && (
                        <span className="bg-red-45 text-primary text-xs font-bold px-1.5 py-0.5 rounded">
                          PREMIUM
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-primary text-[15px] font-medium truncate">Video Title {i + 1}</h3>
                    <p className="text-grey-70 text-[13px] mt-1">1.2M views • 2 hours ago</p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
