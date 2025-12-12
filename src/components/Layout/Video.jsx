import { useState, useRef } from "react";
import { parseTikTokUrl } from "../../utils/tiktokParser";

function Video() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  // TikTok video share URLs
  const videoInputs = [
    "https://www.tiktok.com/@haluanriau/video/7582464888761486612?is_from_webapp=1&sender_device=pc&web_id=7582482362174768658",
    "https://www.tiktok.com/@scout2015/video/6718335390845095173",
    "https://www.tiktok.com/@scout2015/video/6718335390845095173",
    "https://www.tiktok.com/@scout2015/video/6718335390845095173",
    "https://www.tiktok.com/@scout2015/video/6718335390845095173",
    "https://www.tiktok.com/@scout2015/video/6718335390845095173",
    "https://www.tiktok.com/@scout2015/video/6718335390845095173",
    "https://www.tiktok.com/@scout2015/video/6718335390845095173",
  ];

  const videos = videoInputs
    .slice(0, 7) // Limit to 7 videos
    .map((input, index) => {
      const parsed = parseTikTokUrl(input);
      return parsed ? { id: index + 1, ...parsed } : null;
    })
    .filter(Boolean);

  const scrollToIndex = (index) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const itemWidth = container.offsetWidth / 5; // 5 items visible
      container.scrollTo({
        left: itemWidth * index,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < videos.length - 5) {
      scrollToIndex(currentIndex + 1);
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const itemWidth = container.offsetWidth / 5;
      const newIndex = Math.round(container.scrollLeft / itemWidth);
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div className="mt-2 relative scrollbar-hide">
      {/* Video Slider Container */}
      <div className="relative px-4 md:px-10">
        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#EE4339] text-white rounded-l-full h-full w-10 flex items-center justify-center shadow-lg transition-all hover:bg-[#d63330] cursor-pointer ${
            currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-label="Previous videos"
        >
          <svg
            className="w-6 h-6 md:w-8 md:h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Video Grid */}
        <div className="bg-white py-5">
          {/* Title */}
          <div className="flex gap-1 border-b-3 w-fit border-[#EE4339] mb-3 justify-center mx-auto items-center">
            <div className="font-bold text-xl">VIDEO</div>
          </div>
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-2 md:gap-4 overflow-x-auto scroll-smooth scrollbar-hide px-4 md:px-10"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {videos.map((video, index) => (
              <a
                key={video.id}
                href={video.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 w-40 sm:w-[200px] md:w-60 h-[280px] sm:h-[350px] md:h-[420px] bg-blue-200 rounded-lg overflow-hidden shadow-md block cursor-pointer hover:shadow-xl transition-shadow"
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
            {/* See More Link */}
            <a
              href="/videos"
              className="shrink-0 w-40 sm:w-[200px] md:w-60 h-[280px] sm:h-[350px] md:h-[420px] bg-linear-to-br from-[#EE4339] to-[#d63330] rounded-lg overflow-hidden shadow-md flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition-all hover:scale-105 text-white"
            >
              <svg
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mb-3 md:mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
              <span className="text-xl md:text-2xl font-bold">Lihat Semua</span>
              <span className="text-sm md:text-base mt-2">Video Lainnya</span>
            </a>
          </div>
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          disabled={currentIndex >= videos.length - 5}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#EE4339] text-white rounded-r-full h-full w-10 flex items-center justify-center shadow-lg transition-all hover:bg-[#d63330] cursor-pointer ${
            currentIndex >= videos.length - 5
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          aria-label="Next videos"
        >
          <svg
            className="w-6 h-6 md:w-8 md:h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Video;
