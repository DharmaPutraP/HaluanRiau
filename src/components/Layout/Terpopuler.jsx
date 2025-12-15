import Tag from "../Tag";
function Terpopuler({ data = [] }) {
  const topFive = data.slice(0, 5);

  return (
    <>
      <div className="bg-white mt-2 px-5 pt-2 pb-5 h-fit">
        <div className="flex gap-2 border-b-3 w-fit border-primary mb-3 items-center">
          <div className="font-bold">TERPOPULER</div>
          <a
            href="/category/terpopuler"
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
        {topFive.map((item, index) => (
          <a
            key={index}
            href={`/article/${item.id}/${item.url || item.id}`}
            className={`block ${
              index === 0 ? "" : "pt-2"
            } border-b-2 pb-1 border-gray-200 hover:opacity-80 transition-opacity cursor-pointer`}
          >
            <Tag judul={item.tag} className="text-xs mb-2" />
            <p className="text-md mt-1 leading-4 font-bold">{item.judul}</p>
            <div className="flex justify-between text-[0.7rem] mt-2">
              <p className="text-gray-500">{item.tanggal}</p>
              <p className="text-gray-500">Dibaca {item.timesRead} kali</p>
            </div>
            <p className="text-xs mt-2 mb-2">{item.description}</p>
          </a>
        ))}
      </div>
    </>
  );
}

export default Terpopuler;
