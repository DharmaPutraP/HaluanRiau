import { useEffect } from "react";

function BannerModal({
  isOpen,
  onClose,
  imageUrl,
  imageAlt = "Banner",
  keterangan,
}) {
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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-2 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div className="relative w-full h-full max-w-6xl flex items-center justify-center">
        {keterangan ? (
          <a href={keterangan} target="_blank">
            <img
              src={imageUrl}
              alt={imageAlt}
              className="max-w-full max-h-[90vh] sm:max-h-[85vh] md:max-h-screen w-auto h-auto object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </a>
        ) : (
          <img
            src={imageUrl}
            alt={imageAlt}
            className="max-w-full max-h-[90vh] sm:max-h-[85vh] md:max-h-screen w-auto h-auto object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>
    </div>
  );
}

export default BannerModal;
