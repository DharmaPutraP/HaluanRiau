import Tag from "../Tag";

function LeftHeadline({ data = [] }) {
  return (
    <div className="flex-initial flex flex-col w-full md:w-1/4 gap-3">
      {data.map((item, index) => (
        <div key={index} className={index === 0 ? "" : "flex-1"}>
          <Tag judul={item.tag} className="text-xs" />
          <p className="text-md mt-1 leading-4 font-bold">{item.judul}</p>
          <div className="flex items-center text-[0.7rem] gap-2 mt-1">
            <p className="text-gray-500">{item.tanggal}</p>
            <div>|</div>
            <p>{item.lastUpdated}</p>
          </div>
          {/* <p className="text-xs mt-2 mb-2">{item.description}</p> */}
          <a
            className={`flex text-[#EE4339] font-bold text-xs ${
              index === 0 ? "border-b-2 pb-2 border-gray-500" : ""
            }`}
            href="#"
          >
            <p>Lebih Lengkap</p>
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="ms-1 w-4 h-4"
            >
              <path d="m11.293 17.293 1.414 1.414L19.414 12l-6.707-6.707-1.414 1.414L15.586 11H6v2h9.586z" />
            </svg>
          </a>
        </div>
      ))}
    </div>
  );
}

export default LeftHeadline;
