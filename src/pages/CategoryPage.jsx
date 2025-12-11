import { useParams, useNavigate } from "react-router-dom";
import { HEADLINES, PILIHANEDITOR } from "../utils/constants";
import Tag from "../components/Tag";

function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();

  // Define section configurations
  const sectionConfig = {
    headline: { title: "HEADLINE", data: HEADLINES },
    "pilihan-editor": { title: "PILIHAN EDITOR", data: PILIHANEDITOR },
    "berita-terkini": { title: "BERITA TERKINI", data: HEADLINES },
    terpopuler: { title: "TERPOPULER", data: PILIHANEDITOR },
    gagasan: { title: "GAGASAN", data: PILIHANEDITOR },
    riau: { title: "RIAU", data: PILIHANEDITOR },
    nasional: { title: "NASIONAL", data: HEADLINES },
    "tips-kesehatan": { title: "TIPS & KESEHATAN", data: HEADLINES },
    advertorial: { title: "ADVERTORIAL", data: HEADLINES },
    galeri: { title: "GALERI", data: HEADLINES },
  };

  // Check if it's a section page or category page
  const isSection = sectionConfig[category];

  let articles = [];
  let pageTitle = "";

  if (isSection) {
    // Section page
    articles = sectionConfig[category].data;
    pageTitle = sectionConfig[category].title;
  } else {
    // Category page (by tag)
    const categoryArticles = HEADLINES.filter(
      (article) => article.tag.toLowerCase() === category.toLowerCase()
    );
    articles = categoryArticles.length > 0 ? categoryArticles : HEADLINES;
    pageTitle = category ? category.toUpperCase() : "SEMUA ARTIKEL";
  }

  return (
    <div className="md:mx-24">
      <div className="bg-white px-5 md:px-10 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <button
            onClick={() => navigate("/")}
            className="hover:text-[#EE4339] transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-gray-700">{pageTitle}</span>
        </div>

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold border-b-4 border-[#EE4339] inline-block pb-2">
            {pageTitle}
          </h1>
          <p className="text-gray-600 mt-3">
            Menampilkan {articles.length} artikel
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 gap-6">
          {articles.map((article, index) => (
            <div
              key={index}
              onClick={() => navigate(`/article/${index + 1}`)}
              className="flex flex-col md:flex-row gap-4 pb-6 border-b border-gray-300 cursor-pointer hover:bg-gray-50 transition p-4 rounded"
            >
              {/* Content */}
              <div className="flex-1">
                <Tag judul={article.tag} className="text-xs mb-2" />
                <h2 className="text-xl font-bold mb-2 hover:text-[#EE4339] transition">
                  {article.judul}
                </h2>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                  {article.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{article.tanggal}</span>
                  <span>|</span>
                  <span>{article.lastUpdated}</span>
                </div>
              </div>
              {/* Image */}
              <div className="w-full md:w-1/3 shrink-0">
                <img
                  src={`/public/image.png`}
                  alt={article.judul}
                  className="w-full h-48 object-cover rounded"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-8">
          <button className="px-4 py-2 bg-[#EE4339] text-white rounded hover:bg-[#d63330]">
            1
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            2
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            3
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
