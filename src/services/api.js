const API_URL = import.meta.env.VITE_API_URL;

// Helper function to format API data to match our component structure
const formatArticleData = (apiData) => {
  return apiData.map((item) => ({
    id: item.id_berita,
    judul: item.judul_berita,
    tag: getCategoryName(item.id_kategori),
    tanggal: formatDate(item.tanggal, item.waktu),
    lastUpdated: formatLastUpdated(item.updated_at),
    description: stripHtml(item.isi).substring(0, 200) + "...",
    gambar: item.gambar ? `${API_URL}/uploads/${item.gambar}` : "/image.png",
    image: item.gambar ? `${API_URL}/uploads/${item.gambar}` : "/image.png",
    foto_kecil: item.foto_kecil
      ? `${API_URL}/uploads/${item.foto_kecil}`
      : "/image.png",
    ket_foto: item.ket_foto || "",
    reporter: item.reporter || "Redaksi",
    penulis: item.penulis || item.warta || "Redaksi",
    counter: item.counter || 0,
    timesRead: item.counter || 0,
    url: item.url,
    isi: item.isi,
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

// Get category name from ID
const getCategoryName = (id) => {
  const categories = {
    1: "Nasional",
    2: "Riau",
    3: "Politik",
    4: "Hukum",
    5: "Ekonomi",
    6: "Olahraga",
    7: "Budaya",
    8: "Teknologi",
    // Add more categories as needed
  };
  return categories[id] || "Berita";
};

// Fetch functions for each endpoint
export const fetchHeadlines = async () => {
  try {
    const response = await fetch(`${API_URL}/headline`);
    if (!response.ok) throw new Error("Failed to fetch headlines");
    const data = await response.json();
    return formatArticleData(data);
  } catch (error) {
    console.error("Error fetching headlines:", error);
    return [];
  }
};

export const fetchPilihanEditor = async () => {
  try {
    const response = await fetch(`${API_URL}/pilihaneditor`);
    if (!response.ok) throw new Error("Failed to fetch pilihan editor");
    const data = await response.json();
    return formatArticleData(data);
  } catch (error) {
    console.error("Error fetching pilihan editor:", error);
    return [];
  }
};

export const fetchBeritaTerkini = async () => {
  try {
    const response = await fetch(`${API_URL}/berita-terkini`);
    if (!response.ok) throw new Error("Failed to fetch berita terkini");
    const data = await response.json();
    return formatArticleData(data);
  } catch (error) {
    console.error("Error fetching berita terkini:", error);
    return [];
  }
};

export const fetchTerpopuler = async () => {
  try {
    const response = await fetch(`${API_URL}/terpopuler`);
    if (!response.ok) throw new Error("Failed to fetch terpopuler");
    const data = await response.json();
    return formatArticleData(data);
  } catch (error) {
    console.error("Error fetching terpopuler:", error);
    return [];
  }
};

export const fetchGagasan = async () => {
  try {
    const response = await fetch(`${API_URL}/gagasan`);
    if (!response.ok) throw new Error("Failed to fetch gagasan");
    const data = await response.json();
    return formatArticleData(data);
  } catch (error) {
    console.error("Error fetching gagasan:", error);
    return [];
  }
};

export const fetchRiau = async () => {
  try {
    const response = await fetch(`${API_URL}/riau`);
    if (!response.ok) throw new Error("Failed to fetch riau");
    const data = await response.json();
    return formatArticleData(data);
  } catch (error) {
    console.error("Error fetching riau:", error);
    return [];
  }
};

export const fetchNasional = async () => {
  try {
    const response = await fetch(`${API_URL}/nasional`);
    if (!response.ok) throw new Error("Failed to fetch nasional");
    const data = await response.json();
    return formatArticleData(data);
  } catch (error) {
    console.error("Error fetching nasional:", error);
    return [];
  }
};

export const fetchTipsKesehatan = async () => {
  try {
    const response = await fetch(`${API_URL}/tips-kesehatan`);
    if (!response.ok) throw new Error("Failed to fetch tips kesehatan");
    const data = await response.json();
    return formatArticleData(data);
  } catch (error) {
    console.error("Error fetching tips kesehatan:", error);
    return [];
  }
};

export const fetchAdvertorial = async () => {
  try {
    const response = await fetch(`${API_URL}/advertorial`);
    if (!response.ok) throw new Error("Failed to fetch advertorial");
    const data = await response.json();
    return formatArticleData(data);
  } catch (error) {
    console.error("Error fetching advertorial:", error);
    return [];
  }
};

export const fetchGaleri = async () => {
  try {
    const response = await fetch(`${API_URL}/galeri`);
    if (!response.ok) throw new Error("Failed to fetch galeri");
    const data = await response.json();
    return formatArticleData(data);
  } catch (error) {
    console.error("Error fetching galeri:", error);
    return [];
  }
};

export const fetchArticleById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/berita/${id}`);
    if (!response.ok) throw new Error("Failed to fetch article");
    const data = await response.json();
    return formatArticleData([data])[0];
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
};

export const fetchArticleByUrl = async (url) => {
  try {
    const response = await fetch(`${API_URL}/berita/url/${url}`);
    if (!response.ok) throw new Error("Failed to fetch article");
    const data = await response.json();
    return formatArticleData([data])[0];
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
};

// Generic fetch function for category pages
export const fetchByCategory = async (category) => {
  const endpointMap = {
    headline: fetchHeadlines,
    "pilihan-editor": fetchPilihanEditor,
    "berita-terkini": fetchBeritaTerkini,
    "indeks-berita": fetchHeadlines,
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
    return await fetchFunction();
  }

  // If not in map, try generic category endpoint
  try {
    const response = await fetch(`${API_URL}/${category}`);
    if (!response.ok) throw new Error(`Failed to fetch ${category}`);
    const data = await response.json();
    return formatArticleData(data);
  } catch (error) {
    console.error(`Error fetching ${category}:`, error);
    return [];
  }
};
