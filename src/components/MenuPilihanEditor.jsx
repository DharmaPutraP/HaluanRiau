import Tag from "./Tag";

function MenuPilihanEditor({ judul, gambar, tag, tanggal }) {
  const truncatedJudul = judul.split(" ").slice(0, 15).join(" ");
  const finalJudul =
    judul.split(" ").length > 15 ? `${truncatedJudul}...` : truncatedJudul;

  return (
    <div className="w-50">
      <img src={`/${gambar}.png`} alt="Menu Pilihan Editor" className="w-50" />
      <p className="text-sm mt-1 leading-4 font-bold">{finalJudul}</p>
      <div className="flex items-center text-[0.5rem] gap-2 mt-1">
        <p className="text-gray-500">{tanggal}</p>
        <div>|</div>
        <Tag judul={tag} />
      </div>
    </div>
  );
}

export default MenuPilihanEditor;
