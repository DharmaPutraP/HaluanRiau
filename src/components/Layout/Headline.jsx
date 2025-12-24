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
        console.log(banners[0]);
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
        <div className="md:hidden flex flex-col gap-5">
          <GambarHeadline data={middleHeadlines} />

          {banner && banner.image && (
            <div className="w-full">
              <img
                src={banner.image}
                alt={banner.judul}
                className="w-full h-auto object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setIsModalOpen(true)}
              />
            </div>
          )}

          {/* Headlines in single column */}
          <div className="flex flex-col gap-3">
            {[...leftHeadlines, ...rightHeadlines].map((item, index) => (
              <a
                key={index}
                href={`/article/${item.id}/${item.url}`}
                className={`flex flex-col hover:opacity-80 transition-opacity ${
                  index < leftHeadlines.length + rightHeadlines.length - 1
                    ? "pb-3 border-b border-gray-200"
                    : ""
                }`}
              >
                <span className="inline-block px-2 py-0.5 bg-[#EE4339] text-white text-[10px] font-semibold uppercase w-fit mb-1.5">
                  {item.tag}
                </span>
                <p className="text-base font-bold mb-2 line-clamp-2 leading-snug">
                  {item.judul}
                </p>
                <div className="flex items-center text-[10px] gap-1.5 text-gray-500">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="truncate">{item.lastUpdated}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <BannerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={banner?.image}
        imageAlt={banner?.judul}
        keterangan={banner?.keterangan}
      />
    </>
  );
}

export default Headline;
