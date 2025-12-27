import React from "react";

function Tag({ judul = "Lokal", ...props }) {
  // Convert to lowercase first, then capitalize will work properly
  const formattedJudul = judul.toLowerCase();

  return (
    <div
      className={
        `bg-secondary text-white px-1 py-0.5 w-fit capitalize ` +
        (props.className || "")
      }
    >
      <p>{formattedJudul}</p>
    </div>
  );
}

export default Tag;
