import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { LAINNYA, DAERAH } from "../../utils/constants";

function Navbar() {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDesktopSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsMobileMenuOpen(false);
  };

  const handleDesktopSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsDesktopSearchOpen(false);
    }
  };

  const handleMobileSearch = (e) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      navigate(`/search/${encodeURIComponent(mobileSearchQuery.trim())}`);
      setMobileSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      {/* Fixed container for navbar */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
          isScrolled ? "shadow-md" : ""
        }`}
      >
        {/* Header at the top */}
        <Header />

        {/* Desktop Logo - Centered and shrinks on scroll */}
        <div
          className={`hidden md:flex flex-row justify-center transition-all duration-300 ${
            isScrolled ? "py-2" : "py-5"
          }`}
        >
          <a href="/">
            {isScrolled ? (
              <img
                src="/LogoScroll.png"
                alt="Logo Haluan Riau"
                className={`transition-all duration-300 w-40 h-auto}`}
              />
            ) : (
              <img
                src="/logoBesar.png"
                alt="Logo Haluan Riau"
                className={`transition-all duration-300 w-3xs`}
              />
            )}
          </a>
        </div>

        <nav className="bg-white md:bg-primary text-white md:px-24">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-12 md:h-12">
              {/* Mobile: Hamburger Icon */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden text-white p-2"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                      color="#EE4339"
                    />
                  )}
                </svg>
              </button>

              {/* Mobile: Center Logo */}
              <div className="md:hidden flex-1 flex justify-center">
                <img
                  src="/logoBesar.png"
                  alt="Logo Haluan Riau"
                  className="h-8"
                />
              </div>

              {/* Mobile: Search Icon */}
              <button
                onClick={toggleSearch}
                className="md:hidden text-white p-2"
                aria-label="Toggle search"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isSearchOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      color="#EE4339"
                    />
                  )}
                </svg>
              </button>

              {/* Desktop Left Navigation */}
              <div
                className="hidden md:flex items-center space-x-6"
                ref={dropdownRef}
              >
                <a
                  href="/category/nasional"
                  className="text-sm font-medium hover:text-gray-200"
                >
                  NASIONAL
                </a>
                <a
                  href="/category/ekonomi"
                  className="text-sm font-medium hover:text-gray-200"
                >
                  EKONOMI
                </a>
                <a
                  href="/category/politik"
                  className="text-sm font-medium hover:text-gray-200"
                >
                  POLITIK
                </a>
                <a
                  href="/category/olahraga"
                  className="text-sm font-medium hover:text-gray-200"
                >
                  OLAHRAGA
                </a>
                {/* DAERAH Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown("daerah")}
                    className="text-sm font-medium hover:text-gray-200 flex items-center space-x-1"
                  >
                    <span>DAERAH</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        openDropdown === "daerah" ? "rotate-180" : ""
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
                  {openDropdown === "daerah" && (
                    <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded shadow-lg py-2 min-w-[150px] z-50">
                      {DAERAH.map((item, index) => (
                        <a
                          key={index}
                          href={`/category/${item
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className="block px-4 py-2 hover:bg-gray-100 capitalize"
                        >
                          {item}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* LAINNYA Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown("lainnya")}
                    className="text-sm font-medium hover:text-gray-200 flex items-center space-x-1"
                  >
                    <span>LAINNYA</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        openDropdown === "lainnya" ? "rotate-180" : ""
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
                  {openDropdown === "lainnya" && (
                    <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded shadow-lg py-2 min-w-[150px] z-50">
                      {LAINNYA.map((item, index) => (
                        <a
                          key={index}
                          href={`/category/${item
                            .toLowerCase()
                            .replace(/[\s&]+/g, "-")}`}
                          className="block px-4 py-2 hover:bg-gray-100 capitalize"
                        >
                          {item}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Desktop Right Side - Ticker & Search */}
              <div className="hidden md:flex items-center space-x-4">
                <a
                  href="/category/indeks-berita"
                  className="text-sm font-medium hover:text-gray-200"
                >
                  INDEKS BERITA +
                </a>

                {/* Animated Search Bar */}
                <form
                  onSubmit={handleDesktopSearch}
                  className="relative flex items-center"
                  ref={searchRef}
                >
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isDesktopSearchOpen ? "w-64 opacity-100" : "w-0 opacity-0"
                    }`}
                  >
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="text-black placeholder-black rounded-full px-4 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-white/50 bg-[#EEC823]"
                      autoFocus={isDesktopSearchOpen}
                    />
                  </div>
                  <button
                    type={isDesktopSearchOpen ? "submit" : "button"}
                    onClick={() =>
                      !isDesktopSearchOpen && setIsDesktopSearchOpen(true)
                    }
                    className={`flex items-center justify-center transition-all duration-300 ${
                      isDesktopSearchOpen ? "ml-2" : "ml-0"
                    }`}
                  >
                    <svg
                      className="w-6 h-6 text-white hover:text-gray-200 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Mobile Search Overlay */}
          {isSearchOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3">
              <form onSubmit={handleMobileSearch} className="relative">
                <input
                  type="text"
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  placeholder="Search and hit enter..."
                  className="w-full text-gray-800 border-b-2 border-[#383BCF] px-2 py-2 text-sm focus:outline-none bg-[#EEC823]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-0 top-1/2 -translate-y-1/2"
                >
                  <svg
                    className="w-6 h-6 text-[#EE4339]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </form>
              <div className="text-[#EE4339] text-xs mt-2">
                Masukkan Kata Kunci atau ESC Untuk Keluar
              </div>
            </div>
          )}

          {/* Mobile Side Menu */}
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity md:hidden ${
              isMobileMenuOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
            onClick={toggleMobileMenu}
          >
            <div
              className={`fixed left-0 top-0 h-full w-64 bg-white text-gray-800 transform transition-transform ${
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4">
                <a
                  href="/"
                  className="flex items-center text-lg font-medium py-3 border-b hover:text-[#EE4339]"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Home
                </a>
                <a
                  href="/category/kampar"
                  className="block text-base font-medium py-3 border-b hover:text-[#EE4339]"
                >
                  KAMPAR
                </a>
                <a
                  href="/category/pelalawan"
                  className="block text-base font-medium py-3 border-b hover:text-[#EE4339]"
                >
                  PELALAWAN
                </a>
                <a
                  href="/category/pemilu-2024"
                  className="block text-base font-medium py-3 border-b hover:text-[#EE4339]"
                >
                  Pemilu 2024
                </a>
                <a
                  href="/category/pilkada-2024"
                  className="block text-base font-medium py-3 border-b hover:text-[#EE4339]"
                >
                  Pilkada 2024
                </a>
                <a
                  href="/category/mudik-lebaran-2024"
                  className="block text-base font-medium py-3 border-b hover:text-[#EE4339]"
                >
                  Mudik Lebaran 2024
                </a>
                <a
                  href="/category/pendidikan"
                  className="block text-base font-medium py-3 border-b hover:text-[#EE4339]"
                >
                  Pendidikan
                </a>
                <a
                  href="/category/pekanbaru"
                  className="block text-base font-medium py-3 border-b hover:text-[#EE4339]"
                >
                  PEKANBARU
                </a>
                <a
                  href="/category/info-haji-2025"
                  className="block text-base font-medium py-3 border-b hover:text-[#EE4339]"
                >
                  INFO HAJI 2025
                </a>
                <a
                  href="/category/headline"
                  className="flex items-center justify-between w-full text-base font-medium py-3 hover:text-[#EE4339]"
                >
                  <span>Semua Berita</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div
        className={`transition-all duration-300 ${
          isScrolled ? "h-20" : "h-14 md:h-45"
        }`}
      ></div>
    </>
  );
}

export default Navbar;
