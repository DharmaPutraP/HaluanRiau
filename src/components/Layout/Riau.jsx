import BasicArtikel from "../BasicArtikel";
import Button from "../Button";

function Riau({ data = [] }) {
  const topFive = data.slice(0, 5);
  const topSix = data.slice(0, 6);
  return (
    <div className="bg-white mt-2 md:px-5 pt-2 pb-5">
      <div className="border-b-3 w-fit border-primary mb-3 items-center mx-auto flex gap-2">
        <div className="font-bold text-center">RIAU</div>
        <a
          href="/category/riau"
          className="cursor-pointer hover:opacity-70 transition-opacity"
        >
          <svg
            width="800px"
            height="800px"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
            className="w-5 h-5"
          >
            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
          </svg>
        </a>
      </div>
      {/* Desktop: Horizontal layout */}
      <div className="hidden md:flex justify-start">
        {topFive.map((item, index) => (
          <div
            key={index}
            className={`${
              index !== 0 ? "ms-4 ps-4 border-l border-gray-300" : ""
            } w-full flex`}
          >
            <BasicArtikel
              title={item.judul}
              image={true}
              imageUrl={item.foto_kecil}
              date={item.tanggal}
              id={item.id}
              url={item.url}
            />
          </div>
        ))}
      </div>

      {/* Mobile: Single column layout */}
      <div className="md:hidden flex flex-wrap justify-center">
        {topSix.map((item, index) => (
          <div
            key={index}
            className={`${
              index !== 0 && index !== 1 ? "pt-5" : ""
            } w-1/2 flex px-2`}
          >
            <BasicArtikel
              title={item.judul}
              image={true}
              imageUrl={item.foto_kecil}
              date={item.tanggal}
              id={item.id}
              url={item.url}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <a href="/category/riau">
          <Button text="Selengkapnya" />
        </a>
      </div>
    </div>
  );
}

export default Riau;
