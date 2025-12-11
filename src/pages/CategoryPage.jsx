import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Tag from "../components/Tag";
import { fetchByCategory } from "../services/api";

function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define section configurations
  const sectionConfig = {
    headline: { title: "HEADLINE" },
    "pilihan-editor": { title: "PILIHAN EDITOR" },
    "indeks-berita": { title: "INDEKS BERITA" },
    terpopuler: { title: "TERPOPULER" },
    gagasan: { title: "GAGASAN" },
    riau: { title: "RIAU" },
    nasional: { title: "NASIONAL" },
    "tips-kesehatan": { title: "TIPS & KESEHATAN" },
    advertorial: { title: "ADVERTORIAL" },
    galeri: { title: "GALERI" },
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchByCategory(category);
        setArticles(data);
      } catch (error) {
        console.error("Error loading category data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [category]);

  // Check if it's a section page or category page
  const isSection = sectionConfig[category];
  const pageTitle = isSection
    ? sectionConfig[category].title
    : category
    ? category.toUpperCase()
    : "SEMUA ARTIKEL";

  // Filter articles by date if selected
  const filteredArticles = selectedDate
    ? articles.filter((article) => article.tanggal.includes(selectedDate))
    : articles;

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
      <div className="bg-white px-5 md:px-10 py-6">
        {/* Header with Title and Date Filter */}
        <div className="mb-6 pb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b-4 border-[#EE4339]">
          {/* Title */}
          <div className="flex items-center gap-2 md:gap-3 pb-2 w-fit">
            <h1 className="text-lg md:text-2xl font-bold">{pageTitle}</h1>
            <svg
              className="w-6 h-6 md:w-8 md:h-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>

          {/* Date Filter Section */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3 w-full md:w-auto">
            {/* Search Button */}
            <button className="px-4 md:px-6 py-2 bg-[#EE4339] text-white rounded hover:bg-[#d63330] transition font-semibold text-sm order-2 sm:order-1">
              CARI
            </button>

            {/* Date Inputs */}
            <div className="flex items-center gap-2 border border-gray-300 rounded px-2 md:px-3 py-2 order-1 sm:order-2">
              <input
                type="date"
                className="outline-none text-xs md:text-sm w-full"
                placeholder="Tanggal Mulai"
              />
              <span className="text-gray-400">/</span>
              <input
                type="date"
                className="outline-none text-xs md:text-sm w-full"
                placeholder="Tanggal Akhir"
              />
            </div>
          </div>
        </div>

        {/* Articles List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredArticles.map((article, index) => (
            <div
              key={index}
              onClick={() => navigate(`/article/${article.id}`)}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 p-3 md:p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition rounded"
            >
              {/* Left: Content */}
              <div className="md:col-span-9 flex flex-col justify-between order-2 md:order-1">
                {/* Tag */}
                <div className="mb-2">
                  <Tag judul={article.tag} className="text-xs" />
                </div>

                {/* Title */}
                <h2 className="text-base md:text-lg font-bold mb-2 hover:text-[#EE4339] transition leading-tight">
                  {article.judul}
                </h2>

                {/* Description - Hide on mobile */}
                <p className="hidden md:block text-sm text-gray-700 mb-3 line-clamp-3 leading-relaxed text-justify">
                  {article.description}
                </p>

                {/* Date Info */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{article.tanggal}</span>
                  <span>|</span>
                  <span className="hidden sm:inline">
                    {article.lastUpdated}
                  </span>
                </div>
              </div>

              {/* Right: Image */}
              <div className="md:col-span-3 order-1 md:order-2">
                <div className="w-full h-32 md:h-auto md:aspect-video bg-blue-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200">
                  <img
                    src={article.gambar}
                    alt={article.judul}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/image.png";
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center md:justify-end gap-2 mt-8">
          <button className="px-3 md:px-4 py-2 bg-[#EE4339] text-white text-sm md:text-base rounded hover:bg-[#d63330]">
            1
          </button>
          <button className="px-3 md:px-4 py-2 bg-gray-200 text-sm md:text-base rounded hover:bg-gray-300">
            2
          </button>
          <button className="px-3 md:px-4 py-2 bg-gray-200 text-sm md:text-base rounded hover:bg-gray-300">
            3
          </button>
          <button className="px-3 md:px-4 py-2 bg-gray-200 text-sm md:text-base rounded hover:bg-gray-300">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
