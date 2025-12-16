import { useEffect } from "react";

function BannerModal({ isOpen, onClose, imageUrl, imageAlt = "Banner" }) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-75 p-4"
      onClick={onClose}
    >
      <div className="relative max-w-6xl max-h-screen">
        <button
          className="absolute -top-10 right-0 text-white text-3xl font-bold hover:text-gray-300"
          onClick={onClose}
        >
          ×
        </button>
        <img
          src={imageUrl}
          alt={imageAlt}
          className="max-w-full max-h-screen object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}

export default BannerModal;
