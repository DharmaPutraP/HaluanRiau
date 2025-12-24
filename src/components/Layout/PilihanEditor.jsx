import React from "react";
import MenuPilihanEditor from "../MenuPilihanEditor";

function PilihanEditor({ data = [] }) {
  const topFive = data.slice(0, 5);
  const topSix = data.slice(0, 6);
  return (
    <div className="bg-white mt-2 px-5 pt-2 pb-5">
      <div className="flex gap-2 border-b-3 w-fit border-primary mb-3 items-center">
        <div className="font-bold">PILIHAN EDITOR</div>
        <a
          href="/category/pilihan-editor"
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
              index !== 0 ? "ps-4 ms-4 border-l border-gray-300" : ""
            } w-full flex`}
          >
            <MenuPilihanEditor
              judul={item.judul}
              gambar={item.foto_kecil}
              tanggal={item.tanggal}
              tag={item.tag}
              id={item.id}
              url={item.url}
            />
          </div>
        ))}
      </div>

      {/* Mobile: Single column layout */}
      <div className="md:hidden flex flex-wrap justify-center items-center">
        {topSix.map((item, index) => (
          <div
            key={index}
            className={`${index !== 0 && index !== 1 ? "pt-5" : ""} w-full`}
          >
            <MenuPilihanEditor
              judul={item.judul}
              gambar={item.foto_kecil}
              tanggal={item.tanggal}
              tag={item.tag}
              id={item.id}
              url={item.url}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PilihanEditor;
