import Headline from "../components/Layout/Headline";
import PilihanEditor from "../components/Layout/PilihanEditor";
import BeritaTerkini from "../components/Layout/BeritaTerkini";
import Terpopuler from "../components/Layout/Terpopuler";
import Gagasan from "../components/Layout/Gagasan";
import Riau from "../components/Layout/Riau";
import MixLayout from "../components/Layout/MixLayout";
import Video from "../components/Layout/Video";

function HomePage() {
  return (
    <div className="md:mx-24">
      <Headline />
      <PilihanEditor />
      <Video />

      {/* Desktop: 3-column layout with sticky sidebar */}
      <div className="hidden md:grid grid-cols-3 gap-1">
        <div className="col-span-2">
          <BeritaTerkini />
        </div>
        <div className="sticky top-24 self-start h-fit">
          <Terpopuler />
          <Gagasan />
        </div>
      </div>

      {/* Mobile: Stack all sections */}
      <div className="md:hidden flex flex-col gap-2">
        <BeritaTerkini />
        <Terpopuler />
        <Gagasan />
      </div>

      <Riau />
      <div className="flex flex-col md:grid md:grid-cols-4 gap-2">
        <MixLayout title="NASIONAL" />
        <MixLayout title="TIPS & KESEHATAN" />
        <MixLayout title="ADVETORIAL" />
        <MixLayout title="GALERI" />
      </div>
    </div>
  );
}

export default HomePage;
