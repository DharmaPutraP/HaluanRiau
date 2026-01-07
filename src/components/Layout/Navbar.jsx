import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { fetchCategories } from "../../services/api";
import { DAERAH } from "../../utils/constants";

function Navbar() {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [visibleCategories, setVisibleCategories] = useState([]);
  const [overflowCategories, setOverflowCategories] = useState([]);
  const [allPinnedCategories, setAllPinnedCategories] = useState([]);
  const [mobileOpenAccordion, setMobileOpenAccordion] = useState(null);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const navRef = useRef(null);

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    loadCategories();
  }, []);

  // Calculate which categories fit in the navbar
  useEffect(() => {
    const calculateVisibleCategories = () => {
      if (!navRef.current || categories.length === 0) return;

      // Get pinned and unpinned categories, excluding daerah categories
      const nonDaerahCategories = categories.filter(
        (cat) =>
          !DAERAH.includes(cat.nama?.toLowerCase() || "") &&
          !DAERAH.includes(cat.permalink?.toLowerCase() || "")
      );

      const pinnedCategories = nonDaerahCategories.filter((cat) => cat.pin);
      const unpinnedCategories = nonDaerahCategories.filter((cat) => !cat.pin);

      // Store all pinned categories for mobile
      setAllPinnedCategories(pinnedCategories);

      // Get available width for navigation items
      const navWidth = navRef.current.offsetWidth;
      const rightSideWidth = 250; // Approximate width for "INDEKS BERITA +" and search
      const daerahDropdownWidth = 120; // Width for DAERAH dropdown
      const availableWidth =
        navWidth - rightSideWidth - daerahDropdownWidth - 100; // 100px buffer

      // Measure each category width (approximate: 8-10 chars * 8px + 48px padding)
      const estimateCategoryWidth = (name) => {
        return name.length * 8 + 48; // approximate width
      };

      let currentWidth = 0;
      const visible = [];
      const overflow = [];

      // Try to fit pinned categories
      for (const cat of pinnedCategories) {
        const catWidth = estimateCategoryWidth(cat.nama);
        if (currentWidth + catWidth < availableWidth) {
          visible.push(cat);
          currentWidth += catWidth;
        } else {
          overflow.push(cat);
        }
      }

      // Add unpinned categories to overflow
      const nonArchiveCategories = unpinnedCategories.filter(
        (cat) => !cat.archive
      );
      overflow.push(...nonArchiveCategories);

      setVisibleCategories(visible);
      setOverflowCategories(overflow);
    };

    calculateVisibleCategories();

    // Recalculate on window resize
    const handleResize = () => {
      calculateVisibleCategories();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [categories]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDesktopSearchOpen(false);
      }
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
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
    setMobileOpenAccordion(null); // Reset accordion when closing menu
  };

  const toggleMobileAccordion = (section) => {
    setMobileOpenAccordion(mobileOpenAccordion === section ? null : section);
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
        className={`fixed top-0 left-0 right-0 z-100 bg-white transition-all duration-300 ${
          isScrolled ? "shadow-md" : ""
        }`}
      >
        {/* Header at the top */}
        <Header />

        {/* Desktop Logo - Centered and shrinks on scroll */}
        <div
          className={`hidden md:flex flex-row justify-center items-center transition-all duration-300 ${
            isScrolled ? "py-2" : "py-5"
          }`}
        >
          <a href="/">
            {isScrolled ? (
              <div className="flex justify-center items-center space-x-4">
                <img
                  src="/LogoScroll.png"
                  alt="Logo Haluan Riau"
                  className={`transition-all duration-300 w-40 h-auto}`}
                />
              </div>
            ) : (
              <div className="flex justify-center items-center space-x-4">
                <img
                  src="/logoBesar.png"
                  alt="Logo Haluan Riau"
                  className={`transition-all duration-300 w-3xs`}
                />
              </div>
            )}
          </a>
        </div>

        <nav
          className="bg-white md:bg-primary text-white md:px-24"
          ref={navRef}
        >
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
                <a href="/">
                  <img
                    src="/logoBesar.png"
                    alt="Logo Haluan Riau"
                    className="h-8"
                  />
                </a>
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
                {/* Dynamic Visible Categories */}
                {visibleCategories.map((category) => (
                  <a
                    key={category.id}
                    href={`/category/${category.permalink}`}
                    className="text-sm font-medium hover:text-gray-200 whitespace-nowrap"
                  >
                    {category.nama.toUpperCase()}
                  </a>
                ))}

                {/* DAERAH Dropdown - Always visible */}
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
                    <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded shadow-lg py-2 min-w-[180px] z-50 max-h-96 overflow-y-auto">
                      {DAERAH.map((daerah, index) => (
                        <a
                          key={index}
                          href={`/category/${daerah
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className="block px-4 py-2 hover:bg-gray-100 capitalize"
                        >
                          {daerah}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* LAINNYA Dropdown - only show if there are overflow categories */}
                {overflowCategories.length > 0 && (
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
                      <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded shadow-lg py-2 min-w-[150px] z-50 max-h-96 overflow-y-auto">
                        {overflowCategories.map((category) => (
                          <a
                            key={category.id}
                            href={`/category/${category.permalink}`}
                            className="block px-4 py-2 hover:bg-gray-100 capitalize"
                          >
                            {category.nama}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
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
            <div
              className="md:hidden bg-white border-t border-gray-200 px-4 py-3"
              ref={mobileSearchRef}
            >
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
                Masukkan Kata Kunci
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
              className={`fixed left-0 top-0 h-full w-80 bg-white text-gray-800 transform transition-transform overflow-y-auto ${
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Menu Mobile */}
              <div className="sticky top-0 bg-gradient-to-r bg-primary text-white p-4 flex items-center justify-between shadow-md">
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  <span className="text-lg font-bold">Menu</span>
                </div>
                <button
                  onClick={toggleMobileMenu}
                  className="hover:bg-white/20 rounded-full p-1 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-4">
                {/* Home Link */}
                <a
                  href="/"
                  className="block text-base font-semibold py-3 px-3 rounded-lg hover:bg-gray-100 transition-colors border-b border-gray-200"
                >
                  Beranda
                </a>

                {/* Pinned Categories */}
                {allPinnedCategories.map((category) => (
                  <a
                    key={category.id}
                    href={`/category/${category.permalink}`}
                    className="block text-base font-medium py-3 px-3 rounded-lg hover:bg-gray-100 transition-colors uppercase border-b border-gray-200"
                  >
                    {category.nama}
                  </a>
                ))}

                {/* DAERAH Dropdown */}
                <div className="border-b border-gray-200">
                  <button
                    onClick={() => toggleMobileAccordion("daerah")}
                    className="flex items-center justify-between w-full text-base font-semibold py-3 px-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span>DAERAH</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        mobileOpenAccordion === "daerah" ? "rotate-180" : ""
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
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      mobileOpenAccordion === "daerah"
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pl-6 pr-3 py-2 space-y-1 bg-gray-50 max-h-80 overflow-y-auto">
                      {DAERAH.map((daerah, index) => (
                        <a
                          key={index}
                          href={`/category/${daerah
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className="block text-sm py-2 px-3 rounded hover:bg-gray-200 capitalize transition-colors"
                        >
                          {daerah}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* LAINNYA Dropdown */}
                {overflowCategories.length > 0 && (
                  <div className="border-b border-gray-200">
                    <button
                      onClick={() => toggleMobileAccordion("lainnya")}
                      className="flex items-center justify-between w-full text-base font-semibold py-3 px-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span>LAINNYA</span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          mobileOpenAccordion === "lainnya" ? "rotate-180" : ""
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
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        mobileOpenAccordion === "lainnya"
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="pl-6 pr-3 py-2 space-y-1 bg-gray-50 max-h-80 overflow-y-auto">
                        {overflowCategories.map((category) => (
                          <a
                            key={category.id}
                            href={`/category/${category.permalink}`}
                            className="block text-sm py-2 px-3 rounded hover:bg-gray-200 capitalize transition-colors"
                          >
                            {category.nama}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Indeks Berita */}
                <div className="border-b border-gray-200">
                  <a
                    href="/category/indeks-berita"
                    className="flex items-center justify-between w-full text-base font-semibold py-3 px-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span>INDEKS BERITA +</span>
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
