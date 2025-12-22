import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Tag from "../components/Tag";
import { fetchSearchResults } from "../services/api";

function SearchPage() {
  const { query } = useParams();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchSearchResults(query);
        setArticles(data);
      } catch (error) {
        console.error("Error loading search results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      loadData();
    }
  }, [query]);

  if (loading) {
    return (
      <div className="w-full px-2 sm:px-4">
        <div className="bg-white px-3 sm:px-5 md:px-10 py-12 sm:py-16 mt-2 text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#EE4339] mx-auto"></div>
          <p className="mt-4 text-sm sm:text-base text-gray-600">Mencari...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-4">
      <div className="bg-white px-3 sm:px-5 md:px-10 py-4 sm:py-6">
        {/* Header with Search Query */}
        <div className="mb-4 sm:mb-6 pb-2 border-b-4 border-[#EE4339]">
          <div className="flex items-center gap-2 md:gap-3 pb-2 w-fit flex-wrap">
            <h1 className="text-base sm:text-lg md:text-2xl font-bold break-words">
              HASIL PENCARIAN: "{decodeURIComponent(query)}"
            </h1>
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Ditemukan {articles.length} artikel
          </p>
        </div>

        {/* Articles List */}
        {articles.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <svg
              className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-2">
              Tidak Ada Hasil
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">
              Tidak ditemukan artikel yang sesuai dengan pencarian Anda
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-[#EE4339] text-white rounded hover:bg-[#d63330] transition"
            >
              Kembali ke Beranda
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {articles.map((article, index) => {
              // Check if this is a galeri item
              const isGaleriItem = article.tag === "Galeri";
              const baseRoute = isGaleriItem ? "/galeri" : "/article";

              return (
                <div
                  key={index}
                  onClick={() =>
                    navigate(
                      `${baseRoute}/${article.id}/${article.url || article.id}`
                    )
                  }
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 p-3 md:p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition rounded"
                >
                  {/* Left: Content */}
                  <div className="md:col-span-9 flex flex-col justify-between order-2 md:order-1">
                    {/* Tag */}
                    <div className="mb-2">
                      <Tag judul={article.tag} className="text-xs" />
                    </div>

                    {/* Title */}
                    <h2 className="text-sm sm:text-base md:text-lg font-bold mb-2 hover:text-[#EE4339] transition leading-tight">
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
                    <div className="w-full h-40 sm:h-32 md:h-auto md:aspect-video bg-blue-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200">
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
