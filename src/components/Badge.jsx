function Badge({ judul }) {
  return (
    <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-bold text-blue-400 inset-ring inset-ring-blue-400/30">
      {judul}
    </span>
  );
}

export default Badge;
