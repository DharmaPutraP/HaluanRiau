import { useState, useEffect, useRef } from "react";
import Headline from "../components/Layout/Headline";
import PilihanEditor from "../components/Layout/PilihanEditor";
import BeritaTerkini from "../components/Layout/BeritaTerkini";
import Terpopuler from "../components/Layout/Terpopuler";
import Gagasan from "../components/Layout/Gagasan";
import Riau from "../components/Layout/Riau";
import MixLayout from "../components/Layout/MixLayout";
import Video from "../components/Layout/Video";
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

      setLoading(true);
      try {
        // Load data sequentially with small delays to prevent overwhelming the server
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        // Load critical content first
        const headlinesData = await fetchHeadlines();
        setHeadlines(headlinesData);
        await delay(100);

        const pilihanEditorData = await fetchPilihanEditor();
        setPilihanEditor(pilihanEditorData);
        await delay(100);

        const beritaTerkiniData = await fetchBeritaTerkini();
        setBeritaTerkini(beritaTerkiniData);
        await delay(100);

        const terpopulerData = await fetchTerpopuler();
        setTerpopuler(terpopulerData);

        // Load remaining sections in background (non-blocking)
        setLoading(false);

        // Continue loading other sections
        await delay(200);
        const gagasanData = await fetchGagasan();
        setGagasan(gagasanData);

        await delay(200);
        const riauData = await fetchRiau();
        setRiau(riauData);

        await delay(200);
        const nasionalData = await fetchNasional();
        setNasional(nasionalData);

        await delay(200);
        const tipsKesehatanData = await fetchTipsKesehatan();
        setTipsKesehatan(tipsKesehatanData);

        await delay(200);
        const advertorialData = await fetchAdvertorial();
        setAdvertorial(advertorialData);

        await delay(200);
        const galeriData = await fetchGaleri();
        setGaleri(galeriData);

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
      <div className="md:mx-24">
        <div className="bg-white px-5 md:px-10 py-16 mt-2 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EE4339] mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat berita...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:mx-24">
      <Headline data={headlines} />
      <PilihanEditor data={pilihanEditor} />
      <Video />

      {/* Desktop: 3-column layout with sticky sidebar */}
      <div className="hidden md:grid grid-cols-3 gap-1">
        <div className="col-span-2">
          <BeritaTerkini data={beritaTerkini} />
        </div>
        <div className="sticky top-24 self-start h-fit">
          <Terpopuler data={terpopuler} />
          <Gagasan data={gagasan} />
        </div>
      </div>

      {/* Mobile: Stack all sections */}
      <div className="md:hidden flex flex-col gap-2">
        <BeritaTerkini data={beritaTerkini} />
        <Terpopuler data={terpopuler} />
        <Gagasan data={gagasan} />
      </div>

      <Riau data={riau} />
      <div className="flex flex-col md:grid md:grid-cols-4 gap-2">
        <MixLayout title="NASIONAL" data={nasional} />
        <MixLayout title="TIPS & KESEHATAN" data={tipsKesehatan} />
        <MixLayout title="ADVETORIAL" data={advertorial} />
        <MixLayout title="GALERI" data={galeri} />
      </div>
    </div>
  );
}

export default HomePage;
