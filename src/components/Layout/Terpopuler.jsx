import { useState, useEffect } from "react";
import Tag from "../Tag";
import BannerModal from "../BannerModal";
import { fetchBannersByPosition } from "../../services/api";

function Terpopuler({ data = [] }) {
  const [banner, setBanner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadBanner = async () => {
      const banners = await fetchBannersByPosition("di terpopuler");
      if (banners && banners.length > 0) {
        setBanner(banners[0]);
      }
    };
    loadBanner();
  }, []);

  const topFive = banner ? data.slice(0, 4) : data.slice(0, 5);
  // Split: first 2 and remaining (2 if banner, 3 if no banner)
  const firstTwo = topFive.slice(0, 2);
  const remaining = topFive.slice(2);

  return (
    <>
      <div className="bg-white mt-2 px-5 pt-2 pb-5 h-fit">
        <div className="flex gap-2 border-b-3 w-fit border-primary mb-3 items-center">
          <div className="font-bold">TERPOPULER</div>
          <a
            href="/category/terpopuler"
            className="cursor-pointer hover:opacity-70 transition-opacity"
          >
            <svg
              width="800px"
              height="800px"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              fill="#000000"
              className="w-5 h-5"
            >
              <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
            </svg>
          </a>
        </div>

        {/* First 2 items */}
        {firstTwo.map((item, index) => (
          <a
            key={index}
            href={`/article/${item.id}/${item.url || item.id}`}
            className={`block ${
              index === 0 ? "" : "pt-2"
            } border-b-2 pb-1 border-gray-200 hover:opacity-80 transition-opacity cursor-pointer`}
          >
            <Tag judul={item.tag} className="text-xs mb-2" />
            <p className="text-md mt-1 leading-4 font-bold">{item.judul}</p>
            <div className="flex justify-between text-[0.7rem] mt-2">
              <p className="text-gray-500">{item.tanggal}</p>
              <p className="text-gray-500">Dibaca {item.timesRead} kali</p>
            </div>
            <p className="text-xs mt-2 mb-2">{item.description}</p>
          </a>
        ))}

        {/* Banner in the middle (only if banner exists) */}
        {banner && banner.image && (
          <div className="my-4 w-full aspect-video overflow-hidden rounded">
            <img
              src={banner.image}
              alt={banner.judul}
              className="w-full h-auto object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        )}

        {/* Remaining items (2 if banner, 3 if no banner) */}
        {remaining.map((item, index) => (
          <a
            key={index + 2}
            href={`/article/${item.id}/${item.url || item.id}`}
            className="block pt-2 border-b-2 pb-1 border-gray-200 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <Tag judul={item.tag} className="text-xs mb-2" />
            <p className="text-md mt-1 leading-4 font-bold">{item.judul}</p>
            <div className="flex justify-between text-[0.7rem] mt-2">
              <p className="text-gray-500">{item.tanggal}</p>
              <p className="text-gray-500">Dibaca {item.timesRead} kali</p>
            </div>
            <p className="text-xs mt-2 mb-2">{item.description}</p>
          </a>
        ))}
      </div>

      {/* Modal for enlarged banner */}
      {isModalOpen && banner?.image && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-opacity-75 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-w-6xl max-h-screen">
            <button
              className="absolute -top-10 right-0 text-white text-3xl font-bold hover:text-gray-300"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            <img
              src={banner.image}
              alt={banner.judul}
              className="max-w-full max-h-screen object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

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

export default Terpopuler;
