import React, { useEffect, useState } from "react";
import { fetchRedaksi } from "../services/api";
import { createSanitizedHtml } from "../utils/sanitizer";

function Redaksi() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRedaksi = async () => {
      try {
        setLoading(true);
        const data = await fetchRedaksi();
        setPageData(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    loadRedaksi();
  }, []);

  return (
    <div className="w-full px-2 sm:px-4">
      <div className="bg-white px-3 sm:px-4 md:px-10 py-4 sm:py-6 md:py-8 mt-2">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : pageData ? (
          <>
            <div
              className="prose prose-sm md:prose-base max-w-none"
              dangerouslySetInnerHTML={createSanitizedHtml(pageData.content)}
            />
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">Konten tidak tersedia</p>
          </div>
        )}
        {/* Header */}
        {/* <div className="text-center mb-4 sm:mb-6">
          <h3 className="text-sm sm:text-base md:text-lg text-gray-600 mb-2 sm:mb-3">
            SITUS BERITA RIAUMANDIRI.CO DIKELOLA OLEH:
          </h3>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-primary text-white py-2 sm:py-3 px-4 sm:px-6 rounded inline-block">
            PT. MEDIA RIAU MANDIRI
          </h1>
        </div>

        <div className="prose prose-sm md:prose-base max-w-none">
          <div className="bg-gray-50 border-l-4 border-primary p-5 my-6 rounded-r">
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-[200px_20px_auto] gap-2 items-start">
                <span className="font-semibold text-gray-900">
                  DIREKTUR UTAMA
                </span>
                <span className="hidden md:block">:</span>
                <span className="text-gray-700">ZICO MARDIAN UTAMA</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[200px_20px_auto] gap-2 items-start">
                <span className="font-semibold text-gray-900">
                  GENERAL MANAGER
                </span>
                <span className="hidden md:block">:</span>
                <span className="text-gray-700">DONI RAHIM</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[200px_20px_auto] gap-2 items-start">
                <span className="font-semibold text-gray-900">OMBUDSMAN</span>
                <span className="hidden md:block">:</span>
                <span className="text-gray-700">EDWAR PASARIBU, SH</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[200px_20px_auto] gap-2 items-start">
                <span className="font-semibold text-gray-900">
                  LEGAL/LAWYER
                </span>
                <span className="hidden md:block">:</span>
                <span className="text-gray-700">ALHENDRI TANJUNG, SH, MH</span>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 p-5 my-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-primary pb-2">
              REDAKSI
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-[250px_20px_auto] gap-2 items-start">
                <span className="font-semibold text-gray-900">
                  Pemimpin Redaksi & Penanggung Jawab
                </span>
                <span className="hidden md:block">:</span>
                <span className="text-gray-700">Doni Rahim</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[250px_20px_auto] gap-2 items-start">
                <span className="font-semibold text-gray-900">
                  Redaktur Perlaksana
                </span>
                <span className="hidden md:block">:</span>
                <span className="text-gray-700">Nandra Piliang</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[250px_20px_auto] gap-2 items-start">
                <span className="font-semibold text-gray-900">Redaktur</span>
                <span className="hidden md:block">:</span>
                <span className="text-gray-700">Syafril Amir, Akmal</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[250px_20px_auto] gap-2 items-start">
                <span className="font-semibold text-gray-900">Editor</span>
                <span className="hidden md:block">:</span>
                <span className="text-gray-700">
                  Nandra, Akmal, Syafril Amir
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[250px_20px_auto] gap-2 items-start">
                <span className="font-semibold text-gray-900">
                  Sekretaris Redaksi
                </span>
                <span className="hidden md:block">:</span>
                <span className="text-gray-700">Rani Puspita</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border-l-4 border-primary p-5 my-6 rounded-r">
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-primary pb-2">
              REPORTER DAERAH
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <div className="grid grid-cols-[120px_20px_auto] gap-2 items-start">
                <span className="font-semibold text-gray-900">
                  Kota Pekanbaru
                </span>
                <span>:</span>
                <span className="text-gray-700">
                  Akmal, Nurmadi, Dodi, Andika, Suherman, M Rafi, Magi AP
                </span>
              </div>
              <div className="grid grid-cols-[120px_20px_auto] gap-2 items-start">
                <span className="font-semibold text-gray-900">Kuansing</span>
                <span>:</span>
                <span className="text-gray-700">Miftahul Rizki</span>
              </div>
              <div className="grid grid-cols-[120px_20px_auto] gap-2 items-start">
                <span className="font-semibold text-gray-900">
                  Indragiri Hulu
                </span>
                <span>:</span>
                <span className="text-gray-700">Eka BP</span>
              </div>
              <div className="grid grid-cols-[120px_20px_auto] gap-2 items-start">
                <span className="font-semibold text-gray-900">Kampar</span>
                <span>:</span>
                <span className="text-gray-700">M Hasbi</span>
              </div>
              <div className="grid grid-cols-[120px_20px_auto] gap-2 items-start">
                <span className="font-semibold text-gray-900">Rokan Hulu</span>
                <span>:</span>
                <span className="text-gray-700">-</span>
              </div>
              <div className="grid grid-cols-[120px_20px_auto] gap-2 items-start">
                <span className="font-semibold text-gray-900">Rokan Hilir</span>
                <span>:</span>
                <span className="text-gray-700">Johan</span>
              </div>
              <div className="grid grid-cols-[120px_20px_auto] gap-2 items-start">
                <span className="font-semibold text-gray-900">Bengkalis</span>
                <span>:</span>
                <span className="text-gray-700">Usman</span>
              </div>
              <div className="grid grid-cols-[120px_20px_auto] gap-2 items-start">
                <span className="font-semibold text-gray-900">Duri</span>
                <span>:</span>
                <span className="text-gray-700">-</span>
              </div>
              <div className="grid grid-cols-[120px_20px_auto] gap-2 items-start">
                <span className="font-semibold text-gray-900">Siak</span>
                <span>:</span>
                <span className="text-gray-700">Darlis Sinatra</span>
              </div>
              <div className="grid grid-cols-[120px_20px_auto] gap-2 items-start">
                <span className="font-semibold text-gray-900">Pelalawan</span>
                <span>:</span>
                <span className="text-gray-700">Rafles</span>
              </div>
              <div className="grid grid-cols-[120px_20px_auto] gap-2 items-start">
                <span className="font-semibold text-gray-900">Meranti</span>
                <span>:</span>
                <span className="text-gray-700">Teguh</span>
              </div>
              <div className="grid grid-cols-[120px_20px_auto] gap-2 items-start">
                <span className="font-semibold text-gray-900">Dumai</span>
                <span>:</span>
                <span className="text-gray-700">-</span>
              </div>
              <div className="grid grid-cols-[120px_20px_auto] gap-2 items-start">
                <span className="font-semibold text-gray-900">
                  Indragiri Hilir
                </span>
                <span>:</span>
                <span className="text-gray-700">Rio Pranata</span>
              </div>
              <div className="grid grid-cols-[120px_20px_auto] gap-2 items-start">
                <span className="font-semibold text-gray-900">Jakarta</span>
                <span>:</span>
                <span className="text-gray-700">Syafril Amir</span>
              </div>
              <div className="grid grid-cols-[120px_20px_auto] gap-2 items-start">
                <span className="font-semibold text-gray-900">
                  Sumatera Barat
                </span>
                <span>:</span>
                <span className="text-gray-700">David Ramadian</span>
              </div>
              <div className="grid grid-cols-[120px_20px_auto] gap-2 items-start">
                <span className="font-semibold text-gray-900">
                  Kepulauan Riau
                </span>
                <span>:</span>
                <span className="text-gray-700">Andi</span>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 p-5 my-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-primary pb-2">
              NON-REDAKSI
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-[200px_20px_auto] gap-2 items-start">
                <span className="font-semibold text-gray-900">
                  Kepala Devisi Iklan
                </span>
                <span className="hidden md:block">:</span>
                <span className="text-gray-700">Jefry Zein</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[200px_20px_auto] gap-2 items-start">
                <span className="font-semibold text-gray-900">
                  Administrasi
                </span>
                <span className="hidden md:block">:</span>
                <span className="text-gray-700">Liza Fauziah</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[200px_20px_auto] gap-2 items-start">
                <span className="font-semibold text-gray-900">Keuangan</span>
                <span className="hidden md:block">:</span>
                <span className="text-gray-700">Agus Harahap</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[200px_20px_auto] gap-2 items-start">
                <span className="font-semibold text-gray-900">HRD</span>
                <span className="hidden md:block">:</span>
                <span className="text-gray-700">Agus Salim</span>
              </div>
              <div className="grid grid-cols-[200px_20px_auto] gap-2 items-start">
                <span className="font-semibold text-gray-900">Web Master</span>
                <span className="hidden md:block">:</span>
                <span className="text-gray-700">Fahmi Adestya</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border-t-4 border-primary p-5 my-6 rounded-b-lg">
            <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
              Redaksi menerima tulisan yang bersifat umum, tidak menghina, tidak
              menghujat, tidak berbau SARA. Tulisan yang masuk harus dilengkapi
              identitas diri dan tetap melalui proses editing dengan tidak
              mengurangi maksud dan arti. Redaksi Riaumandiri.co mempersilahkan
              pengelola media massa cetak maupun elektronik mengutip berita teks
              maupun berita foto dari media ini, dengan syarat mencantumkan
              sumber berita Riaumandiri.co tanpa disingkat. Bagi media yang
              mengutip berita Riaumandiri.co tanpa menyebut sumber berita,
              redaksi akan menyampaikan somasi dan melakukan penuntutan secara
              hukum. Wartawan Riaumandiri.co selalu dibekali dengan kartu pers.
            </p>
            <div className="bg-primary text-white p-4 rounded-lg text-center">
              <p className="text-xs md:text-sm">
                Untuk informasi, kritik dan saran terkait keredaksian dan
                pemberitaan silakan hubungi{" "}
                <em className="font-semibold">Hotline</em> Pengaduan:{" "}
                <span className="font-bold">0818610922</span>
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Redaksi;
