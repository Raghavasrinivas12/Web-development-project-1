import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { ShieldAlert } from "lucide-react";
import axios from "axios";
import API_URL from "../config";
import toast from "react-hot-toast";

const Layout = () => {
  const { isAuthenticated, isVerified, token, refreshUser } = useAuth();

  const resendVerification = async () => {
    try {
      await axios.post(`${API_URL}/api/user/resend-verification`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Verification email sent");
    } catch {
      toast.error("Failed to send");
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen flex flex-col">
      {isAuthenticated && !isVerified && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2.5 text-center text-sm text-yellow-300 flex items-center justify-center gap-3 flex-wrap">
          <ShieldAlert size={18} className="shrink-0" />
          <span>Please verify your email address.</span>
          <button onClick={resendVerification} className="underline hover:text-yellow-100 font-medium">Resend verification email</button>
          <button onClick={refreshUser} className="underline hover:text-yellow-100 font-medium">Refresh status</button>
        </div>
      )}

      <Navbar />

      <main className={`flex flex-col grow ${isAuthenticated && !isVerified ? "pt-28" : "pt-20"}`}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
