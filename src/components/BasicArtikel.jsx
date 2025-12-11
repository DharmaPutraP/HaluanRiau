function BasicArtikel({
  image = false,
  imageUrl,
  title,
  date,
  className = "",
}) {
  return (
    <div className={`${className}`}>
      {image && (
        <img
          src={`${imageUrl}.png`}
          alt={title}
          className="w-11/12 h-auto mb-3"
        />
      )}
      <h2 className="text-sm font-bold mb-1">{title}</h2>
      <p className="text-xs text-gray-500">{date}</p>
    </div>
  );
}

export default BasicArtikel;
