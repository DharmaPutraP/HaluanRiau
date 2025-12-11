import React from "react";

function Tag({ judul = "LOKAL", ...props }) {
  return (
    <div
      className={
        "bg-[#FF2929] text-white px-1 py-0.5 w-fit " + (props.className || "")
      }
    >
      <p>{judul}</p>
    </div>
  );
}

export default Tag;
