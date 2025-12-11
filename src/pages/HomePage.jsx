import { useState, useEffect } from "react";
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

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [
          headlinesData,
          pilihanEditorData,
          beritaTerkiniData,
          terpopulerData,
          gagasanData,
          riauData,
          nasionalData,
          tipsKesehatanData,
          advertorialData,
          galeriData,
        ] = await Promise.all([
          fetchHeadlines(),
          fetchPilihanEditor(),
          fetchBeritaTerkini(),
          fetchTerpopuler(),
          fetchGagasan(),
          fetchRiau(),
          fetchNasional(),
          fetchTipsKesehatan(),
          fetchAdvertorial(),
          fetchGaleri(),
        ]);

        setHeadlines(headlinesData);
        setPilihanEditor(pilihanEditorData);
        setBeritaTerkini(beritaTerkiniData);
        setTerpopuler(terpopulerData);
        setGagasan(gagasanData);
        setRiau(riauData);
        setNasional(nasionalData);
        setTipsKesehatan(tipsKesehatanData);
        setAdvertorial(advertorialData);
        setGaleri(galeriData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
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
