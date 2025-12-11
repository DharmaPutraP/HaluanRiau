function Button({ text = "Button", className = "" }) {
  return (
    <div
      className={`bg-[#EE4339] rounded-md w-fit px-5 py-1 text-white flex items-center ${className}`}
    >
      {text}
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="ms-1 w-4 h-4"
      >
        <path d="m11.293 17.293 1.414 1.414L19.414 12l-6.707-6.707-1.414 1.414L15.586 11H6v2h9.586z" />
      </svg>
    </div>
  );
}

export default Button;
