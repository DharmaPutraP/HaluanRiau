import { useState, useEffect } from "react";
import LeftHeadline from "../Headline/LeftHeadline";
import GambarHeadline from "../Headline/GambarHeadline";
import BannerModal from "../BannerModal";
import { fetchBannersByPosition } from "../../services/api";

function Headline({ data = [] }) {
  const [banner, setBanner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadBanner = async () => {
      const banners = await fetchBannersByPosition("di headline");
      if (banners && banners.length > 0) {
        setBanner(banners[0]); // Get first banner for this position
      }
    };
    loadBanner();
  }, []);

  // Get first 7 headlines
  const headlines = data.slice(0, 9);

  // Top 3 for middle (GambarHeadline)
  const middleHeadlines = headlines.slice(0, 3);
  
  // Items 4-5 for left
  const leftHeadlines = headlines.slice(3, 6);

  // Items 6-7 for right
  const rightHeadlines = headlines.slice(6, 9);

  return (
    <>
      <div className="bg-white px-5 pt-4 pb-5">
        {/* Desktop: 3 columns layout */}
        <div className="hidden md:flex flex-row justify-between gap-5">
          <LeftHeadline data={leftHeadlines} />
          <GambarHeadline data={middleHeadlines} />
          {/* Replace right column with banner */}
          {banner ? (
            <div className="w-1/3 flex items-center justify-center">
              {banner.image ? (
                <img
                  src={banner.image}
                  alt={banner.judul}
                  className="w-auto h-full object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setIsModalOpen(true)}
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded">
                  <span className="text-gray-400 text-sm">{banner.judul}</span>
                </div>
              )}
            </div>
          ) : (
            <LeftHeadline data={rightHeadlines} />
          )}
        </div>

        {/* Mobile: Image on top, headlines below, with banner if available */}
        <div className="md:hidden flex flex-col gap-4">
          <GambarHeadline data={middleHeadlines} />

          {banner && banner.image ? (
            <>
              {/* Banner section */}
              <div className="w-full">
                <img
                  src={banner.image}
                  alt={banner.judul}
                  className="w-full h-auto object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setIsModalOpen(true)}
                />
              </div>

              {/* Headlines in single column when banner exists */}
              <div className="flex flex-col gap-3">
                <LeftHeadline data={leftHeadlines} />
                <LeftHeadline data={rightHeadlines} />
              </div>
            </>
          ) : (
            /* 2 columns layout when no banner */
            <div className="grid grid-cols-1 gap-3">
              <LeftHeadline data={leftHeadlines} />
              <LeftHeadline data={rightHeadlines} />
            </div>
          )}
        </div>
      </div>

      <BannerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={banner?.image}
        imageAlt={banner?.judul}
      />
    </>
  );
}

export default Headline;
