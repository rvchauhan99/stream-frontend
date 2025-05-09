
interface PageProps {
  params: {
    id: string;
  };
}

export default async function Home({ params }: PageProps) {
  // get the id from the params
  const { id } = await params;

  return (
    <div className="p-6 bg-[#0f1216]">
      <div className="max-w-[1600px] mx-auto">
        {/* Header with quality filters */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">{id}</h1>
          {/* <div className="flex gap-2">
            <button className="px-4 py-1.5 bg-[#1a1f25] text-white rounded-full text-[15px] hover:bg-white/10">
              All
            </button>
            <button className="px-4 py-1.5 bg-[#1a1f25] text-gray-400 rounded-full text-[15px] hover:bg-white/10">
              HD
            </button>
            <button className="px-4 py-1.5 bg-[#1a1f25] text-gray-400 rounded-full text-[15px] hover:bg-white/10">
              4K
            </button>
            <button className="px-4 py-1.5 bg-[#1a1f25] text-gray-400 rounded-full text-[15px] hover:bg-white/10">
              VR
            </button>
          </div> */}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {/* Video cards will be added here */}
        </div>
      </div>
    </div>
  );
}
