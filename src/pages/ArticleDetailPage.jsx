import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Tag from "../components/Tag";
import {
  fetchArticleById,
  fetchAlbumById,
  fetchRelatedArticles,
} from "../services/api";
import ContentBottomSections from "../components/ContentBottomSections";

// Function to extract article IDs from "Baca juga" links in content
const extractBacaJugaLinks = (htmlContent) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    // Find all links that might be "Baca juga" links
    const links = doc.querySelectorAll('a[href*="/article/"]');
    const bacaJugaLinks = [];

    links.forEach((link) => {
      const href = link.getAttribute("href");
      // Extract article ID from URL pattern: /article/{id}/{slug}
      const match = href.match(/\/article\/(\d+)/);
      if (match && match[1]) {
        bacaJugaLinks.push({
          id: match[1],
          title: link.textContent.trim(),
          url: href,
          element: link,
        });
      }
    });

    return bacaJugaLinks;
  } catch (error) {
    console.error("Error extracting Baca Juga links:", error);
    return [];
  }
};

// Function to fetch article data for Baca Juga links
const extractAndFetchBacaJugaArticles = async (htmlContent) => {
  const links = extractBacaJugaLinks(htmlContent);
  if (links.length === 0) return [];

  try {
    // Fetch article data for each link
    const articlePromises = links.map((link) =>
      fetchArticleById(link.id).catch((err) => {
        console.warn(`Failed to fetch article ${link.id}:`, err);
        return null;
      })
    );

    const articles = await Promise.all(articlePromises);
    return articles.filter((article) => article !== null);
  } catch (error) {
    console.error("Error fetching Baca Juga articles:", error);
    return [];
  }
};

function ArticleDetailPage() {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [bacaJugaArticles, setBacaJugaArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Detect if this is a galeri album based on route
  const isGaleri = type === "galeri" || location.pathname.includes("/galeri/");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch article or album based on type
        const articleData = isGaleri
          ? await fetchAlbumById(id)
          : await fetchArticleById(id);
        console.log(
          `✅ ${isGaleri ? "Album" : "Article"} loaded:`,
          articleData
        );
        if (articleData) {
          setArticle(articleData);
          console.log("✅ Article state set");
          // Only fetch related articles for regular articles, not galeri
          if (!isGaleri) {
            try {
              const related = await fetchRelatedArticles(articleData.id, 5);
              setRelatedArticles(related.slice(0, 3));
              // Extract "Baca Juga" links from content and fetch their data
              if (articleData.isi) {
                const bacaJugaData = await extractAndFetchBacaJugaArticles(
                  articleData.isi
                );
                setBacaJugaArticles(bacaJugaData);
              } else {
                setBacaJugaArticles([]);
              }
            } catch (headlineError) {
              console.warn("Could not load related articles:", headlineError);
              setRelatedArticles([]);
              setBacaJugaArticles([]);
            }
          }
        } else {
          console.error("❌ No article data returned");
        }
      } catch (error) {
        console.error("❌ Error loading article:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Share functions
  const shareUrl = window.location.href;
  const shareTitle = article ? article.judul : "";

  const handleShare = (platform) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);

    const shareLinks = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    };

    window.open(shareLinks[platform], "_blank", "width=600,height=400");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link berhasil disalin!");
  };

  // If loading
  if (loading) {
    return (
      <div className="md:mx-24">
        <div className="bg-white px-5 md:px-10 py-16 mt-2 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  // If article not found, show error
  if (!article) {
    return (
      <div className="md:mx-24">
        <div className="bg-white px-5 md:px-10 py-16 mt-2 text-center">
          <h1 className="text-3xl font-bold mb-4">Artikel Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-6">
            Artikel yang Anda cari tidak tersedia atau telah dihapus.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-[#EE4339] text-white rounded-lg hover:bg-[#d63330]"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="md:mx-70">
        <div className="bg-white px-4 md:px-10 py-4 md:py-6 mt-2">
          {/* Tag */}
          {/* <div className="mb-3">
          <Tag judul={article.tag} className="text-xs md:text-sm" />
        </div> */}

          {/* Article Title */}
          <h1 className="text-2xl md:text-4xl font-bold mb-4 leading-tight text-gray-900 border-b-4 border-[#EE4339] pb-2">
            {article.judul_berita}
          </h1>

          {/* Article Meta Info */}
          <div className="border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-600 pb-4">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-medium">{article.tanggal}</span>
              </div>
              <span className="hidden md:inline">|</span>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>
                  <span className="font-semibold">Reporter:</span>{" "}
                  {article.reporter || "Redaksi"}
                </span>
              </div>
              <span className="hidden md:inline">|</span>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span>
                  <span className="font-semibold">Penulis:</span>{" "}
                  {article.penulis}
                </span>
              </div>
              {article.sumber && (
                <>
                  <span className="hidden md:inline">|</span>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    <span>
                      <span className="font-semibold">Sumber:</span>{" "}
                      {article.sumber}
                    </span>
                  </div>
                </>
              )}
              <span className="hidden md:inline">|</span>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span>
                  <span className="font-semibold">Dibaca:</span>{" "}
                  {article.timesRead || 0} kali
                </span>
              </div>
            </div>
            {/* Share Button - Single Icon with Dropdown */}
            <div className="relative mb-6">
              <button
                onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                className="flex items-center gap-2 bg-[#EE4339] text-white px-4 py-2 rounded-lg hover:bg-[#d63330] transition"
                aria-label="Share article"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                <span className="font-semibold">Bagikan</span>
              </button>

              {/* Share Dropdown Menu */}
              {isShareMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsShareMenuOpen(false)}
                  ></div>

                  {/* Menu */}
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[200px] z-20">
                    <button
                      onClick={() => {
                        handleShare("facebook");
                        setIsShareMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-100 transition"
                    >
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span className="text-gray-700">Facebook</span>
                    </button>

                    <button
                      onClick={() => {
                        handleShare("twitter");
                        setIsShareMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-100 transition"
                    >
                      <svg
                        className="w-5 h-5 text-sky-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                      <span className="text-gray-700">Twitter</span>
                    </button>

                    <button
                      onClick={() => {
                        handleShare("whatsapp");
                        setIsShareMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-100 transition"
                    >
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      <span className="text-gray-700">WhatsApp</span>
                    </button>

                    <button
                      onClick={() => {
                        handleShare("telegram");
                        setIsShareMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-100 transition"
                    >
                      <svg
                        className="w-5 h-5 text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                      <span className="text-gray-700">Telegram</span>
                    </button>

                    <div className="border-t border-gray-200 my-1"></div>

                    <button
                      onClick={() => {
                        copyToClipboard();
                        setIsShareMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-100 transition"
                    >
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-gray-700">Salin Link</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Featured Image with Caption */}
          <div className="mb-6">
            <div className="relative">
              <img
                src={article.gambar}
                alt={article.judul}
                className="w-full mx-auto h-auto rounded-lg"
                onError={(e) => {
                  e.target.src = "/image.png";
                }}
              />
            </div>
            {/* Image Caption */}
            {article.ket_foto && (
              <p className="text-xs md:text-sm text-gray-500 italic mt-2 text-center">
                {article.ket_foto}
              </p>
            )}
          </div>

          {/* Article Content with Baca Juga in the middle */}
          <ArticleContentWithBacaJuga
            content={article.isi}
            bacaJugaArticles={bacaJugaArticles}
            onNavigate={(articleId, articleUrl) => {
              navigate(`/article/${articleId}/${articleUrl || articleId}`);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />

          {/* Tags Section */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">Tags:</span>
              <Tag judul={article.nama_kategori} className="text-xs" />
            </div>
          </div>

          {/* Related Articles - Only show if there are articles */}
          {relatedArticles && relatedArticles.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-300">
              <h3 className="font-bold text-xl mb-4">Berita Terkait</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedArticles.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() =>
                      navigate(`/article/${item.id}/${item.url || item.id}`)
                    }
                    className="cursor-pointer hover:shadow-lg transition"
                  >
                    <img
                      src={item.gambar}
                      alt={item.judul}
                      className="w-full h-40 object-cover rounded"
                      onError={(e) => {
                        e.target.src = "/image.png";
                      }}
                    />
                    <h4 className="font-bold mt-2 line-clamp-2">
                      {item.judul}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">{item.tanggal}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="md:mx-24">
        <ContentBottomSections />
      </div>
    </>
  );
}

// Component to render article content with Baca Juga section in the middle
function ArticleContentWithBacaJuga({ content, bacaJugaArticles, onNavigate }) {
  // Parse content and split it where "Baca juga" links appear
  const contentSections = useMemo(() => {
    if (!content) return [];

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");

      // Find all "Baca juga" paragraphs (containing <strong>Baca juga:</strong>)
      const allElements = Array.from(doc.body.children);
      const sections = [];
      let currentSection = [];

      allElements.forEach((element, index) => {
        const html = element.outerHTML.toLowerCase();

        // Check if this element contains "baca juga" link
        if (
          html.includes("baca juga") &&
          element.querySelector('a[href*="/article/"]')
        ) {
          // Save current section before the "Baca juga"
          if (currentSection.length > 0) {
            sections.push({
              type: "content",
              html: currentSection.map((el) => el.outerHTML).join(""),
            });
            currentSection = [];
          }

          // Mark this as a "Baca juga" section
          const link = element.querySelector('a[href*="/article/"]');
          const href = link ? link.getAttribute("href") : "";
          const match = href.match(/\/article\/(\d+)/);

          sections.push({
            type: "bacajuga",
            articleId: match ? match[1] : null,
          });

          // Don't add the paragraph itself to current section
        } else {
          currentSection.push(element);
        }
      });

      // Add remaining content
      if (currentSection.length > 0) {
        sections.push({
          type: "content",
          html: currentSection.map((el) => el.outerHTML).join(""),
        });
      }

      return sections;
    } catch (error) {
      console.error("Error parsing content:", error);
      return [{ type: "content", html: content }];
    }
  }, [content]);

  // Map article IDs to article data
  const articleMap = useMemo(() => {
    const map = {};
    bacaJugaArticles.forEach((article) => {
      map[article.id_berita || article.id] = article;
    });
    return map;
  }, [bacaJugaArticles]);

  return (
    <>
      {contentSections.map((section, index) => {
        if (section.type === "content") {
          return (
            <div
              key={index}
              className="prose max-w-none -mb-6"
              dangerouslySetInnerHTML={{ __html: section.html }}
            />
          );
        } else if (section.type === "bacajuga" && section.articleId) {
          const article = articleMap[section.articleId];

          if (!article) return null;

          return (
            <div
              key={index}
              className="my-3 bg-linear-to-br from-red-50 to-orange-50 border-l-4 border-[#EE4339] rounded-lg p-6 shadow-md"
            >
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="w-6 h-6 text-[#EE4339]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <h3 className="text-xl font-bold text-gray-800">Baca Juga</h3>
              </div>

              <div
                onClick={() =>
                  onNavigate(article.id_berita || article.id, article.url)
                }
                className="flex gap-4 bg-white rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
              >
                {/* Article Image */}
                <div className="shrink-0">
                  <img
                    src={article.gambar}
                    alt={article.judul_berita || article.judul}
                    className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg group-hover:opacity-90 transition"
                    onError={(e) => {
                      e.target.src = "/image.png";
                    }}
                  />
                </div>

                {/* Article Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-white bg-[#EE4339] px-2 py-1 rounded">
                      {article.nama_kategori || article.tag}
                    </span>
                    <span className="text-xs text-gray-500">
                      {article.tanggal}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-800 line-clamp-2 group-hover:text-[#EE4339] transition">
                    {article.judul_berita || article.judul}
                  </h4>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2 hidden md:block">
                    {article.description}
                  </p>
                </div>
              </div>
            </div>
          );
        }

        return null;
      })}
    </>
  );
}

export default ArticleDetailPage;
