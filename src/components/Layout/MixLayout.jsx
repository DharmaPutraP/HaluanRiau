import BasicArtikel from "../BasicArtikel";
function MixLayout({ title, data = [] }) {
  const topFive = data.slice(0, 5);

  // Convert title to URL-friendly format
  const getUrl = (title) => {
    const urlMap = {
      NASIONAL: "/category/nasional",
      "TIPS & KESEHATAN": "/category/tips-kesehatan",
      ADVETORIAL: "/category/advertorial",
      GALERI: "/category/galeri",
    };
    return (
      urlMap[title] || `/category/${title.toLowerCase().replace(/\s+/g, "-")}`
    );
  };

  return (
    <div className="bg-white mt-2 px-5 pt-2 pb-5">
      <div className="flex border-b-3 w-7/13 border-[#EE4339] mb-3 items-center justify-center mx-auto">
        <div className="font-bold text-center">{title}</div>
        <a
          href={getUrl(title)}
          className="cursor-pointer hover:opacity-70 transition-opacity"
        >
          <svg
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="ms-1 w-4 h-4"
          >
            <path d="m11.293 17.293 1.414 1.414L19.414 12l-6.707-6.707-1.414 1.414L15.586 11H6v2h9.586z" />
          </svg>
        </a>
      </div>
      {/* Desktop: Horizontal layout */}
      <div className="flex flex-col justify-start">
        {topFive.map((item, index) => (
          <div
            key={index}
            className={`${
              index !== topFive.length - 1 ? " border-b border-gray-300" : ""
            } w-full`}
          >
            {index === 0 && (
              <BasicArtikel
                title={item.judul}
                image={true}
                imageUrl={item.gambar}
                date={item.tanggal}
                className="mb-2"
              />
            )}
            {index !== 0 && (
              <BasicArtikel
                title={item.judul}
                image={false}
                imageUrl={item.gambar}
                date={item.tanggal}
                className="mt-4 mb-2"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MixLayout;
