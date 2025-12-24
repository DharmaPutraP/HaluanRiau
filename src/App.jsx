import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import { trackPageView } from "./utils/analytics";
import MainLayout from "./layouts/MainLayout";

// Lazy load pages for better performance
const HomePage = lazy(() => import("./pages/HomePage"));
const ArticleDetailPage = lazy(() => import("./pages/ArticleDetailPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const VideoListPage = lazy(() => import("./pages/VideoListPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const TentangKami = lazy(() => import("./pages/TentangKami"));
const Redaksi = lazy(() => import("./pages/Redaksi"));
const Pedoman = lazy(() => import("./pages/Pedoman"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const Kontak = lazy(() => import("./pages/Kontak"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="mt-4 text-gray-600">Memuat...</p>
    </div>
  </div>
);

// Component to track page views on route changes
function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <RouteTracker />
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
