import { Outlet } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col select-none">
      <Navbar />

      <main className="grow">
        <Outlet />
      </main>

      <div className="md:mx-24">
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;
