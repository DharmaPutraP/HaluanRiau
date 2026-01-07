// scripts/generate-sitemap.js
// Script untuk generate sitemap.xml otomatis dari API artikel

const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const SITE_URL = "https://riaumandiri.co";
const API_URL = process.env.VITE_API_URL || "https://assets.riaumandiri.co";
const SITEMAP_PATH = path.join(__dirname, "../dist/sitemap.xml");

async function fetchArticles() {
  // Ganti endpoint sesuai API Anda
  const res = await fetch(`${API_URL}/berita?halaman=1&limit=1000`);
  const json = await res.json();
  return json.data || [];
}

function buildSitemap(articles) {
  const urls = articles.map(
    (article) =>
      `  <url>\n    <loc>${SITE_URL}/article/${article.id_berita}/${
        article.url
      }</loc>\n    <lastmod>${new Date(
        article.tanggal
      ).toISOString()}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>`
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${SITE_URL}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n${urls.join(
    "\n"
  )}\n</urlset>\n`;
}

async function main() {
  const articles = await fetchArticles();
  const sitemap = buildSitemap(articles);
  fs.writeFileSync(SITEMAP_PATH, sitemap, "utf-8");
  console.log("Sitemap generated:", SITEMAP_PATH);
}

main();
