import { Component } from "react";
import { useNavigate } from "react-router-dom";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <svg
            className="w-24 h-24 mx-auto text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Terjadi Kesalahan
        </h1>
        <p className="text-gray-600 mb-6 text-lg">
          Maaf, terjadi kesalahan yang tidak terduga. Tim kami telah diberitahu
          dan sedang menangani masalah ini.
        </p>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === "development" && error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-left">
            <p className="font-mono text-sm text-red-800 wrap-break-word">
              {error.toString()}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-[#EE4339] text-white rounded-lg hover:bg-[#d63330] transition font-semibold"
          >
            Muat Ulang Halaman
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            Kembali ke Beranda
          </button>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-sm text-gray-500">
          Jika masalah terus berlanjut, silakan hubungi kami di{" "}
          <a
            href="mailto:redaksiruaumandiri@gmail.com"
            className="text-[#EE4339] hover:underline"
          >
            redaksiruaumandiri@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}

// Wrapper component to use hooks
function ErrorBoundaryWrapper({ children }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}

export default ErrorBoundaryWrapper;
