function Footer() {
  return (
    <footer className="bg-white border-t border-gray-300 mt-2 py-8 px-5 md:px-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Section - Logo and Social Media */}
        <div className="flex flex-col justify-center">
          <img src="Logo.png" alt="Riau Mandiri Logo" className="w-64 mb-4" />

          {/* Social Media Icons */}
          <div className="flex gap-3 mb-4">
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center border border-gray-400 rounded hover:bg-gray-200 transition"
            >
              <img
                src="instagramIcon.png"
                alt="Instagram"
                className="w-6 h-6"
              />
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center border border-gray-400 rounded hover:bg-gray-200 transition"
            >
              <img src="xIcon.png" alt="X/Twitter" className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center border border-gray-400 rounded hover:bg-gray-200 transition"
            >
              <img src="facebookIcon.png" alt="Facebook" className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center border border-gray-400 rounded hover:bg-gray-200 transition"
            >
              <img src="gPlusIcon.png" alt="Google Plus" className="w-6 h-6" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-xs text-gray-600 w-fit">
            Copyright © 2014-2021 Riaumandiri.co - All Rights Reserved.
          </p>
        </div>

        {/* Middle Section - Navigasi */}
        <div className="ps-10 border-s-2">
          <h3 className="font-bold text-lg mb-4">NAVIGASI</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <a href="#" className="hover:text-[#EE4339]">
                TENTANG KAMI
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#EE4339]">
                REDAKSI
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#EE4339]">
                PEDOMAN
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#EE4339]">
                DISCLAIMER
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#EE4339]">
                KONTAK
              </a>
            </li>
          </ul>
        </div>

        {/* Middle-Right Section - Kanal */}
        <div className="ps-10  border-s border-gray-300">
          <h3 className="font-bold text-lg mb-4">KANAL</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <a href="#" className="hover:text-[#EE4339]">
                LOKAL
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#EE4339]">
                NASIONAL
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#EE4339]">
                POLITIK
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#EE4339]">
                EKONOMI
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#EE4339]">
                KRIMINAL
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#EE4339]">
                TEKNOLOGI
              </a>
            </li>
            <li>
              <button className="hover:text-[#EE4339] flex items-center">
                MORE
                <svg
                  className="w-4 h-4 ml-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </div>

        {/* Right Section - Kontak (hidden on mobile in original, but showing for better UX) */}
        <div className="md:block ps-10 border-s border-gray-300 ">
          <h3 className="font-bold text-lg mb-4">KONTAK</h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-gray-600 shrink-0 mt-0.5"
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
              <span>
                Perum Riau Pers Jl.Tuanku Tambusai No.7 Pekanbaru, Riau
                Indonesia.
              </span>
            </li>
            <li className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-600 shrink-0"
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
              <span>redaksiriaumandiri@gmail.com</span>
            </li>
            <li className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-600 shrink-0"
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
            <li className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-600 shrink-0"
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
    </footer>
  );
}

export default Footer;
