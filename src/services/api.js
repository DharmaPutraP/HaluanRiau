const API_URL = import.meta.env.VITE_API_URL;

// Helper function to format API data to match our component structure
const formatArticleData = (apiData) => {
  return apiData.map((item) => ({
    id: item.id_berita,
    judul: item.judul_berita,
    judul_berita: item.judul_berita, // Keep original for article detail page
    tag: item.nama_kategori,
    nama_kategori: item.nama_kategori, // Add nama_kategori separately
    permalink: item.permalink, // Add permalink for category
    sumber: item.sumber,
    tanggal: formatDate(item.tanggal, item.waktu),
    lastUpdated: formatLastUpdated(item.updated_at),
    description: stripHtml(item.isi).substring(0, 200) + "...",
    gambar: item.gambar ? `/foto/berita/original/${item.gambar}` : "/image.png",
    image: item.gambar ? `/foto/berita/original/${item.gambar}` : "/image.png",
    foto_kecil: item.foto_kecil
      ? `/foto/berita/original/${item.foto_kecil}`
      : "/image.png",
    ket_foto: item.ket_foto || "",
    reporter: item.reporter || "Redaksi",
    penulis: item.penulis || item.warta || "Redaksi",
    counter: item.counter || 0,
    timesRead: item.counter || 0,
    url: item.url,
    isi: item.isi,
    jumlah_dibaca: item.counter || 0,
    rawGambar: item.gambar, // For debugging
  }));
};

// Strip HTML tags from content
const stripHtml = (html) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

// Format date
const formatDate = (date, time) => {
  const dateObj = new Date(`${date} ${time}`);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return dateObj.toLocaleDateString("id-ID", options);
};

// Format last updated
const formatLastUpdated = (datetime) => {
  const dateObj = new Date(datetime);
  const now = new Date();
  const diffMs = now - dateObj;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins} menit yang lalu`;
  } else if (diffHours < 24) {
    return `${diffHours} jam yang lalu`;
  } else if (diffDays < 7) {
    return `${diffDays} hari yang lalu`;
  } else {
    return dateObj.toLocaleDateString("id-ID");
  }
};

// Generic function to fetch by category with pagination
const fetchByKategori = async (kategori, page = 1, limit = 10) => {
  try {
    const response = await fetch(
      `${API_URL}/kategori/${kategori}?halaman=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error(`Failed to fetch ${kategori}`);
    const responseData = await response.json();

    // Handle new response format with pagination metadata
    const data = responseData.data || responseData;
    const pagination = responseData.pagination || null;

    console.log(`📂 ${kategori} page ${page} - Got`, data?.length, "articles");
    if (pagination) {
      console.log(
        `📊 Total: ${pagination.totalItems}, Pages: ${pagination.totalPages}`
      );
    }

    const formatted = formatArticleData(data);

    // Return both data and pagination info
    return {
      articles: formatted,
      pagination: pagination,
    };
  } catch (error) {
    console.error(`Error fetching ${kategori}:`, error);
    return { articles: [], pagination: null };
  }
};

// Special function for filters that use /berita endpoint
const fetchBySpecialFilter = async (
  filterName,
  filterValue = 1,
  page = 1,
  limit = 10
) => {
  try {
    const response = await fetch(
      `${API_URL}/berita?halaman=${page}&limit=${limit}&${filterName}=${filterValue}`
    );
    console.log(
      `${API_URL}/berita?halaman=${page}&limit=${limit}&${filterName}=${filterValue}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch ${filterName}`);
    }

    const result = await response.json();
    console.log(
      `🔥 ${filterName} page ${page} - Got ${result.data?.length || 0} articles`
    );

    const articles = formatArticleData(result.data || []);
    const pagination = result.pagination || null;

    return {
      articles: articles,
      pagination: pagination,
    };
  } catch (error) {
    console.error(`Error fetching ${filterName}:`, error);
    return { articles: [], pagination: null };
  }
};

// Fetch functions for each endpoint - with default pagination
export const fetchHeadlines = async (page = 1, limit = 10) => {
  const result = await fetchBySpecialFilter("headline", 1, page, limit);
  return result.articles; // Return only articles for backward compatibility
};
export const fetchPilihanEditor = async (page = 1, limit = 10) => {
  const result = await fetchBySpecialFilter("pilihaneditor", 1, page, limit);
  return result.articles;
};
export const fetchTerpopuler = async (page = 1, limit = 10) => {
  const result = await fetchBySpecialFilter("terpopuler", 1, page, limit);
  return result.articles;
};
export const fetchAdvertorial = async (page = 1, limit = 10) => {
  const result = await fetchBySpecialFilter("advertorial", 1, page, limit);
  return result.articles;
};
export const fetchGagasan = async (page = 1, limit = 10) => {
  const result = await fetchByKategori("gagasan", page, limit);
  return result.articles;
};
export const fetchRiau = async (page = 1, limit = 10) => {
  const result = await fetchBySpecialFilter("Riau", 1, page, limit);
  return result.articles;
};
export const fetchNasional = async (page = 1, limit = 10) => {
  const result = await fetchByKategori("nasional", page, limit);
  return result.articles;
};
export const fetchTipsKesehatan = async (page = 1, limit = 10) => {
  const result = await fetchByKategori("tips&kesehatan", page, limit);
  return result.articles;
};
export const fetchGaleri = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(`${API_URL}/albumgaleri`);
    if (!response.ok) throw new Error("Failed to fetch galeri");
    const data = await response.json();

    // Format album galeri data
    const formattedData = data.map((item) => ({
      id: item.id_album,
      judul: item.nama_album,
      judul_berita: item.nama_album,
      tag: "Galeri",
      tanggal: formatDate(item.tanggal_album, item.waktu || "00:00:00"),
      description: item.keterangan || "",
      gambar: item.gambar ? `/foto/galeri/${item.gambar}` : "/image.png",
      image: item.gambar ? `/foto/galeri/${item.gambar}` : "/image.png",
      foto_kecil: item.gambar ? `/foto/galeri/${item.gambar}` : "/image.png",
      counter: item.counter || 0,
      timesRead: item.counter || 0,
      url: item.permalink,
      rawGambar: item.gambar,
    }));

    return formattedData;
  } catch (error) {
    console.error("Error fetching galeri:", error);
    return [];
  }
};

// Berita Terkini uses /berita without filters (gets all latest news)
export const fetchBeritaTerkini = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(
      `${API_URL}/berita?halaman=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error("Failed to fetch berita terkini");
    const responseData = await response.json();

    // Handle new response format with pagination metadata
    const data = responseData.data || responseData;
    const pagination = responseData.pagination || null;

    console.log(
      `🔥 Berita Terkini page ${page} - Got`,
      data?.length,
      "articles"
    );
    if (pagination) {
      console.log(
        `📊 Total: ${pagination.totalItems}, Pages: ${pagination.totalPages}`
      );
    }

    return formatArticleData(data);
  } catch (error) {
    console.error("Error fetching berita terkini:", error);
    return [];
  }
};

export const fetchArticleById = async (id) => {
  try {
    console.log(`🔍 Fetching article with ID: ${id}`);
    console.log(`📡 URL: ${API_URL}/${id}`);

    const response = await fetch(`${API_URL}/${id}`);
    console.log("Response status:", response.status);

    if (!response.ok) {
      console.error(
        "❌ Response not OK:",
        response.status,
        response.statusText
      );
      throw new Error("Failed to fetch article");
    }

    const data = await response.json();
    console.log("📦 Raw response data:", data);
    console.log("Is array:", Array.isArray(data));
    console.log("Data type:", typeof data);

    // Handle both single object and array responses
    const articleData = Array.isArray(data) ? data[0] : data;
    console.log("Article data to format:", articleData);

    if (!articleData) {
      console.error("❌ No article data found");
      return null;
    }

    const formatted = formatArticleData([articleData])[0];
    console.log("✅ Formatted article:", formatted);

    return formatted;
  } catch (error) {
    console.error("❌ Error fetching article:", error);
    return null;
  }
};

export const fetchArticleByUrl = async (url) => {
  try {
    console.log(`🔍 Fetching article with URL: ${url}`);
    console.log(`📡 URL: ${API_URL}/${url}`);

    const response = await fetch(`${API_URL}/${url}`);
    console.log("Response status:", response.status);

    if (!response.ok) {
      console.error(
        "❌ Response not OK:",
        response.status,
        response.statusText
      );
      throw new Error("Failed to fetch article");
    }

    const data = await response.json();
    console.log("📦 Raw response data:", data);
    console.log("Is array:", Array.isArray(data));
    console.log("Data type:", typeof data);

    // Handle both single object and array responses
    const articleData = Array.isArray(data) ? data[0] : data;
    console.log("Article data to format:", articleData);

    if (!articleData) {
      console.error("❌ No article data found");
      return null;
    }

    const formatted = formatArticleData([articleData])[0];
    console.log("✅ Formatted article:", formatted);

    return formatted;
  } catch (error) {
    console.error("❌ Error fetching article:", error);
    return null;
  }
};

// Generic fetch function for category pages with pagination
export const fetchByCategory = async (category, page = 1, limit = 10) => {
  const endpointMap = {
    headline: fetchHeadlines,
    "pilihan-editor": fetchPilihanEditor,
    "berita-terkini": fetchBeritaTerkini,
    "indeks-berita": fetchBeritaTerkini,
    terpopuler: fetchTerpopuler,
    gagasan: fetchGagasan,
    riau: fetchRiau,
    nasional: fetchNasional,
    "tips-kesehatan": fetchTipsKesehatan,
    advertorial: fetchAdvertorial,
    galeri: fetchGaleri,
  };

  const fetchFunction = endpointMap[category];
  if (fetchFunction) {
    return await fetchFunction(page, limit);
  }

  try {
    const response = await fetch(
      `${API_URL}/kategori/${category}?halaman=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error(`Failed to fetch ${category}`);
    const responseData = await response.json();

    // Handle new response format with pagination metadata
    const data = responseData.data || responseData;
    const pagination = responseData.pagination || null;

    console.log(`📂 ${category} page ${page} - Got`, data?.length, "articles");
    if (pagination) {
      console.log(
        `📊 Total: ${pagination.totalItems}, Pages: ${pagination.totalPages}`
      );
    }

    return formatArticleData(data);
  } catch (error) {
    console.error(`Error fetching ${category}:`, error);
    return [];
  }
};

// Fetch album galeri by ID
export const fetchAlbumById = async (id) => {
  try {
    console.log(`🔍 Fetching album with ID: ${id}`);
    const response = await fetch(`${API_URL}/albumgaleri/${id}`);

    if (!response.ok) {
      console.error("❌ Response not OK:", response.status);
      throw new Error("Failed to fetch album");
    }

    const data = await response.json();
    console.log("📦 Raw album data:", data);

    // Handle both single object and array responses
    const albumData = Array.isArray(data) ? data[0] : data;

    if (!albumData) {
      console.error("❌ No album data found");
      return null;
    }

    // Format album data
    const formatted = {
      id: albumData.id_album,
      judul: albumData.nama_album,
      judul_berita: albumData.nama_album,
      tag: "Galeri",
      tanggal: formatDate(
        albumData.tanggal_album,
        albumData.waktu || "00:00:00"
      ),
      description: albumData.keterangan || "",
      isi: albumData.keterangan || "",
      gambar: albumData.gambar
        ? `/foto/galeri/${albumData.gambar}`
        : "/image.png",
      image: albumData.gambar
        ? `/foto/galeri/${albumData.gambar}`
        : "/image.png",
      foto_kecil: albumData.gambar
        ? `/foto/galeri/${albumData.gambar}`
        : "/image.png",
      ket_foto: albumData.keterangan || "",
      counter: albumData.counter || 0,
      timesRead: albumData.counter || 0,
      url: albumData.permalink,
      rawGambar: albumData.gambar,
      lastUpdated: formatLastUpdated(albumData.updated_at),
      reporter: "Redaksi",
      penulis: "Redaksi",
      nama_kategori: "Galeri",
      permalink: "galeri",
    };

    console.log("✅ Formatted album:", formatted);
    return formatted;
  } catch (error) {
    console.error("❌ Error fetching album:", error);
    return null;
  }
};

// New function to fetch related articles for "Baca Juga" section
export const fetchRelatedArticles = async (articleId, limit = 2) => {
  try {
    console.log(`🔗 Fetching related articles for ID: ${articleId}`);
    const response = await fetch(
      `${API_URL}/artikel/${articleId}/related?limit=${limit}`
    );
    if (!response.ok) throw new Error("Failed to fetch related articles");
    const data = await response.json();
    console.log(`🔗 Related articles - Got`, data?.length, "articles");
    return formatArticleData(data);
  } catch (error) {
    console.error("Error fetching related articles:", error);
    return [];
  }
};

export const fetchSearchResults = async (query) => {
  try {
    console.log(`🔍 Searching for: ${query}`);
    const response = await fetch(
      `${API_URL}/search/${encodeURIComponent(query)}`
    );
    console.log(`${API_URL}/search/${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error("Failed to fetch search results");
    const data = await response.json();
    console.log(`📦 Search results:`, data?.length, "articles");
    return formatArticleData(data);
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
};

// Fetch banners/ads
export const fetchBanners = async () => {
  try {
    console.log(`🎯 Fetching banners...`);
    const response = await fetch(`${API_URL}/banner`);
    if (!response.ok) throw new Error("Failed to fetch banners");
    const data = await response.json();
    console.log(data);
    console.log(`📦 Banners:`, data?.length, "items");

    // Format banner data
    const formatted = data.map((item) => ({
      id: item.id_banner,
      id_banner: item.id_banner,
      id_posbanner: item.id_posbanner,
      posbanner: item.posbanner,
      permalink: item.permalink,
      judul: item.judul,
      keterangan: item.keterangan,
      foto_besar: item.foto_besar ? `/foto/banner/${item.foto_besar}` : null,
      foto_kecil: item.foto_kecil ? `/foto/banner/${item.foto_kecil}` : null,
      image: item.foto_besar ? `/foto/banner/${item.foto_besar}` : null, // default to large image
      status: item.status,
      status2: item.status2,
      tanggal: item.tanggal,
      waktu: item.waktu,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));

    return formatted;
  } catch (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
};

// Fetch banners by position
export const fetchBannersByPosition = async (position) => {
  try {
    console.log(`🎯 Fetching banners for position: ${position}`);
    const banners = await fetchBanners();

    // Filter by position permalink or position name
    const filtered = banners.filter(
      (banner) =>
        banner.permalink === position ||
        (banner.posbanner &&
          banner.posbanner.toLowerCase().includes(position.toLowerCase()))
    );

    console.log(
      `📦 Found ${filtered.length} banner(s) for position: ${position}`
    );
    return filtered;
  } catch (error) {
    console.error(`Error fetching banners for position ${position}:`, error);
    return [];
  }
};
