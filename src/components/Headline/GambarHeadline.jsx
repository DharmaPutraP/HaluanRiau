import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Tag from "../Tag";

function GambarHeadline({ data = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % data.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [data.length]);

  if (data.length === 0) return null;

  const currentItem = data[currentSlide];

  // Get first 10 words of description
  const shortDescription =
    currentItem.description.split(" ").slice(0, 10).join(" ") + "...";

  return (
    <div className="flex-initial md:border-x md:px-5 relative w-full md:w-7/12">
      <Link
        to={`/article/${currentItem.id}/${currentItem.url}`}
        className="relative overflow-hidden group cursor-pointer block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Images Container with Transition */}
        <div className="relative w-full aspect-video md:min-h-[400px] min-h-[250px]">
          {data.map((item, index) => (
            <img
              key={index}
              src={item.image}
              alt={item.judul}
              className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-700 ease-in-out ${
                currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-10"
              }`}
            />
          ))}
        </div>

        {/* Slider Dots - Top Right */}
        <div className="absolute top-4 right-4 flex gap-2 z-20">
          {data.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentSlide(index);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentSlide === index
                  ? "bg-[#EE4339] w-6"
                  : "bg-[#EE4339]/60 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Overlay with content - Bottom */}
        <div
          className={`absolute bottom-0 left-0 right-0 text-white p-3 md:p-4 transition-all duration-300 z-10 ease-in-out ${
            isHovered
              ? "bg-linear-to-t from-[#EE4339] via-[#EE4339]/95 to-transparent md:translate-y-0"
              : "bg-linear-to-t from-black/80 via-black/60 to-transparent translate-y-20 md:translate-y-15"
          }`}
        >
          <Tag
            judul={currentItem.tag}
            className="text-[10px] md:text-xs backdrop-blur-sm"
          />
          <h3 className="text-base md:text-lg font-bold mt-2 leading-tight md:leading-5 line-clamp-2">
            {currentItem.judul}
          </h3>

          {/* Short description - Only visible on hover */}
          <p
            className={`text-sm mt-3 transition-all duration-300 overflow-hidden${
              isHovered ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {shortDescription}
          </p>

          {/* Read more link */}
          <div
            className={`flex items-center text-md font-semibold mt-3 transition-all duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <span>Baca</span>
            <svg className="w-6 h-6 " fill="currentColor" viewBox="0 0 24 24">
              <path d="m11.293 17.293 1.414 1.414L19.414 12l-6.707-6.707-1.414 1.414L15.586 11H6v2h9.586z" />
            </svg>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default GambarHeadline;
