const API_URL = import.meta.env.VITE_API_URL;
const API_IMAGE = import.meta.env.VITE_API_IMAGE || "";

// ==================== API CACHING SYSTEM ====================
// Simple in-memory cache with TTL (Time To Live)
class APICache {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes default
  }

  // Generate cache key from URL and params
  generateKey(url, params = {}) {
    const paramString = JSON.stringify(params);
    return `${url}${paramString}`;
  }

  // Get cached data if valid
  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > cached.ttl) {
      // Cache expired, remove it
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  // Set cache with optional TTL
  set(key, data, ttl = this.defaultTTL) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  // Clear specific cache or all
  clear(key = null) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  // Get cache stats (for debugging)
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Create cache instance
const apiCache = new APICache();

// Generic fetch function with caching
const fetchWithCache = async (url, options = {}) => {
  const {
    useCache = true,
    ttl = 5 * 60 * 1000, // 5 minutes
    params = {},
  } = options;

  // Generate cache key
  const cacheKey = apiCache.generateKey(url, params);

  // Try to get from cache
  if (useCache) {
    const cached = apiCache.get(cacheKey);
    if (cached) {
      return cached;
    }
  }

  // Fetch from API
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Store in cache
    if (useCache) {
      apiCache.set(cacheKey, data, ttl);
    }

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

// Export cache control functions for manual cache management
export const cacheControl = {
  clear: (key) => apiCache.clear(key),
  clearAll: () => apiCache.clear(),
  stats: () => apiCache.getStats(),
};

// ==================== END CACHING SYSTEM ====================

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
    lastUpdated: formatLastUpdated(item.tanggal, item.waktu),
    description: stripHtml(item.isi).substring(0, 200) + "...",
    gambar: item.gambar
      ? `${API_IMAGE}/foto/berita/original/${item.gambar}`
      : "/image.png",
    image: item.gambar
      ? `${API_IMAGE}/foto/berita/original/${item.gambar}`
      : "/image.png",
    foto_kecil: item.foto_kecil
      ? `${API_IMAGE}/foto/berita/large/${item.foto_kecil}`
      : "/image.png",
    ket_foto: item.ket_foto || "",
    reporter: item.reporter || "",
    penulis: item.penulis || item.warta || "Redaksi",
    counter: item.counter || 0,
    timesRead: item.counter || 0,
    url: item.url,
    isi: item.isi,
    jumlah_dibaca: item.counter || 0,
    rawGambar: item.gambar, // For debugging
    tags: item.tags || [],
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
const formatLastUpdated = (date, time) => {
  // Handle both datetime string (from updated_at) and separate date/time
  let dateObj;
  if (time) {
    // If time parameter exists, combine date and time
    dateObj = new Date(`${date} ${time}`);
  } else {
    // Otherwise treat date as a full datetime string
    dateObj = new Date(date);
  }

  const now = new Date();
  const diffMs = now - dateObj;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return "Baru saja";
  } else if (diffMins < 60) {
    return `${diffMins} menit yang lalu`;
  } else if (diffHours < 24) {
    return `${diffHours} jam yang lalu`;
  } else if (diffDays < 7) {
    return `${diffDays} hari yang lalu`;
  } else {
    return dateObj.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
};

// Generic function to fetch by category with pagination
const fetchByKategori = async (
  kategori,
  page = 1,
  limit = 10,
  startDate = null,
  endDate = null
) => {
  try {
    let url = `${API_URL}/kategori/page/${kategori}?halaman=${page}&limit=${limit}`;
    if (startDate) url += `&start_date=${startDate}`;
    if (endDate) url += `&end_date=${endDate}`;

    // Use cache with 5 minute TTL
    const responseData = await fetchWithCache(url, {
      useCache: true,
      ttl: 5 * 60 * 1000,
      params: { kategori, page, limit, startDate, endDate },
    });

    // Handle new response format with pagination metadata
    const data = responseData.data || responseData;
    const pagination = responseData.pagination || null;

    const formatted = formatArticleData(data);

    // Return both data and pagination info
    return {
      articles: formatted,
      pagination: pagination,
    };
  } catch (error) {
    return { articles: [], pagination: null };
  }
};

// Special function for filters that use /berita endpoint
const fetchBySpecialFilter = async (
  filterName,
  filterValue = 1,
  page = 1,
  limit = 10,
  startDate = null,
  endDate = null
) => {
  try {
    let url = `${API_URL}/berita?halaman=${page}&limit=${limit}&${filterName}=${filterValue}`;
    if (startDate) url += `&start_date=${startDate}`;
    if (endDate) url += `&end_date=${endDate}`;

    // Use cache with 3 minute TTL for special filters
    const result = await fetchWithCache(url, {
      useCache: true,
      ttl: 3 * 60 * 1000,
      params: { filterName, filterValue, page, limit, startDate, endDate },
    });

    const articles = formatArticleData(result.data || []);
    const pagination = result.pagination || null;

    return {
      articles: articles,
      pagination: pagination,
    };
  } catch (error) {
    return { articles: [], pagination: null };
  }
};

// Fetch functions for each endpoint - with default pagination
export const fetchHeadlines = async (
  page = 1,
  limit = 10,
  startDate = null,
  endDate = null
) => {
  return await fetchBySpecialFilter(
    "headline",
    1,
    page,
    limit,
    startDate,
    endDate
  );
};
export const fetchPilihanEditor = async (
  page = 1,
  limit = 10,
  startDate = null,
  endDate = null
) => {
  return await fetchBySpecialFilter(
    "pilihaneditor",
    1,
    page,
    limit,
    startDate,
    endDate
  );
};
export const fetchTerpopuler = async (
  page = 1,
  limit = 10,
  startDate = null,
  endDate = null
) => {
  return await fetchBySpecialFilter(
    "terpopuler",
    1,
    page,
    limit,
    startDate,
    endDate
  );
};
export const fetchAdvertorial = async (
  page = 1,
  limit = 10,
  startDate = null,
  endDate = null
) => {
  return await fetchBySpecialFilter(
    "advertorial",
    1,
    page,
    limit,
    startDate,
    endDate
  );
};
export const fetchGagasan = async (
  page = 1,
  limit = 10,
  startDate = null,
  endDate = null
) => {
  return await fetchByKategori("gagasan", page, limit, startDate, endDate);
};
export const fetchRiau = async (
  page = 1,
  limit = 10,
  startDate = null,
  endDate = null
) => {
  return await fetchByKategori("zonariau", page, limit, startDate, endDate);
};
export const fetchNasional = async (
  page = 1,
  limit = 10,
  startDate = null,
  endDate = null
) => {
  return await fetchByKategori("nasional", page, limit, startDate, endDate);
};
export const fetchTipsKesehatan = async (
  page = 1,
  limit = 10,
  startDate = null,
  endDate = null
) => {
  return await fetchByKategori(
    "tips&kesehatan",
    page,
    limit,
    startDate,
    endDate
  );
};
export const fetchGaleri = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(`${API_URL}/albumgaleri`);
    if (!response.ok) throw new Error("Failed to fetch galeri");
    const responseData = await response.json();

    // Handle response structure - check if it has data property
    const data = responseData.data || responseData;

    // Format album galeri data
    const formattedData = data.map((item) => ({
      id: item.id_album,
      judul: item.nama_album,
      judul_berita: item.nama_album,
      tag: "Galeri",
      tanggal: formatDate(item.tanggal_album, item.waktu || "00:00:00"),
      description: "", // Disabled - keterangan contains unwanted HTML
      gambar: item.gambar
        ? `${API_IMAGE}/foto/galeri/${item.gambar}`
        : "/image.png",
      image: item.gambar
        ? `${API_IMAGE}/foto/galeri/${item.gambar}`
        : "/image.png",
      foto_kecil: item.gambar
        ? `${API_IMAGE}/foto/galeri/${item.gambar}`
        : "/image.png",
      counter: item.counter,
      timesRead: item.counter,
      url: item.permalink,
      rawGambar: item.gambar,
    }));

    return {
      articles: formattedData,
      pagination: responseData.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: formattedData.length,
        itemsPerPage: formattedData.length,
      },
    };
  } catch (error) {
    return { articles: [], pagination: null };
  }
};

// Berita Terkini uses /berita without filters (gets all latest news)
export const fetchBeritaTerkini = async (
  page = 1,
  limit = 10,
  startDate = null,
  endDate = null
) => {
  try {
    let url = `${API_URL}/berita?halaman=${page}&limit=${limit}`;
    if (startDate) url += `&start_date=${startDate}`;
    if (endDate) url += `&end_date=${endDate}`;

    // Use cache with 2 minute TTL for latest news
    const responseData = await fetchWithCache(url, {
      useCache: true,
      ttl: 2 * 60 * 1000,
      params: { page, limit, startDate, endDate },
    });

    // Handle new response format with pagination metadata
    const data = responseData.data || responseData;
    const pagination = responseData.pagination || null;

    return {
      articles: formatArticleData(data),
      pagination: pagination,
    };
  } catch (error) {
    return { articles: [], pagination: null };
  }
};

export const fetchArticleById = async (id) => {
  try {
    // Use cache with 10 minute TTL for individual articles
    const data = await fetchWithCache(`${API_URL}/berita/${id}`, {
      useCache: true,
      ttl: 5 * 60 * 1000,
      params: { id },
    });

    // Handle both single object and array responses
    const articleData = Array.isArray(data) ? data[0] : data;

    if (!articleData) {
      return null;
    }

    const formatted = formatArticleData([articleData])[0];

    return formatted;
  } catch (error) {
    return null;
  }
};

export const fetchArticleByUrl = async (url) => {
  try {
    const response = await fetch(`${API_URL}/${url}`);

    if (!response.ok) {
      throw new Error("Failed to fetch article");
    }

    const data = await response.json();

    // Handle both single object and array responses
    const articleData = Array.isArray(data) ? data[0] : data;

    if (!articleData) {
      return null;
    }

    const formatted = formatArticleData([articleData])[0];

    return formatted;
  } catch (error) {
    return null;
  }
};

// Generic fetch function for category pages with pagination
export const fetchByCategory = async (
  category,
  page = 1,
  limit = 10,
  startDate = null,
  endDate = null
) => {
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
    return await fetchFunction(page, limit, startDate, endDate);
  }

  try {
    // Build URL with optional date filters
    let url = `${API_URL}/kategori/page/${category}?halaman=${page}&limit=${limit}`;
    if (startDate) url += `&start_date=${startDate}`;
    if (endDate) url += `&end_date=${endDate}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${category}`);
    const responseData = await response.json();

    // Handle new response format with pagination metadata
    const data = responseData.data || responseData;
    const pagination = responseData.pagination || null;

    return {
      articles: formatArticleData(data),
      pagination: pagination,
    };
  } catch (error) {
    return [];
  }
};

// Fetch album galeri by ID
export const fetchAlbumById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/albumgaleri/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch album");
    }

    const data = await response.json();

    // Handle both single object and array responses
    const albumData = Array.isArray(data) ? data[0] : data;

    if (!albumData) {
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
      description: "", // Disabled for listing - keterangan contains unwanted HTML
      isi: albumData.keterangan || "", // Keep content for detail page
      gambar: albumData.gambar
        ? `${API_IMAGE}/foto/galeri/${albumData.gambar}`
        : "/image.png",
      image: albumData.gambar
        ? `${API_IMAGE}/foto/galeri/${albumData.gambar}`
        : "/image.png",
      foto_kecil: albumData.gambar
        ? `${API_IMAGE}/foto/galeri/${albumData.gambar}`
        : "/image.png",
      ket_foto: "", // Disabled - hide image caption
      counter: albumData.counter || 0,
      timesRead: albumData.counter || 0,
      url: albumData.permalink,
      rawGambar: albumData.gambar,
      lastUpdated: formatLastUpdated(albumData.updated_at),
      nama_kategori: "Galeri",
      permalink: "galeri",
    };

    return formatted;
  } catch (error) {
    return null;
  }
};

// New function to fetch related articles for "Baca Juga" section
export const fetchRelatedArticles = async (articleId, limit = 2) => {
  try {
    const response = await fetch(
      `${API_URL}/artikel/${articleId}/related?limit=${limit}`
    );
    if (!response.ok) throw new Error("Failed to fetch related articles");
    const data = await response.json();
    return formatArticleData(data);
  } catch (error) {
    return [];
  }
};

export const fetchSearchResults = async (query) => {
  try {
    const response = await fetch(
      `${API_URL}/search/${encodeURIComponent(query)}`
    );
    if (!response.ok) throw new Error("Failed to fetch search results");
    const data = await response.json();
    return formatArticleData(data);
  } catch (error) {
    return [];
  }
};

// Fetch banners/ads
export const fetchBanners = async () => {
  try {
    const response = await fetch(`${API_URL}/banner`);
    if (!response.ok) throw new Error("Failed to fetch banners");
    const result = await response.json();

    // Handle both array and object with data property
    const data = Array.isArray(result) ? result : result.data || [];

    // Format banner data
    const formatted = data.map((item) => ({
      id: item.id_banner,
      id_banner: item.id_banner,
      id_posbanner: item.id_posbanner,
      posbanner: item.posbanner,
      permalink: item.permalink,
      judul: item.judul,
      keterangan: item.keterangan,
      foto_besar: item.foto_besar
        ? `${API_IMAGE}/foto/banner/${item.foto_besar}`
        : null,
      foto_kecil: item.foto_kecil
        ? `${API_IMAGE}/foto/banner/${item.foto_kecil}`
        : null,
      image: item.foto_besar
        ? `${API_IMAGE}/foto/banner/${item.foto_besar}`
        : null,
      status: item.status,
      status2: item.status2,
      tanggal: item.tanggal,
      waktu: item.waktu,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));

    return formatted;
  } catch (error) {
    return [];
  }
};

// Fetch banners by position
export const fetchBannersByPosition = async (position) => {
  try {
    const banners = await fetchBanners();

    // Filter by position permalink or position name
    const filtered = banners.filter(
      (banner) =>
        banner.permalink === position ||
        (banner.posbanner &&
          banner.posbanner.toLowerCase().includes(position.toLowerCase()))
    );

    return filtered;
  } catch (error) {
    return [];
  }
};

// Fetch static page content
export const fetchPageContent = async (pageName) => {
  try {
    const response = await fetch(`${API_URL}/pages/slug/${pageName}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch page content for ${pageName}`);
    }

    const data = await response.json();

    // Handle both single object and array responses
    const pageData = Array.isArray(data) ? data[0] : data;

    if (!pageData) {
      return null;
    }

    return pageData;
  } catch (error) {
    return null;
  }
};

// Specific page content fetchers
export const fetchTentangKami = async () => {
  return await fetchPageContent("tentang-kami");
};

export const fetchRedaksi = async () => {
  return await fetchPageContent("redaksi");
};

export const fetchPedoman = async () => {
  return await fetchPageContent("pedoman-media-sibers");
};

export const fetchDisclaimer = async () => {
  return await fetchPageContent("disclaimer");
};

export const fetchKontak = async () => {
  return await fetchPageContent("kontak");
};

// Fetch categories from the server
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/kategori`);
    if (!response.ok) throw new Error("Failed to fetch categories");
    const data = await response.json();

    // Format categories data
    const formatted = data.map((item) => ({
      id: item.id_kategori,
      nama: item.nama_kategori,
      permalink: item.permalink,
      pin: item.pin === 1 || item.pin === true, // Convert to boolean
      urutan: item.urutan || 0,
    }));

    // Sort by urutan (order)
    formatted.sort((a, b) => a.urutan - b.urutan);

    return formatted;
  } catch (error) {
    return [];
  }
};

// Fetch videos from the server
export const fetchVideos = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(
      `${API_URL}/video?halaman=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error("Failed to fetch videos");
    const result = await response.json();

    const data = result.data || [];
    const pagination = result.pagination || null;

    // Format video data
    const formatted = data.map((item) => ({
      id: item.id_video,
      url: item.url,
      created_at: item.created_at,
      updated_at: item.updated_at,
      tanggal: formatDate(
        item.created_at.split(" ")[0],
        item.created_at.split(" ")[1] || "00:00:00"
      ),
    }));

    return {
      videos: formatted,
      pagination: pagination,
    };
  } catch (error) {
    return { videos: [], pagination: null };
  }
};
