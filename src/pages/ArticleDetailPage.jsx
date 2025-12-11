import { useParams, useNavigate } from "react-router-dom";
import { HEADLINES } from "../utils/constants";
import Tag from "../components/Tag";

function ArticleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Validate article ID
  const articleIndex = parseInt(id) - 1;
  const article = HEADLINES[articleIndex];

  // If article not found, show error
  if (!article || articleIndex < 0 || articleIndex >= HEADLINES.length) {
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
    <div className="md:mx-24">
      <div className="bg-white px-5 md:px-10 py-6 mt-2">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <button
            onClick={() => navigate("/")}
            className="hover:text-[#EE4339]"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-gray-700">{article.tag}</span>
        </div>

        {/* Article Header */}
        <div className="mb-6">
          <Tag judul={article.tag} className="text-sm mb-3" />
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            {article.judul}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{article.tanggal}</span>
            <span>|</span>
            <span>{article.lastUpdated}</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-6">
          <img
            src="image.png"
            alt={article.judul}
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* Article Content */}
        <div className="prose max-w-none">
          <p className="text-lg leading-relaxed mb-4">{article.description}</p>
          <p className="text-base leading-relaxed mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <p className="text-base leading-relaxed mb-4">
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>
          <p className="text-base leading-relaxed mb-4">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo.
          </p>
        </div>

        {/* Share Section */}
        <div className="mt-8 pt-6 border-t border-gray-300">
          <h3 className="font-bold mb-3">Bagikan Artikel:</h3>
          <div className="flex gap-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Facebook
            </button>
            <button className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600">
              Twitter
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              WhatsApp
            </button>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-8 pt-6 border-t border-gray-300">
          <h3 className="font-bold text-xl mb-4">Berita Terkait</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {HEADLINES.slice(0, 3).map((item, index) => (
              <div
                key={index}
                onClick={() => navigate(`/article/${index + 1}`)}
                className="cursor-pointer hover:shadow-lg transition"
              >
                <img
                  src="image.png"
                  alt={item.judul}
                  className="w-full h-40 object-cover rounded"
                />
                <h4 className="font-bold mt-2 line-clamp-2">{item.judul}</h4>
                <p className="text-sm text-gray-500 mt-1">{item.tanggal}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleDetailPage;
