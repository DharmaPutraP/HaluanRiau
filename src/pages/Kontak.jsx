import React from "react";
import { useState, useEffect } from "react";
import { fetchKontak } from "../services/api";

function Kontak() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadKontak = async () => {
      try {
        setLoading(true);
        const data = await fetchKontak();
        console.log("Kontak Content:", data);
        setPageData(data);
      } catch (error) {
        console.error("Error loading Kontak:", error);
      } finally {
        setLoading(false);
      }
    };
    loadKontak();
  }, []);

  return (
    <div className="w-full px-2 sm:px-4 ">
      <div className="bg-white px-3 sm:px-4 md:px-10 py-4 sm:py-6 md:py-8 mt-2">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : pageData ? (
          <>
            <div
              className="prose prose-sm md:prose-base max-w-none"
              dangerouslySetInnerHTML={{ __html: pageData.content }}
            />
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">Konten tidak tersedia</p>
          </div>
        )}
        {/* Header */}
        {/* <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-gray-900 border-b-4 border-primary pb-3">
          Hubungi Kami
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-primary"
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
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  Alamat Redaksi
                </h3>
                <p className="text-gray-700">
                  Gedung Riau Pers
                  <br />
                  Jl. Tuanku Tambusai No. 7<br />
                  Pekanbaru, Riau, Indonesia
                  <br />
                  <span className="font-semibold">28282</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-primary"
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
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  Telepon
                </h3>
                <a
                  href="tel:0818610922"
                  className="text-primary hover:underline text-lg font-medium"
                >
                  0818-610-922
                </a>
                <p className="text-gray-600 text-sm mt-1">Pengaduan</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-primary"
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
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Email</h3>
                <a
                  href="mailto:redaksiriaumandiri@gmail.com"
                  className="text-primary hover:underline text-lg font-medium break-all"
                >
                  redaksiriaumandiri@gmail.com
                </a>
                <p className="text-gray-600 text-sm mt-1">Email Redaksi</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-primary"
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
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  Website
                </h3>
                <a
                  href="https://riaumandiri.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-lg font-medium"
                >
                  riaumandiri.co
                </a>
                <p className="text-gray-600 text-sm mt-1">Portal Berita Riau</p>
              </div>
            </div>
          </div>
        </div> */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
          <h3 className="font-bold text-xl text-gray-900 mb-4">Lokasi Kami</h3>
          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.6638508695833!2d101.42891927480248!3d0.5041778994908851!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5a94d05270857%3A0x2db841d2c56789ae!2sHaluan%20Riau!5e0!3m2!1sid!2sid!4v1765872947736!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
              title="Lokasi Redaksi Riaumandiri.co"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Kontak;
