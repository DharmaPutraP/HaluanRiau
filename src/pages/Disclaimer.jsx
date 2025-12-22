import { useState, useEffect } from "react";
import { fetchDisclaimer } from "../services/api";
import { createSanitizedHtml } from "../utils/sanitizer";

function Disclaimer() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDisclaimer = async () => {
      try {
        setLoading(true);
        const data = await fetchDisclaimer();
        setPageData(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    loadDisclaimer();
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
              dangerouslySetInnerHTML={createSanitizedHtml(pageData.content)}
            />
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">Konten tidak tersedia</p>
          </div>
        )}
        {/* Header */}
        {/* <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-gray-900 border-b-4 border-primary pb-3">
          Disclaimer
        </h1>

        <div className="prose prose-sm md:prose-base max-w-none">
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <div className="bg-primary/5 border border-primary/20 p-5 rounded-lg">
              <p className="text-gray-800">
                Seluruh layanan yang diberikan mengikuti aturan main yang
                berlaku dan ditetapkan oleh{" "}
                <span className="text-primary font-semibold">
                  riaumandiri.id
                </span>
              </p>
            </div>

            <div className="bg-gray-50 border-l-4 border-primary p-5 rounded-r">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Pasal Sanggahan (Disclaimer)
              </h3>

              <div className="space-y-4">
                <p className="text-gray-700">
                  <span className="text-primary font-semibold">
                    riaumandiri.id
                  </span>{" "}
                  tidak bertanggung jawab atas tidak tersampaikannya
                  data/informasi yang disampaikan oleh pembaca melalui berbagai
                  jenis saluran komunikasi (e-mail, sms, online form) karena
                  faktor kesalahan teknis yang tidak diduga-duga sebelumnya.
                </p>

                <p className="text-gray-700">
                  <span className="text-primary font-semibold">
                    riaumandiri.id
                  </span>{" "}
                  berhak untuk memuat, tidak memuat, mengedit, dan/atau
                  menghapus data/informasi yang disampaikan oleh pembaca.
                </p>

                <p className="text-gray-700">
                  Data dan/atau informasi yang tersedia di{" "}
                  <span className="text-primary font-semibold">
                    riaumandiri.id
                  </span>{" "}
                  hanya sebagai rujukan/referensi belaka, dan semua mitra yang
                  menyediakan data dan informasi,{" "}
                  <span className="text-primary font-semibold">
                    riaumandiri.id
                  </span>{" "}
                  tidak bertanggung jawab atas segala kesalahan dan
                  keterlambatan memperbarui data atau informasi, atau segala
                  kerugian yang timbul karena tindakan yang berkaitan dengan
                  penggunaan data/informasi yang disajikan{" "}
                  <span className="text-primary font-semibold">
                    riaumandiri.id
                  </span>
                </p>
              </div>
            </div>
            <div className="bg-primary text-white p-6 rounded-lg">
              <p className="text-center text-sm md:text-base italic">
                Dengan menggunakan layanan riaumandiri.id, Anda telah menyetujui
                disclaimer ini
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Disclaimer;
