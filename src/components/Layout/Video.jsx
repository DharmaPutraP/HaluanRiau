import { useState, useRef, useEffect } from "react";
import { parseTikTokUrl } from "../../utils/tiktokParser";
import { fetchBannersByPosition, fetchVideos } from "../../services/api";
import BannerModal from "../BannerModal";

function Video() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const [banners, setBanners] = useState({
    video1: null,
    video2: null,
    video3: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [videoUrls, setVideoUrls] = useState([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);
  const [bannerCount, setBannerCount] = useState(0);
  const [thumbnails, setThumbnails] = useState({});

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const [banner1, banner2, banner3] = await Promise.all([
          fetchBannersByPosition("video 1"),
          fetchBannersByPosition("video 2"),
          fetchBannersByPosition("video 3"),
        ]);

        const loadedBanners = {
          video1: banner1 && banner1.length > 0 ? banner1[0] : null,
          video2: banner2 && banner2.length > 0 ? banner2[0] : null,
          video3: banner3 && banner3.length > 0 ? banner3[0] : null,
        };

        setBanners(loadedBanners);

        // Count how many banners exist
        const count = Object.values(loadedBanners).filter(
          (banner) => banner !== null
        ).length;
        setBannerCount(count);
      } catch (err) {
        console.error("Error fetching video banners:", err);
      }
    };
    loadBanners();
  }, []);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setIsLoadingVideos(true);

        // Calculate video count: 7 total items - banner count
        const videoCount = 7 - bannerCount;

        const { videos } = await fetchVideos(1, videoCount);
        const urls = videos.map((video) => video.url);
        setVideoUrls(urls);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setVideoUrls([]); // Fallback to empty array
      } finally {
        setIsLoadingVideos(false);
      }
    };

    // Only load videos after banners are counted
    if (bannerCount >= 0) {
      loadVideos();
    }
  }, [bannerCount]);

  const videos = videoUrls
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
      for (const video of videos) {
        const thumbnail = await fetchThumbnail(video.tiktokUrl, video.id);
        if (thumbnail) {
          newThumbnails[video.id] = thumbnail;
        }
      }
      setThumbnails(newThumbnails);
    };

    if (videos.length > 0) {
      loadThumbnails();
    }
  }, [videos.length]);

  // Insert banners first, then videos
  const displayItems = [];

  // Add all banners first in order
  if (banners.video1) {
    displayItems.push({
      type: "banner",
      data: banners.video1,
      position: "video 1",
    });
  }

  if (banners.video2) {
    displayItems.push({
      type: "banner",
      data: banners.video2,
      position: "video 2",
    });
  }

  if (banners.video3) {
    displayItems.push({
      type: "banner",
      data: banners.video3,
      position: "video 3",
    });
  }

  // Add all videos after banners
  videos.forEach((video) => {
    displayItems.push({ type: "video", data: video });
  });

  const handleBannerClick = (banner) => {
    setSelectedBanner(banner);
    setIsModalOpen(true);
  };

  // Get number of visible items based on screen width
  const getVisibleItems = () => {
    if (typeof window === "undefined") return 5;
    const width = window.innerWidth;
    if (width < 640) return 1.5; // Mobile: show 1.5 items
    if (width < 768) return 2.5; // Tablet: show 2.5 items
    if (width < 1024) return 3.5; // Small desktop: show 3.5 items
    return 5; // Large desktop: show 5 items
  };

  const scrollToIndex = (index) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const visibleItems = getVisibleItems();
      const itemWidth = container.offsetWidth / visibleItems;
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
    const visibleItems = getVisibleItems();
    if (currentIndex < displayItems.length - Math.floor(visibleItems)) {
      scrollToIndex(currentIndex + 1);
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const visibleItems = getVisibleItems();
      const itemWidth = container.offsetWidth / visibleItems;
      const newIndex = Math.round(container.scrollLeft / itemWidth);
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div className="mt-2 relative scrollbar-hide">
      {/* Video Slider Container */}
      <div className="relative px-0 sm:px-4 md:px-10">
        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-50 bg-primary text-white rounded-r-lg sm:rounded-l-full h-20 sm:h-32 md:h-full w-8 sm:w-6 flex items-center justify-center shadow-lg transition-all hover:bg-primary-dark cursor-pointer ${
            currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-label="Previous videos"
        >
          <svg
            className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8"
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
        <div className="bg-white py-3 sm:py-5">
          {/* Title */}
          <div className="flex gap-1 border-b-3 w-fit border-primary mb-3 justify-center mx-auto items-center">
            <div className="font-bold text-lg sm:text-xl">VIDEO</div>
          </div>

          {isLoadingVideos ? (
            // Loading skeleton
            <div className="flex gap-2 sm:gap-3 md:gap-4 px-2 sm:px-4 md:px-10">
              {[...Array(5)].map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="shrink-0 w-[180px] sm:w-[200px] md:w-60 h-[300px] sm:h-[350px] md:h-[420px] bg-gray-200 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto scroll-smooth scrollbar-hide px-2 sm:px-4 md:px-10"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {displayItems.map((item, index) => {
                if (item.type === "banner") {
                  return (
                    <div
                      key={`banner-${item.position}`}
                      onClick={() => handleBannerClick(item.data)}
                      className="shrink-0 w-[180px] sm:w-[200px] md:w-60 h-[300px] sm:h-[350px] md:h-[420px] rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-xl transition-shadow flex justify-center items-center bg-black"
                    >
                      <img
                        src={item.data.image}
                        alt={item.data.judul}
                        className="w-full h-auto object-cover hover:opacity-90 transition-opacity"
                      />
                    </div>
                  );
                }
                return (
                  <a
                    key={item.data.id}
                    href={item.data.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 w-[180px] sm:w-[200px] md:w-60 h-[300px] sm:h-[350px] md:h-[420px] bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all relative group cursor-pointer hover:scale-105"
                  >
                    {/* Video Thumbnail */}
                    {thumbnails[item.data.id] ? (
                      <img
                        src={thumbnails[item.data.id]}
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
                          @{item.data.username}
                        </span>
                      </div>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-all" />
                  </a>
                );
              })}
              {/* See More Link */}
              <a
                href="/videos"
                className="shrink-0 w-[180px] sm:w-[200px] md:w-60 h-[300px] sm:h-[350px] md:h-[420px] bg-gradient-to-br from-primary to-primary-dark rounded-lg overflow-hidden shadow-md flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition-all hover:scale-105 text-white"
              >
                <svg
                  className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mb-2 sm:mb-3 md:mb-4"
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
                <span className="text-lg sm:text-xl md:text-2xl font-bold">
                  Lihat Semua
                </span>
                <span className="text-xs sm:text-sm md:text-base mt-1 sm:mt-2">
                  Video Lainnya
                </span>
              </a>
            </div>
          )}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          disabled={
            currentIndex >= displayItems.length - Math.floor(getVisibleItems())
          }
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-50 bg-primary text-white rounded-l-lg sm:rounded-r-full h-20 sm:h-32 md:h-full w-8 sm:w-6 flex items-center justify-center shadow-lg transition-all hover:bg-primary-dark cursor-pointer ${
            currentIndex >= displayItems.length - Math.floor(getVisibleItems())
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          aria-label="Next videos"
        >
          <svg
            className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8"
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

      <BannerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={selectedBanner?.image}
        imageAlt={selectedBanner?.judul}
        keterangan={selectedBanner?.keterangan}
      />
    </div>
  );
}

export default Video;
