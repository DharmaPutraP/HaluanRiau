import { Link } from "react-router-dom";
import Tag from "../Tag";

function LeftHeadline({ data = [], className = "" }) {
  return (
    <div
      className={`flex-initial flex flex-col w-full md:w-1/4 gap-4 ${className}`}
    >
      {data.map((item, index) => (
        <Link
          key={index}
          to={`/article/${item.id}/${item.url}`}
          className={`flex flex-col hover:opacity-80 transition-opacity ${
            index < data.length - 1
              ? "pb-3 md:pb-4 border-b border-gray-200"
              : ""
          }`}
        >
          <Tag
            judul={item.tag}
            className="text-[10px] md:text-xs mb-1.5 md:mb-2"
          />
          <p className="text-base md:text-sm leading-snug font-bold mb-1 grow">
            {item.judul}
          </p>
          <p className="text-base md:text-xs leading-snug mb-1 line-clamp-1 grow">
            {item.description}
          </p>

          <div className="flex xl:items-center xl:justify-between xl:align-center flex-col xl:flex-row items-start justify-start align-start">
            <div className="flex items-center text-[10px] md:text-xs gap-1.5 text-gray-500">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="truncate">{item.lastUpdated}</p>
            </div>
            <div className="flex items-center text-[#EE4339] font-bold text-xs">
              <p>Lebih Lengkap</p>
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="ms-1 w-4 h-4"
              >
                <path d="m11.293 17.293 1.414 1.414L19.414 12l-6.707-6.707-1.414 1.414L15.586 11H6v2h9.586z" />
              </svg>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default LeftHeadline;
