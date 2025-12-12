function BasicArtikel({
  image = false,
  imageUrl,
  title,
  date,
  className = "",
  id,
  url,
}) {
  return (
    <a
      href={`/article/${id}/${url || id}`}
      className={`${className} block hover:opacity-80 transition-opacity cursor-pointer`}
    >
      {image && (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-32 object-cover rounded mb-3"
        />
      )}
      <h2 className="text-sm font-bold mb-1">{title}</h2>
      <p className="text-xs text-gray-500">{date}</p>
    </a>
  );
}

export default BasicArtikel;
