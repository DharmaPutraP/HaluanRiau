import { useState, useEffect } from "react";

function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show header only when at the very top (scrollY < 10)
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`hidden text-xs md:flex flex-row justify-center gap-10 text-center transition-all duration-300 ${
        isVisible ? "opacity-100 h-5 py-2" : "opacity-0 h-0 py-0"
      }`}
    >
      <a href="/tentang-kami">TENTANG KAMI</a>
      <a href="/redaksi">REDAKSI</a>
      <a href="/pedoman">PEDOMAN</a>
      <a href="/disclaimer">DISCLAIMER</a>
      <a href="/kontak">KONTAK</a>
    </div>
  );
}

export default Header;
