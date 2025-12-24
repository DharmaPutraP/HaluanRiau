import { useState, useEffect } from "react";
import { useParams, useNavigate, data } from "react-router-dom";
import Tag from "../components/Tag";
import { fetchByCategory } from "../services/api";
import ContentBottomSections from "../components/ContentBottomSections";

function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const articlesPerPage = 10;

  // Get today's date in YYYY-MM-DD format for max date
  const today = new Date().toISOString().split("T")[0];

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
        // Pass date filters to server for efficient filtering
        const response = await fetchByCategory(
          category,
          currentPage,
          articlesPerPage,
          filterStartDate || null,
          filterEndDate || null
        );

        // Extract articles and pagination from response
        const data = response.articles || response;
        const pagination = response.pagination;

        setArticles(data);

        // Use server's totalPages if available, otherwise estimate
        if (pagination && pagination.totalPages) {
          setTotalArticles(
            pagination.totalItems || pagination.totalPages * articlesPerPage
          );
        } else {
          // Fallback: estimate total articles
          if (data.length === articlesPerPage) {
            setTotalArticles(currentPage * articlesPerPage + 1);
          } else {
            setTotalArticles((currentPage - 1) * articlesPerPage + data.length);
          }
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [category, currentPage, filterStartDate, filterEndDate]);

  // Check if it's a section page or category page
  const isSection = sectionConfig[category];
  const pageTitle = isSection
    ? sectionConfig[category].title
    : category
    ? category.toUpperCase()
    : "SEMUA ARTIKEL";

  // Helper function to parse Indonesian date format
  const parseIndonesianDate = (dateStr) => {
    // Map Indonesian month names to numbers
    const monthMap = {
      Januari: 0,
      Februari: 1,
      Maret: 2,
      April: 3,
      Mei: 4,
      Juni: 5,
      Juli: 6,
      Agustus: 7,
      September: 8,
      Oktober: 9,
      November: 10,
      Desember: 11,
    };

    // Extract date parts from format like "11 November 2025"
    const parts = dateStr.trim().split(" ");
    if (parts.length !== 3) return null;

    const day = parseInt(parts[0]);
    const month = monthMap[parts[1]];
    const year = parseInt(parts[2]);

    if (isNaN(day) || month === undefined || isNaN(year)) return null;

    return new Date(year, month, day);
  };

  // Server already filtered the articles, just use them directly
  const filteredArticles = articles;

  const handleSearch = () => {
    // Apply the filter when button is clicked
    setFilterStartDate(startDate);
    setFilterEndDate(endDate);
    setCurrentPage(1); // Reset to first page when applying filter
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setFilterStartDate("");
    setFilterEndDate("");
    setCurrentPage(1); // Reset to first page when clearing filter
  };

  // Pagination calculations - server handles everything
  const totalPages = Math.ceil(totalArticles / articlesPerPage);
  const currentArticles = filteredArticles; // Already paginated and filtered by server
  const maxPagesToShow = 5;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      let startPage = Math.max(2, currentPage - 2);
      let endPage = Math.min(totalPages - 1, currentPage + 2);

      // Adjust if we're near the beginning
      if (currentPage <= 4) {
        endPage = Math.min(6, totalPages - 1);
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 3) {
        startPage = Math.max(2, totalPages - 5);
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="w-full px-2 sm:px-4 ">
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
    <div className="w-full px-2 sm:px-4 ">
      <div className="bg-white px-3 sm:px-5 md:px-10 py-4 sm:py-6">
        {/* Header with Title and Date Filter */}
        <div className="mb-4 sm:mb-6 pb-2 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 border-b-4 border-primary">
          {/* Title */}
          <div className="flex items-center gap-2 md:gap-3 pb-2 w-fit">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
              {pageTitle}
            </h1>
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>

          {/* Date Filter Section */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
            {/* Clear Filter Button (only show if filter is active) */}
            {(filterStartDate || filterEndDate) && (
              <button
                onClick={handleClearFilter}
                className="px-3 sm:px-4 md:px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition font-semibold text-xs sm:text-sm order-1"
              >
                RESET
              </button>
            )}

            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={!startDate && !endDate}
              className={`px-3 sm:px-4 md:px-6 py-2 rounded transition font-semibold text-xs sm:text-sm order-2 sm:order-1 ${
                startDate || endDate
                  ? "bg-[#EE4339] text-white hover:bg-[#d63330]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              CARI
            </button>

            {/* Date Inputs */}
            <div className="flex items-center gap-2 border border-gray-300 rounded px-2 sm:px-3 py-2 order-1 sm:order-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={today}
                className="outline-none text-xs sm:text-sm w-full"
                placeholder="Tanggal Mulai"
              />
              <span className="text-gray-400">-</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                max={today}
                min={startDate || undefined}
                className="outline-none text-xs sm:text-sm w-full"
                placeholder="Tanggal Akhir"
              />
            </div>
          </div>
        </div>

        {/* Articles List */}
        {filteredArticles.length === 0 ? (
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-2">
              Tidak Ada Hasil
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">
              {filterStartDate || filterEndDate
                ? "Tidak ditemukan artikel pada rentang tanggal yang dipilih"
                : "Tidak ada artikel yang tersedia"}
            </p>
            {(filterStartDate || filterEndDate) && (
              <button
                onClick={handleClearFilter}
                className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-[#EE4339] text-white rounded hover:bg-[#d63330] transition"
              >
                Tampilkan Semua Artikel
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {currentArticles.map((article, index) => {
              // Check if this is a galeri item
              const isGaleriItem =
                category === "galeri" || article.tag === "Galeri";
              const baseRoute = isGaleriItem ? "/galeri" : "/article";

              return (
                <div
                  key={index}
                  onClick={() =>
                    navigate(
                      `${baseRoute}/${article.id}/${article.url || article.id}`
                    )
                  }
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 p-3 sm:p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition rounded"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            {/* Page info */}
            <div className="text-xs sm:text-sm text-gray-600">
              Halaman {currentPage} dari {totalPages}
            </div>

            {/* Pagination buttons */}
            <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
              {/* Previous button */}
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base rounded transition ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Prev
              </button>

              {/* Page numbers */}
              {getPageNumbers().map((pageNum, idx) =>
                pageNum === "..." ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-1 sm:px-2 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-500"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base rounded transition ${
                      currentPage === pageNum
                        ? "bg-[#EE4339] text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              )}

              {/* Next button */}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base rounded transition ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <ContentBottomSections />
    </div>
  );
}

export default CategoryPage;
