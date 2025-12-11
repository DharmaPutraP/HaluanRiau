import React, { useState, useEffect } from "react";
import Header from "./Header";
import { LAINNYA, DAERAH } from "../../utils/constants";

function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
          <img
            src="Logo.png"
            alt="Logo Haluan Riau"
            className={`transition-all duration-300 ${
              isScrolled ? "w-40" : "w-3xs"
            }`}
          />
        </div>

        <nav className="bg-white md:bg-[#EE4339] text-white md:px-24">
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
                <img src="Logo.png" alt="Logo Haluan Riau" className="h-8" />
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
              <div className="hidden md:flex items-center space-x-6">
                <a href="#" className="text-sm font-medium hover:text-gray-200">
                  NASIONAL
                </a>
                <a href="#" className="text-sm font-medium hover:text-gray-200">
                  EKONOMI
                </a>
                <a href="#" className="text-sm font-medium hover:text-gray-200">
                  POLITIK
                </a>
                <a href="#" className="text-sm font-medium hover:text-gray-200">
                  EKONOMI
                </a>

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
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-100 capitalize"
                        >
                          {item}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

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
                          href="#"
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
                <a href="#" className="text-sm font-medium hover:text-gray-200">
                  INDEKS BERITA +
                </a>

                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-white text-gray-800 rounded-full px-4 py-1 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        color="#EE4339"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Search Overlay */}
          {isSearchOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search and hit enter..."
                  className="w-full text-gray-800 border-b-2 border-[#EE4339] px-2 py-2 text-sm focus:outline-none"
                  autoFocus
                />
                <div className="text-[#EE4339] text-xs mt-2">
                  Masukkan Kata Kunci atau ESC Untuk Keluar
                </div>
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
                  href="#"
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
                  href="#"
                  className="block text-base font-medium py-3 border-b hover:text-[#EE4339]"
                >
                  KAMPAR
                </a>
                <a
                  href="#"
                  className="block text-base font-medium py-3 border-b hover:text-[#EE4339]"
                >
                  PELALAWAN
                </a>
                <a
                  href="#"
                  className="block text-base font-medium py-3 border-b hover:text-[#EE4339]"
                >
                  Pemilu 2024
                </a>
                <a
                  href="#"
                  className="block text-base font-medium py-3 border-b hover:text-[#EE4339]"
                >
                  Pilkada 2024
                </a>
                <a
                  href="#"
                  className="block text-base font-medium py-3 border-b hover:text-[#EE4339]"
                >
                  Mudik Lebaran 2024
                </a>
                <a
                  href="#"
                  className="block text-base font-medium py-3 border-b hover:text-[#EE4339]"
                >
                  Pendidikan
                </a>
                <a
                  href="#"
                  className="block text-base font-medium py-3 border-b hover:text-[#EE4339]"
                >
                  PEKANBARU
                </a>
                <a
                  href="#"
                  className="block text-base font-medium py-3 border-b hover:text-[#EE4339]"
                >
                  INFO HAJI 2025
                </a>
                <button className="flex items-center justify-between w-full text-base font-medium py-3 hover:text-[#EE4339]">
                  <span>More</span>
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
                </button>
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
