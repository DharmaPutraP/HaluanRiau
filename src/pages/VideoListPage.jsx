import { useState } from "react";
import { parseTikTokUrl } from "../utils/tiktokParser";

function VideoListPage() {
  const [visibleCount, setVisibleCount] = useState(12);

  // TikTok video share URLs - Add more URLs here
  const videoInputs = [
    "https://www.tiktok.com/@haluanriau/video/7582464888761486612?is_from_webapp=1&sender_device=pc&web_id=7582482362174768658",
    "https://www.tiktok.com/@scout2015/video/6718335390845095173",
    "https://www.tiktok.com/@scout2015/video/6718335390845095173",
    "https://www.tiktok.com/@scout2015/video/6718335390845095173",
    "https://www.tiktok.com/@scout2015/video/6718335390845095173",
    "https://www.tiktok.com/@scout2015/video/6718335390845095173",
    "https://www.tiktok.com/@scout2015/video/6718335390845095173",
    "https://www.tiktok.com/@scout2015/video/6718335390845095173",
    "https://www.tiktok.com/@scout2015/video/6718335390845095173",
    "https://www.tiktok.com/@scout2015/video/6718335390845095173",
    "https://www.tiktok.com/@scout2015/video/6718335390845095173",
    "https://www.tiktok.com/@scout2015/video/6718335390845095173",
    "https://www.tiktok.com/@scout2015/video/6718335390845095173",
    "https://www.tiktok.com/@scout2015/video/6718335390845095173",
    "https://www.tiktok.com/@scout2015/video/6718335390845095173",
    "https://www.tiktok.com/@scout2015/video/6718335390845095173",
    "https://www.tiktok.com/@scout2015/video/6718335390845095173",
    "https://www.tiktok.com/@scout2015/video/6718335390845095173",
    "https://www.tiktok.com/@scout2015/video/6718335390845095173",
    "https://www.tiktok.com/@scout2015/video/6718335390845095173",
    "https://www.tiktok.com/@scout2015/video/6718335390845095173",
    "https://www.tiktok.com/@scout2015/video/6718335390845095173",
    "https://www.tiktok.com/@scout2015/video/6718335390845095173",
  ];

  // Parse all TikTok URLs
  const allVideos = videoInputs
    .map((input, index) => {
      const parsed = parseTikTokUrl(input);
      return parsed ? { id: index + 1, ...parsed } : null;
    })
    .filter(Boolean);

  // Get visible videos based on current count
  const visibleVideos = allVideos.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 12, allVideos.length));
  };

  const hasMore = visibleCount < allVideos.length;

  return (
    <div className="md:mx-24">
      <div className="bg-white px-5 md:px-10 py-6 mt-2">
        {/* Page Title */}
        <div className="mb-6 flex  gap-3 border-b-4 border-[#EE4339]">
          <h1 className="text-xl md:text-2xl font-bold pb-2">INDEX VIDEO</h1>
          <svg
            className="w-6 h-6 md:w-8 md:h-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            stroke-width="2"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visibleVideos.map((video) => (
            <a
              key={video.id}
              href={video.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 p-1 h-[500px] md:h-[590px] bg-blue-200 rounded-lg overflow-hidden shadow-md block cursor-pointer hover:shadow-xl transition-shadow"
            >
              <iframe
                src={video.embedUrl}
                className="w-full h-full pointer-events-none"
                allowFullScreen
                scrolling="no"
                allow="encrypted-media"
              />
            </a>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleLoadMore}
              className="px-6 py-3 bg-[#EE4339] text-white rounded-lg hover:bg-[#d63330] transition font-semibold"
            >
              Muat Lebih Banyak Video
            </button>
          </div>
        )}

        {/* Show message when all videos loaded */}
        {!hasMore && allVideos.length > 12 && (
          <div className="flex justify-center mt-8 text-gray-600">
            <p>Semua video telah dimuat</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoListPage;
