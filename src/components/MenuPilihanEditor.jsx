import Tag from "./Tag";

function MenuPilihanEditor({ judul, gambar, tag, tanggal, id, url }) {
  const truncatedJudul = judul.split(" ").slice(0, 15).join(" ");
  const finalJudul =
    judul.split(" ").length > 15 ? `${truncatedJudul}...` : truncatedJudul;

  return (
    <a
      href={`/article/${id}/${url || id}`}
      className="w-full hover:opacity-80 transition-opacity cursor-pointer flex flex-col h-full"
    >
      <img
        src={gambar}
        alt="Menu Pilihan Editor"
        className="w-full h-32 object-cover rounded"
      />
      <p className="text-sm mt-2 leading-4 font-bold line-clamp-3 grow">
        {judul}
      </p>
      <div className="flex items-center text-[0.5rem] gap-2 mt-1">
        <p className="text-gray-500">{tanggal}</p>
        <div>|</div>
        <Tag judul={tag} />
      </div>
    </a>
  );
}

export default MenuPilihanEditor;
