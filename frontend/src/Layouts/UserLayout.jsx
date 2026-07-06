import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Layout = () => {
  return (
    <div className="bg-slate-950 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex flex-col grow pt-20">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;