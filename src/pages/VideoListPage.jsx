import { useState, useEffect } from "react";
import { parseTikTokUrl } from "../utils/tiktokParser";
import { fetchVideos } from "../services/api";

function VideoListPage() {
  const [visibleCount, setVisibleCount] = useState(12);
  const [videoUrls, setVideoUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [totalVideos, setTotalVideos] = useState(0);
  const [thumbnails, setThumbnails] = useState({});

  // Fetch initial videos
  useEffect(() => {
    const loadInitialVideos = async () => {
      try {
        setIsLoading(true);
        const { videos, pagination } = await fetchVideos(1, 12);
        const urls = videos.map((video) => video.url);
        setVideoUrls(urls);
        setTotalVideos(pagination?.totalItems || videos.length);
        setHasMorePages(
          pagination ? pagination.currentPage < pagination.totalPages : false
        );
      } catch (err) {
        console.error("Error fetching videos:", err);
        setVideoUrls([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialVideos();
  }, []);

  // Parse all TikTok URLs
  const allVideos = videoUrls
    .map((input, index) => {
      const parsed = parseTikTokUrl(input);
      return parsed ? { id: index + 1, ...parsed } : null;
    })
    .filter(Boolean);

  // Fetch thumbnail for a TikTok video
  const fetchThumbnail = async (tiktokUrl, videoId) => {
    try {
      const response = await fetch(
        `https://www.tiktok.com/oembed?url=${encodeURIComponent(tiktokUrl)}`
      );
      if (!response.ok) return null;
      const data = await response.json();
      return data.thumbnail_url || null;
    } catch (error) {
      console.error(`Failed to fetch thumbnail for video ${videoId}:`, error);
      return null;
    }
  };

  // Load thumbnails when videos change
  useEffect(() => {
    const loadThumbnails = async () => {
      const newThumbnails = {};
      for (const video of allVideos) {
        if (!thumbnails[video.id]) {
          const thumbnail = await fetchThumbnail(video.tiktokUrl, video.id);
          if (thumbnail) {
            newThumbnails[video.id] = thumbnail;
          }
        }
      }
      if (Object.keys(newThumbnails).length > 0) {
        setThumbnails((prev) => ({ ...prev, ...newThumbnails }));
      }
    };

    if (allVideos.length > 0) {
      loadThumbnails();
    }
  }, [allVideos.length]);

  // Get visible videos based on current count
  const visibleVideos = allVideos.slice(0, visibleCount);

  const handleLoadMore = async () => {
    if (visibleCount < allVideos.length) {
      // Show more from already loaded videos
      setVisibleCount((prev) => Math.min(prev + 12, allVideos.length));
    } else if (hasMorePages) {
      // Fetch next page from server
      try {
        setIsLoading(true);
        const nextPage = currentPage + 1;
        const { videos, pagination } = await fetchVideos(nextPage, 12);
        const newUrls = videos.map((video) => video.url);
        setVideoUrls((prev) => [...prev, ...newUrls]);
        setVisibleCount((prev) => prev + newUrls.length);
        setCurrentPage(nextPage);
        setHasMorePages(
          pagination ? pagination.currentPage < pagination.totalPages : false
        );
      } catch (err) {
        console.error("Error loading more videos:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const hasMore = visibleCount < allVideos.length || hasMorePages;

  return (
    <div className="w-full px-2 sm:px-4">
      <div className="bg-white px-3 sm:px-4 md:px-10 py-3 sm:py-4 md:py-6 mt-2">
        {/* Page Title */}
        <div className="mb-3 sm:mb-4 md:mb-6 flex gap-2 md:gap-3 border-b-4 border-[#EE4339]">
          <h1 className="text-base sm:text-lg md:text-2xl font-bold pb-2">
            INDEX VIDEO
          </h1>
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            stroke-width="2"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </div>

        {/* Loading State */}
        {isLoading && videoUrls.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {[...Array(12)].map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="h-[320px] lg:h-[420px] bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Videos Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {visibleVideos.map((video) => (
                <a
                  key={video.id}
                  href={video.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 h-[320px] lg:h-[420px] bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all relative group cursor-pointer hover:scale-105"
                >
                  {/* Video Thumbnail */}
                  {thumbnails[video.id] ? (
                    <img
                      src={thumbnails[video.id]}
                      alt="TikTok video thumbnail"
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-pink-500/20 to-yellow-500/20" />
                  )}

                  {/* Play Icon */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="bg-white/90 group-hover:bg-white rounded-full p-2 transition-all group-hover:scale-110">
                      <svg
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* TikTok Logo at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                      </svg>
                      <span className="text-white text-xs sm:text-sm font-medium">
                        @{video.username}
                      </span>
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-all" />
                </a>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-4 sm:mt-6 md:mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="px-4 sm:px-5 md:px-6 py-2 md:py-3 text-xs sm:text-sm md:text-base bg-primary text-white rounded-lg hover:bg-[#d63330] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Memuat..." : "Muat Lebih Banyak Video"}
                </button>
              </div>
            )}

            {/* Show message when all videos loaded */}
            {!hasMore && allVideos.length > 12 && (
              <div className="flex justify-center mt-6 md:mt-8 text-sm md:text-base text-gray-600">
                <p>Semua video telah dimuat ({totalVideos} video)</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default VideoListPage;
