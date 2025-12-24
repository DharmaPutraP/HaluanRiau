import { useState, useEffect, useRef } from "react";
import Headline from "../components/Layout/Headline";
import PilihanEditor from "../components/Layout/PilihanEditor";
import BeritaTerkini from "../components/Layout/BeritaTerkini";
import Terpopuler from "../components/Layout/Terpopuler";
import Gagasan from "../components/Layout/Gagasan";
import Riau from "../components/Layout/Riau";
import MixLayout from "../components/Layout/MixLayout";
import Video from "../components/Layout/Video";
import BannerModal from "../components/BannerModal";
import {
  HeadlineSkeleton,
  SectionSkeleton,
  CardSkeleton,
  MixLayoutSkeleton,
} from "../components/LoadingSkeleton";
import {
  fetchHeadlines,
  fetchPilihanEditor,
  fetchBeritaTerkini,
  fetchTerpopuler,
  fetchGagasan,
  fetchRiau,
  fetchNasional,
  fetchTipsKesehatan,
  fetchAdvertorial,
  fetchGaleri,
  fetchBannersByPosition,
} from "../services/api";

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

function HomePage() {
  const [headlines, setHeadlines] = useState([]);
  const [pilihanEditor, setPilihanEditor] = useState([]);
  const [beritaTerkini, setBeritaTerkini] = useState([]);
  const [terpopuler, setTerpopuler] = useState([]);
  const [gagasan, setGagasan] = useState([]);
  const [riau, setRiau] = useState([]);
  const [nasional, setNasional] = useState([]);
  const [tipsKesehatan, setTipsKesehatan] = useState([]);
  const [advertorial, setAdvertorial] = useState([]);
  const [galeri, setGaleri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const lastFetchTime = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      // Check if we have cached data that's still fresh
      const now = Date.now();
      if (
        lastFetchTime.current &&
        now - lastFetchTime.current < CACHE_DURATION
      ) {
        setLoading(false);
        return;
      }

      try {
        // Load data sequentially with delays to prevent server crash
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        // Critical content first
        try {
          const headlinesData = await fetchHeadlines();
          setHeadlines(headlinesData.articles || headlinesData);
          await delay(300);
        } catch (err) {
          console.error("Error fetching headlines:", err);
        }

        try {
          const pilihanEditorData = await fetchPilihanEditor();
          setPilihanEditor(pilihanEditorData.articles || pilihanEditorData);
          await delay(300);
        } catch (err) {
          console.error("Error fetching pilihan editor:", err);
        }

        try {
          const beritaTerkiniData = await fetchBeritaTerkini();
          setBeritaTerkini(beritaTerkiniData.articles || beritaTerkiniData);
          await delay(300);
        } catch (err) {
          console.error("Error fetching berita terkini:", err);
        }

        // Hide main loading spinner after critical content
        setLoading(false);

        // Continue loading remaining sections with delays
        try {
          const terpopulerData = await fetchTerpopuler();
          setTerpopuler(terpopulerData.articles || terpopulerData);
          await delay(300);
        } catch (err) {
          console.error("Error fetching terpopuler:", err);
        }

        try {
          const gagasanData = await fetchGagasan();
          setGagasan(gagasanData.articles || gagasanData);
          await delay(300);
        } catch (err) {
          console.error("Error fetching gagasan:", err);
        }

        try {
          const riauData = await fetchRiau();
          setRiau(riauData.articles || riauData);
          await delay(300);
        } catch (err) {
          console.error("Error fetching riau:", err);
        }

        try {
          const nasionalData = await fetchNasional();
          setNasional(nasionalData.articles || nasionalData);
          await delay(300);
        } catch (err) {
          console.error("Error fetching nasional:", err);
        }

        try {
          const tipsKesehatanData = await fetchTipsKesehatan();
          setTipsKesehatan(tipsKesehatanData.articles || tipsKesehatanData);
          await delay(300);
        } catch (err) {
          console.error("Error fetching tips kesehatan:", err);
        }

        try {
          const advertorialData = await fetchAdvertorial();
          setAdvertorial(advertorialData.articles || advertorialData);
          await delay(300);
        } catch (err) {
          console.error("Error fetching advertorial:", err);
        }

        try {
          const galeriData = await fetchGaleri();
          setGaleri(galeriData.articles || galeriData);
        } catch (err) {
          console.error("Error fetching galeri:", err);
        }

        try {
          const bannerData = await fetchBannersByPosition("diatas riau");
          if (bannerData && bannerData.length > 0) {
            setBanner(bannerData[0]);
          }
        } catch (err) {
          console.error("Error fetching banner:", err);
        }

        // Update last fetch time
        lastFetchTime.current = Date.now();
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="w-full px-2 sm:px-4">
        <div className="bg-white px-3 sm:px-5 md:px-10 py-12 sm:py-16 mt-2 text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm sm:text-base text-gray-600">
            Memuat berita...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-4">
      {headlines.length > 0 ? (
        <Headline data={headlines} />
      ) : (
        <HeadlineSkeleton />
      )}
      {pilihanEditor.length > 0 ? (
        <PilihanEditor data={pilihanEditor} />
      ) : (
        <SectionSkeleton />
      )}
      <Video />

      {/* Desktop: 3-column layout with sticky sidebar */}
      <div className="hidden md:grid grid-cols-3 gap-1">
        <div className="col-span-2">
          {beritaTerkini.length > 0 ? (
            <BeritaTerkini data={beritaTerkini} />
          ) : (
            <SectionSkeleton />
          )}
        </div>
        <div className="sticky top-24 self-start h-fit">
          {terpopuler.length > 0 ? (
            <Terpopuler data={terpopuler} />
          ) : (
            <CardSkeleton />
          )}
          {gagasan.length > 0 ? <Gagasan data={gagasan} /> : <CardSkeleton />}
        </div>
      </div>

      {/* Mobile: Stack all sections */}
      <div className="md:hidden flex flex-col gap-2">
        {beritaTerkini.length > 0 ? (
          <BeritaTerkini data={beritaTerkini} />
        ) : (
          <SectionSkeleton />
        )}
        {terpopuler.length > 0 ? (
          <Terpopuler data={terpopuler} />
        ) : (
          <CardSkeleton />
        )}
        {gagasan.length > 0 ? <Gagasan data={gagasan} /> : <CardSkeleton />}
      </div>

      {/* Banner before Riau section */}
      {banner && (
        <div className="px-2 sm:px-5 md:px-10 py-3 sm:py-4 mt-2">
          <img
            src={banner.image}
            alt={banner.judul}
            className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      )}

      {riau.length > 0 ? <Riau data={riau} /> : <SectionSkeleton />}
      <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-2">
        {nasional.length > 0 ? (
          <MixLayout title="NASIONAL" data={nasional} />
        ) : (
          <MixLayoutSkeleton />
        )}
        {tipsKesehatan.length > 0 ? (
          <MixLayout title="TIPS & KESEHATAN" data={tipsKesehatan} />
        ) : (
          <MixLayoutSkeleton />
        )}
        {advertorial.length > 0 ? (
          <MixLayout title="ADVERTORIAL" data={advertorial} />
        ) : (
          <MixLayoutSkeleton />
        )}
        {galeri.length > 0 ? (
          <MixLayout title="GALERI" data={galeri} />
        ) : (
          <MixLayoutSkeleton />
        )}
      </div>

      <BannerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={banner?.image}
        imageAlt={banner?.judul}
        keterangan={banner?.keterangan}
      />
    </div>
  );
}

export default HomePage;
