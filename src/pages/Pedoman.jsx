import React, { useEffect, useState } from "react";
import { fetchPedoman } from "../services/api";
import { createSanitizedHtml } from "../utils/sanitizer";

function Pedoman() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPedoman = async () => {
      try {
        setLoading(true);
        const data = await fetchPedoman();
        setPageData(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    loadPedoman();
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
          Pedoman Pemberitaan Media Siber
        </h1>

        <div className="prose prose-sm md:prose-base max-w-none">
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              <strong>RIAU MANDIRI</strong> - Kemerdekaan berpendapat,
              kemerdekaan berekspresi, dan kemerdekaan pers adalah hak asasi
              manusia yang dilindungi Pancasila, Undang-Undang Dasar 1945, dan
              Deklarasi Universal Hak Asasi Manusia PBB. Keberadaan media siber
              di Indonesia juga merupakan bagian dari kemerdekaan berpendapat,
              kemerdekaan berekspresi, dan kemerdekaan pers.
            </p>

            <p>
              Media siber memiliki karakter khusus sehingga memerlukan pedoman
              agar pengelolaannya dapat dilaksanakan secara profesional,
              memenuhi fungsi, hak, dan kewajibannya sesuai Undang-Undang Nomor
              40 Tahun 1999 tentang Pers dan Kode Etik Jurnalistik. Untuk itu
              Dewan Pers bersama organisasi pers, pengelola media siber, dan
              masyarakat menyusun Pedoman Pemberitaan Media Siber sebagai
              berikut:
            </p>

            <div className="bg-gray-50 border-l-4 border-primary p-5 my-6 rounded-r">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                1. Ruang Lingkup
              </h3>
              <p className="text-gray-700">
                Media Siber adalah segala bentuk media yang menggunakan wahana
                internet dan melaksanakan kegiatan jurnalistik, serta memenuhi
                persyaratan Undang-Undang Pers dan Standar Perusahaan Pers yang
                ditetapkan Dewan Pers. Isi Buatan Pengguna (User Generated
                Content) adalah segala isi yang dibuat dan atau dipublikasikan
                oleh pengguna media siber, antara lain, artikel, gambar,
                komentar, suara, video dan berbagai bentuk unggahan yang melekat
                pada media siber, seperti blog, forum, komentar pembaca atau
                pemirsa, dan bentuk lain.
              </p>
            </div>

            <div className="bg-primary/5 border border-primary/20 p-5 my-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                2. Verifikasi dan Keberimbangan Berita
              </h3>
              <div className="space-y-3">
                <p>
                  <strong>a.</strong> Pada prinsipnya setiap berita harus
                  melalui verifikasi.
                </p>
                <p>
                  <strong>b.</strong> Berita yang dapat merugikan pihak lain
                  memerlukan verifikasi pada berita yang sama untuk memenuhi
                  prinsip akurasi dan keberimbangan.
                </p>
                <p>
                  <strong>c.</strong> Ketentuan dalam butir (a) di atas
                  dikecualikan, dengan syarat:
                </p>
                <ul className="list-decimal list-inside ml-4 space-y-2">
                  <li>
                    Berita benar-benar mengandung kepentingan publik yang
                    bersifat mendesak;
                  </li>
                  <li>
                    Sumber berita yang pertama adalah sumber yang jelas
                    disebutkan identitasnya, kredibel dan kompeten;
                  </li>
                  <li>
                    Subyek berita yang harus dikonfirmasi tidak diketahui
                    keberadaannya dan atau tidak dapat diwawancarai;
                  </li>
                  <li>
                    Media memberikan penjelasan kepada pembaca bahwa berita
                    tersebut masih memerlukan verifikasi lebih lanjut yang
                    diupayakan dalam waktu secepatnya. Penjelasan dimuat pada
                    bagian akhir dari berita yang sama, di dalam kurung dan
                    menggunakan huruf miring.
                  </li>
                </ul>
                <p>
                  <strong>d.</strong> Setelah memuat berita sesuai dengan butir
                  (c), media wajib meneruskan upaya verifikasi, dan setelah
                  verifikasi didapatkan, hasil verifikasi dicantumkan pada
                  berita pemutakhiran (update) dengan tautan pada berita yang
                  belum terverifikasi.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 border-l-4 border-primary p-5 my-6 rounded-r">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                3. Isi Buatan Pengguna (User Generated Content)
              </h3>
              <div className="space-y-3">
                <p>
                  <strong>a.</strong> Media siber wajib mencantumkan syarat dan
                  ketentuan mengenai Isi Buatan Pengguna yang tidak bertentangan
                  dengan Undang-Undang No. 40 tahun 1999 tentang Pers dan Kode
                  Etik Jurnalistik, yang ditempatkan secara terang dan jelas.
                </p>
                <p>
                  <strong>b.</strong> Media siber mewajibkan setiap pengguna
                  untuk melakukan registrasi keanggotaan dan melakukan proses
                  log-in terlebih dahulu untuk dapat mempublikasikan semua
                  bentuk Isi Buatan Pengguna. Ketentuan mengenai log-in akan
                  diatur lebih lanjut.
                </p>
                <p>
                  <strong>c.</strong> Dalam registrasi tersebut, media siber
                  mewajibkan pengguna memberi persetujuan tertulis bahwa Isi
                  Buatan Pengguna yang dipublikasikan:
                </p>
                <ul className="list-decimal list-inside ml-4 space-y-2">
                  <li>Tidak memuat isi bohong, fitnah, sadis dan cabul;</li>
                  <li>
                    Tidak memuat isi yang mengandung prasangka dan kebencian
                    terkait dengan suku, agama, ras, dan antargolongan (SARA),
                    serta menganjurkan tindakan kekerasan;
                  </li>
                  <li>
                    Tidak memuat isi diskriminatif atas dasar perbedaan jenis
                    kelamin dan bahasa, serta tidak merendahkan martabat orang
                    lemah, miskin, sakit, cacat jiwa, atau cacat jasmani.
                  </li>
                </ul>
                <p>
                  <strong>d.</strong> Media siber memiliki kewenangan mutlak
                  untuk mengedit atau menghapus Isi Buatan Pengguna yang
                  bertentangan dengan butir (c). Media siber wajib menyediakan
                  mekanisme pengaduan Isi Buatan Pengguna yang dinilai melanggar
                  ketentuan pada butir (c). Mekanisme tersebut harus disediakan
                  di tempat yang dengan mudah dapat diakses pengguna.
                </p>
                <p>
                  <strong>e.</strong> Media siber wajib menyunting, menghapus,
                  dan melakukan tindakan koreksi setiap Isi Buatan Pengguna yang
                  dilaporkan dan melanggar ketentuan butir (c), sesegera mungkin
                  secara proporsional selambat-lambatnya 2 x 24 jam setelah
                  pengaduan diterima.
                </p>
                <p>
                  <strong>f.</strong> Media siber yang telah memenuhi ketentuan
                  pada butir (a), (b), (c), dan (f) tidak dibebani tanggung
                  jawab atas masalah yang ditimbulkan akibat pemuatan isi yang
                  melanggar ketentuan pada butir (c).
                </p>
                <p>
                  <strong>g.</strong> Media siber bertanggung jawab atas Isi
                  Buatan Pengguna yang dilaporkan bila tidak mengambil tindakan
                  koreksi setelah batas waktu sebagaimana tersebut pada butir
                  (f).
                </p>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 p-5 my-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                4. Ralat, Koreksi, dan Hak Jawab
              </h3>
              <div className="space-y-3">
                <p>
                  <strong>a.</strong> Ralat, koreksi, dan hak jawab mengacu pada
                  Undang-Undang Pers, Kode Etik Jurnalistik, dan Pedoman Hak
                  Jawab yang ditetapkan Dewan Pers.
                </p>
                <p>
                  <strong>b.</strong> Ralat, koreksi dan atau hak jawab wajib
                  ditautkan pada berita yang diralat, dikoreksi atau yang diberi
                  hak jawab.
                </p>
                <p>
                  <strong>c.</strong> Di setiap berita ralat, koreksi, dan hak
                  jawab wajib dicantumkan waktu pemuatan ralat, koreksi, dan
                  atau hak jawab tersebut.
                </p>
                <p>
                  <strong>d.</strong> Bila suatu berita media siber tertentu
                  disebarluaskan media siber lain, maka:
                </p>
                <ul className="list-decimal list-inside ml-4 space-y-2">
                  <li>
                    Tanggung jawab media siber pembuat berita terbatas pada
                    berita yang dipublikasikan di media siber tersebut atau
                    media siber yang berada di bawah otoritas teknisnya;
                  </li>
                  <li>
                    Koreksi berita yang dilakukan oleh sebuah media siber, juga
                    harus dilakukan oleh media siber lain yang mengutip berita
                    dari media siber yang dikoreksi itu;
                  </li>
                  <li>
                    Media yang menyebarluaskan berita dari sebuah media siber
                    dan tidak melakukan koreksi atas berita sesuai yang
                    dilakukan oleh media siber pemilik dan atau pembuat berita
                    tersebut, bertanggung jawab penuh atas semua akibat hukum
                    dari berita yang tidak dikoreksinya itu.
                  </li>
                </ul>
                <p>
                  <strong>e.</strong> Sesuai dengan Undang-Undang Pers, media
                  siber yang tidak melayani hak jawab dapat dijatuhi sanksi
                  hukum pidana denda paling banyak Rp500.000.000 (Lima ratus
                  juta rupiah).
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 border-l-4 border-primary p-5 rounded-r">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  5. Pencabutan Berita
                </h3>
                <div className="space-y-3">
                  <p>
                    <strong>a.</strong> Berita yang sudah dipublikasikan tidak
                    dapat dicabut karena alasan penyensoran dari pihak luar
                    redaksi, kecuali terkait masalah SARA, kesusilaan, masa
                    depan anak, pengalaman traumatik korban atau berdasarkan
                    pertimbangan khusus lain yang ditetapkan Dewan Pers.
                  </p>
                  <p>
                    <strong>b.</strong> Media siber lain wajib mengikuti
                    pencabutan kutipan berita dari media asal yang telah
                    dicabut.
                  </p>
                  <p>
                    <strong>c.</strong> Pencabutan berita wajib disertai dengan
                    alasan pencabutan dan diumumkan kepada publik.
                  </p>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 p-5 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  6. Iklan
                </h3>
                <div className="space-y-3">
                  <p>
                    <strong>a.</strong> Media siber wajib membedakan dengan
                    tegas antara produk berita dan iklan.
                  </p>
                  <p>
                    <strong>b.</strong> Setiap berita/artikel/isi yang merupakan
                    iklan dan atau isi berbayar wajib mencantumkan keterangan
                    'advertorial', 'iklan', 'ads', 'sponsored', atau kata lain
                    yang menjelaskan bahwa berita/artikel/isi tersebut adalah
                    iklan.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 border-l-4 border-primary p-5 rounded-r">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  7. Hak Cipta
                </h3>
                <p>
                  Media siber wajib menghormati hak cipta sebagaimana diatur
                  dalam peraturan perundang-undangan yang berlaku.
                </p>
              </div>

              <div className="bg-primary/5 border border-primary/20 p-5 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  8. Pencantuman Pedoman
                </h3>
                <p>
                  Media siber wajib mencantumkan Pedoman Pemberitaan Media Siber
                  ini di medianya secara terang dan jelas.
                </p>
              </div>

              <div className="bg-gray-50 border-l-4 border-primary p-5 rounded-r">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  9. Sengketa
                </h3>
                <p>
                  Penilaian akhir atas sengketa mengenai pelaksanaan Pedoman
                  Pemberitaan Media Siber ini diselesaikan oleh Dewan Pers.
                </p>
              </div>
            </div>

            <div className="bg-primary text-white p-6 my-6 rounded-lg text-center">
              <p className="text-lg font-semibold mb-2">
                Jakarta, 3 Februari 2012
              </p>
              <p className="text-sm italic">
                Pedoman ini ditandatangani oleh Dewan Pers dan komunitas pers di
                Jakarta, 3 Februari 2012
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Pedoman;
