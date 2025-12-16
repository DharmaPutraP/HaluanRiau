import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import VideoListPage from "./pages/VideoListPage";
import NotFoundPage from "./pages/NotFoundPage";
import TentangKami from "./pages/TentangKami";
import Redaksi from "./pages/Redaksi";
import Pedoman from "./pages/Pedoman";
import Disclaimer from "./pages/Disclaimer";
import Kontak from "./pages/Kontak";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="article/:id/:url" element={<ArticleDetailPage />} />
            <Route path="galeri/:id/:url" element={<ArticleDetailPage />} />
            <Route path="category/:category" element={<CategoryPage />} />
            <Route path="search/:query" element={<SearchPage />} />
            <Route path="videos" element={<VideoListPage />} />
            <Route path="tentang-kami" element={<TentangKami />} />
            <Route path="redaksi" element={<Redaksi />} />
            <Route path="pedoman" element={<Pedoman />} />
            <Route path="disclaimer" element={<Disclaimer />} />
            <Route path="kontak" element={<Kontak />} />
            {/* 404 - Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
