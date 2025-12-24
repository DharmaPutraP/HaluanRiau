import { useState, useEffect } from "react";
import Tag from "../Tag";
import Button from "../Button";
import BannerModal from "../BannerModal";
import { fetchBannersByPosition } from "../../services/api";

function BeritaTerkini({ data = [] }) {
  const headlines = data.slice(0, 10);
  return (
    <div className="bg-white mt-2 px-5 pt-2 pb-5">
      <div className="flex gap-2 border-b-3 w-fit border-primary mb-3 items-center">
        <div className="font-bold">BERITA TERKINI</div>
        <a
          href="/category/indeks-berita"
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
      <BeritaTerkiniComponent data={headlines} />
    </div>
  );
}

export default BeritaTerkini;

function BeritaTerkiniComponent({ data = [] }) {
  const [banner, setBanner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadBanner = async () => {
      const banners = await fetchBannersByPosition("di berita terkini");
      if (banners && banners.length > 0) {
        setBanner(banners[0]);
      }
    };
    loadBanner();
  }, []);

  // Split data: first 5 and remaining
  const firstHalf = data.slice(0, 5);
  const secondHalf = data.slice(5);

  return (
    <>
      <div className="">
        {/* First 5 items */}
        {firstHalf.map((item, index) => (
          <a
            key={index}
            href={`/article/${item.id}/${item.url}`}
            className="pb-4 flex flex-col md:flex-row justify-around gap-3 md:gap-5 mb-3 border-b-2 border-gray-300 hover:opacity-80 transition-opacity cursor-pointer"
          >
            {/* Image first on mobile, right side on desktop */}
            <div className="w-full md:w-3/12 md:order-2">
              <img
                src={item.foto_kecil}
                alt={item.judul}
                className="w-full h-32 md:h-30 object-cover rounded"
              />
            </div>

            {/* Content */}
            <div className="w-full md:w-9/12 md:order-1">
              <Tag judul={item.tag} className="text-xs" />
              <p className="text-md mt-1 leading-4 font-bold md:border-b-2 pb-2 md:pb-3 mb-2 md:mb-3 md:border-gray-500">
                {item.judul}
              </p>
              <p className="text-xs mt-2 mb-2">{item.description}</p>
              <div className="flex items-center text-[0.7rem] gap-2 mt-1">
                <p className="text-gray-500">{item.tanggal}</p>
                <div>|</div>
                <p>{item.lastUpdated}</p>
              </div>
            </div>
          </a>
        ))}

        {/* Banner in the middle */}
        {banner && banner.image && (
          <div className="my-6 flex justify-center">
            <img
              src={banner.image}
              alt={banner.judul}
              className="w-full max-w-3xl h-auto object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        )}

        {/* Remaining items */}
        {secondHalf.map((item, index) => (
          <a
            key={index + 5}
            href={`/article/${item.id}/${item.url}`}
            className="pb-4 flex flex-col md:flex-row justify-around gap-3 md:gap-5 mb-3 border-b-2 border-gray-300 hover:opacity-80 transition-opacity cursor-pointer"
          >
            {/* Image first on mobile, right side on desktop */}
            <div className="w-full md:w-3/12 md:order-2">
              <img
                src={item.image}
                alt={item.judul}
                className="w-full h-32 md:h-30 object-cover rounded"
              />
            </div>

            {/* Content */}
            <div className="w-full md:w-9/12 md:order-1">
              <Tag judul={item.tag} className="text-xs" />
              <p className="text-md mt-1 leading-4 font-bold md:border-b-2 pb-2 md:pb-3 mb-2 md:mb-3 md:border-gray-500">
                {item.judul}
              </p>
              <p className="text-xs mt-2 mb-2">{item.description}</p>
              <div className="flex items-center text-[0.7rem] gap-2 mt-1">
                <p className="text-gray-500">{item.tanggal}</p>
                <div>|</div>
                <p>{item.lastUpdated}</p>
              </div>
            </div>
          </a>
        ))}

        <div className="flex justify-center">
          <Button
            text="INDEKS BERITA"
            className="text-sm cursor-pointer"
            onClick={() => (window.location.href = "/category/indeks-berita")}
          />
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
