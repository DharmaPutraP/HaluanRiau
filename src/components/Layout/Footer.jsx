import { useState, useEffect, useRef } from "react";
import { fetchCategories } from "../../services/api";
import { DAERAH } from "../../utils/constants";

function Footer() {
  const [categories, setCategories] = useState([]);
  const [overflowCategories, setOverflowCategories] = useState([]);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const archiveRef = useRef(null);

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    loadCategories();
  }, []);

  // Calculate overflow categories (non-daerah, unpinned categories)
  useEffect(() => {
    if (categories.length === 0) return;

    const nonDaerahCategories = categories.filter(
      (cat) =>
        !DAERAH.includes(cat.nama?.toLowerCase() || "") &&
        !DAERAH.includes(cat.permalink?.toLowerCase() || "")
    );

    const pinnedCategories = nonDaerahCategories.filter((cat) => cat.pin);
    const unpinnedCategories = nonDaerahCategories.filter((cat) => !cat.pin);

    // Overflow includes unpinned categories
    setOverflowCategories(unpinnedCategories);
  }, [categories]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (archiveRef.current && !archiveRef.current.contains(event.target)) {
        setIsArchiveOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getYear = () => {
    return new Date().getFullYear();
  };
  return (
    <footer className="bg-white border-t border-gray-300 mt-2">
      {/* Responsive container with proper padding for all screen sizes */}
      <div className="max-w-7xl mx-auto py-6 sm:py-8 md:py-10 lg:py-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 md:gap-8 lg:gap-10">
          {/* Left Section - Logo and Social Media */}
          <div className="flex flex-col items-center sm:items-start lg:pr-4">
            <img
              src="/logoBesar.png"
              alt="Riau Mandiri Logo"
              className="w-40 sm:w-48 md:w-52 lg:w-56 xl:w-64 mb-4 md:mb-5"
            />

            {/* Social Media Icons */}
            <div className="flex gap-2.5 sm:gap-3 mb-4 md:mb-5">
              <a
                href="#"
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-400 rounded hover:bg-gray-200 hover:border-gray-600 transition-all duration-200"
                aria-label="Instagram"
              >
                <img
                  src="/instagramIcon.png"
                  alt="Instagram"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
              </a>
              <a
                href="#"
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-400 rounded hover:bg-gray-200 hover:border-gray-600 transition-all duration-200"
                aria-label="X/Twitter"
              >
                <img
                  src="/xIcon.png"
                  alt="X/Twitter"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
              </a>
              <a
                href="#"
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-400 rounded hover:bg-gray-200 hover:border-gray-600 transition-all duration-200"
                aria-label="Facebook"
              >
                <img
                  src="/facebookIcon.png"
                  alt="Facebook"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
              </a>
              <a
                href="#"
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-400 rounded hover:bg-gray-200 hover:border-gray-600 transition-all duration-200"
                aria-label="Google Plus"
              >
                <img
                  src="/gPlusIcon.png"
                  alt="Google Plus"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
              </a>
            </div>

            {/* Copyright */}
            <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left max-w-xs">
              Copyright © 2014-{getYear()} Riaumandiri.co - All Rights Reserved.
            </p>
          </div>

          {/* Middle Section - Navigasi */}
          <div className="text-center sm:text-left sm:pl-6 lg:pl-8 sm:border-l-2 sm:border-gray-300">
            <h3 className="font-bold text-base sm:text-lg md:text-xl mb-3 md:mb-4 text-gray-800">
              NAVIGASI
            </h3>
            <ul className="space-y-2 sm:space-y-2.5 text-sm sm:text-base text-gray-700">
              <li>
                <a
                  href="/tentang-kami"
                  className="hover:text-[#EE4339] transition-colors duration-200"
                >
                  TENTANG KAMI
                </a>
              </li>
              <li>
                <a
                  href="/redaksi"
                  className="hover:text-[#EE4339] transition-colors duration-200"
                >
                  REDAKSI
                </a>
              </li>
              <li>
                <a
                  href="/pedoman"
                  className="hover:text-[#EE4339] transition-colors duration-200"
                >
                  PEDOMAN
                </a>
              </li>
              <li>
                <a
                  href="/disclaimer"
                  className="hover:text-[#EE4339] transition-colors duration-200"
                >
                  DISCLAIMER
                </a>
              </li>
              <li>
                <a
                  href="/kontak"
                  className="hover:text-[#EE4339] transition-colors duration-200"
                >
                  KONTAK
                </a>
              </li>
            </ul>
          </div>

          {/* Middle-Right Section - Kanal */}
          <div className="text-center sm:text-left sm:pl-6 lg:pl-8 sm:border-l-2 lg:border-l sm:border-gray-300">
            <h3 className="font-bold text-base sm:text-lg md:text-xl mb-3 md:mb-4 text-gray-800">
              KANAL
            </h3>
            <ul className="space-y-2 sm:space-y-2.5 text-sm sm:text-base text-gray-700">
              <li>
                <a
                  href="/category/zonariau"
                  className="hover:text-[#EE4339] transition-colors duration-200"
                >
                  RIAU
                </a>
              </li>

              <li>
                <a
                  href="/category/politik"
                  className="hover:text-[#EE4339] transition-colors duration-200"
                >
                  POLITIK
                </a>
              </li>
              <li>
                <a
                  href="/category/ekonomi"
                  className="hover:text-[#EE4339] transition-colors duration-200"
                >
                  EKONOMI
                </a>
              </li>
              <li>
                <a
                  href="/category/olahraga"
                  className="hover:text-[#EE4339] transition-colors duration-200"
                >
                  OLAHRAGA
                </a>
              </li>
              <li>
                <a
                  href="/category/teknologi"
                  className="hover:text-[#EE4339] transition-colors duration-200"
                >
                  TEKNOLOGI
                </a>
              </li>
              <li className="relative">
                <button
                  onClick={() => setIsArchiveOpen(!isArchiveOpen)}
                  className="hover:text-[#EE4339] transition-colors duration-200 inline-flex items-center gap-1 justify-center sm:justify-start w-full sm:w-auto"
                  ref={archiveRef}
                >
                  ARCHIVE
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isArchiveOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {isArchiveOpen && overflowCategories.length > 0 && (
                  <div className="absolute left-1/2 sm:left-0 -translate-x-1/2 sm:translate-x-0 bottom-full mb-2 bg-white border border-gray-300 rounded shadow-lg py-2 min-w-[180px] z-50 max-h-80 overflow-y-auto">
                    {overflowCategories.map((category) => (
                      <a
                        key={category.id}
                        href={`/category/${category.permalink}`}
                        className="block px-4 py-2 hover:bg-gray-100 text-gray-700 capitalize transition-colors duration-200"
                      >
                        {category.nama}
                      </a>
                    ))}
                  </div>
                )}
              </li>
            </ul>
          </div>

          {/* Right Section - Kontak */}
          <div className="text-center sm:text-left sm:pl-6 lg:pl-8 sm:border-l-2 lg:border-l sm:border-gray-300">
            <h3 className="font-bold text-base sm:text-lg md:text-xl mb-3 md:mb-4 text-gray-800">
              KONTAK
            </h3>
            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-gray-700">
              <li className="flex items-start gap-2 justify-center sm:justify-start">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-left max-w-xs">
                  Perum Riau Pers Jl.Tuanku Tambusai No.7 Pekanbaru, Riau
                  Indonesia.
                </span>
              </li>
              <li className="flex items-center gap-2 justify-center sm:justify-start">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="break-all">redaksiriaumandiri@gmail.com</span>
              </li>
              <li className="flex items-center gap-2 justify-center sm:justify-start">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>+62818-610-922</span>
              </li>
              <li className="flex items-center gap-2 justify-center sm:justify-start">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                <span>www.Riaumandiri.co</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
