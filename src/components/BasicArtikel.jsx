function BasicArtikel({
  image = false,
  imageUrl,
  title,
  date,
  className = "",
  id,
  url,
  type = "article",
}) {
  const baseRoute = type === "galeri" ? "/galeri" : "/article";

  return (
    <a
      href={`${baseRoute}/${id}/${url || id}`}
      className={`${className} hover:opacity-80 transition-opacity cursor-pointer flex flex-col h-full w-full`}
    >
      {image && (
        <div className="flex justify-center">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-32 object-cover rounded mb-3"
          />
        </div>
      )}
      <h2 className="text-sm font-bold mb-1 line-clamp-3 grow">{title}</h2>
      <p className="text-xs text-gray-500">{date}</p>
    </a>
  );
}

export default BasicArtikel;
