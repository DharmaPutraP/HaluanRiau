import { useState, useEffect } from "react";
import {
  fetchBannersByPosition,
  fetchRiau,
  fetchNasional,
  fetchTipsKesehatan,
  fetchAdvertorial,
  fetchGaleri,
} from "../services/api";
import BannerModal from "./BannerModal";
import Riau from "./Layout/Riau";
import MixLayout from "./Layout/MixLayout";

function ContentBottomSections() {
  const [banner, setBanner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [riau, setRiau] = useState([]);
  const [nasional, setNasional] = useState([]);
  const [tipsKesehatan, setTipsKesehatan] = useState([]);
  const [advertorial, setAdvertorial] = useState([]);
  const [galeri, setGaleri] = useState([]);

  useEffect(() => {
    const loadBanner = async () => {
      try {
        const bannerData = await fetchBannersByPosition("di content");
        if (bannerData && bannerData.length > 0) {
          setBanner(bannerData[0]);
        }
      } catch (err) {
        console.error("Error fetching banner:", err);
      }
    };
    loadBanner();
  }, []);

  useEffect(() => {
    const loadSections = async () => {
      try {
        const [
          riauData,
          nasionalData,
          tipsKesehatanData,
          advertorialData,
          galeriData,
        ] = await Promise.all([
          fetchRiau(),
          fetchNasional(),
          fetchTipsKesehatan(),
          fetchAdvertorial(),
          fetchGaleri(),
        ]);
        setRiau(riauData.articles || riauData);
        setNasional(nasionalData.articles || nasionalData);
        setTipsKesehatan(tipsKesehatanData.articles || tipsKesehatanData);
        setAdvertorial(advertorialData.articles || advertorialData);
        setGaleri(galeriData.articles || galeriData);
      } catch (err) {
        console.error("Error fetching sections:", err);
      }
    };
    loadSections();
  }, []);

  return (
    <>
      {/* Banner Section */}
      {banner && (
        <div className="bg-white px-5 md:px-10 py-6 mt-2">
          <div className="flex justify-center pt-6 border-t border-gray-300">
            <img
              src={banner.image}
              alt={banner.judul}
              className="w-auto h-60 cursor-pointer hover:opacity-90 transition-opacity rounded"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </div>
      )}

      {/* Riau Section */}
      {riau.length > 0 && <Riau data={riau} />}

      {/* MixLayout Sections */}
      <div className="flex flex-col md:grid md:grid-cols-4 gap-2">
        {nasional.length > 0 && <MixLayout title="NASIONAL" data={nasional} />}
        {tipsKesehatan.length > 0 && (
          <MixLayout title="TIPS & KESEHATAN" data={tipsKesehatan} />
        )}
        {advertorial.length > 0 && (
          <MixLayout title="ADVERTORIAL" data={advertorial} />
        )}
        {galeri.length > 0 && <MixLayout title="GALERI" data={galeri} />}
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

export default ContentBottomSections;
