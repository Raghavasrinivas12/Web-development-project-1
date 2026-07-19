import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import API_URL from "../../config";
import toast from "react-hot-toast";
import { Terminal } from "lucide-react";

const brandingVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const brandingItem = {
  hidden: { opacity: 0, x: 80 },
  visible: { opacity: 1, x: 0 },
};

const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const formItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    role: "customer",
  });
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [devUrl, setDevUrl] = useState("");
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/user/signup`,
        form
      );
      login(res.data.user, res.data.token);
      setDevUrl(res.data.devUrl || "");
      setRegistered(true);
    } catch (err) {
      setError(err.response?.data?.msg || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Verify Your Email</h1>
          <p className="text-slate-400">We sent a verification link to <strong className="text-white">{form.email}</strong>. Please check your inbox and click the link to activate your account.</p>
          {devUrl && (
            <div className="mt-6 p-4 bg-slate-900 border border-yellow-500/30 rounded-xl text-left">
              <div className="flex items-center gap-2 text-yellow-400 text-sm font-medium mb-2">
                <Terminal size={16} /> Dev Mode — Verify URL
              </div>
              <a href={devUrl} className="text-blue-400 hover:text-blue-300 text-sm break-all underline">{devUrl}</a>
            </div>
          )}
          <button onClick={() => navigate("/")} className="mt-8 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition">
            Continue to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden flex flex-col md:flex-row md:h-180"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-[0.03] blur-3xl"
            style={{
              background: "radial-gradient(circle, #3B82F6, transparent 70%)",
            }}
            animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full opacity-[0.02] blur-3xl"
            style={{
              background: "radial-gradient(circle, #3B82F6, transparent 70%)",
            }}
            animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div
          className="absolute left-1/2 top-0 w-px h-full z-10 hidden md:block"
          style={{
            background:
              "linear-gradient(to bottom, transparent 5%, rgba(59,130,246,0.4) 30%, rgba(59,130,246,0.6) 50%, rgba(59,130,246,0.4) 70%, transparent 95%)",
            transform: "translateX(-50%) skewY(-15deg)",
            transformOrigin: "top center",
          }}
        />

        <div className="relative w-full md:w-1/2 min-h-100 md:min-h-full flex flex-col justify-center p-8 md:p-12 order-2 md:order-1">
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2
              variants={formItem}
              className="text-xl font-bold text-white tracking-tight"
            >
              Create your account
            </motion.h2>
            <motion.p
              variants={formItem}
              className="text-slate-400 mt-1 mb-6"
            >
              Start building your marketplace
            </motion.p>

            <form onSubmit={handleSubmit}>
              <motion.div variants={formItem} className="mb-3">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  autoComplete="username"
                  placeholder="yourname"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 caret-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
                />
              </motion.div>

              <motion.div variants={formItem} className="mb-3">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 caret-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
                />
              </motion.div>

              <motion.div variants={formItem} className="mb-3">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 caret-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
                />
              </motion.div>

              <motion.div variants={formItem} className="mb-3">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Phone number
                </label>
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 caret-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
                />
              </motion.div>

              <motion.div variants={formItem} className="mb-5">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  I want to join as
                </label>
                <div className="flex gap-2">
                  {["customer", "vendor"].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, role }))
                      }
                      className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                        form.role === role
                          ? "bg-blue-500 text-white shadow-lg shadow-black/30"
                          : "bg-slate-800/50 text-slate-400 border border-slate-700 hover:text-slate-200 hover:border-slate-600"
                      }`}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                  ))}
                </div>
              </motion.div>

              {error && <p className="text-red-400 text-sm text-center">{error}</p>}

              <motion.div variants={formItem}>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{
                    scale: 1.01,
                    boxShadow: "0 8px 30px rgba(59, 130, 246, 0.25)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 px-6 font-semibold rounded-xl shadow-lg shadow-black/30 cursor-pointer transition-colors duration-200 ${
                    loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white"
                  }`}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </motion.button>
              </motion.div>
            </form>

            <motion.p
              variants={formItem}
              className="text-center text-slate-400 mt-5 text-sm"
            >
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-500 hover:text-blue-400 font-medium transition-colors duration-200"
              >
                Sign In
              </Link>
            </motion.p>
          </motion.div>
        </div>

        <div className="relative w-full md:w-1/2 min-h-70 md:min-h-full flex flex-col items-center justify-center p-8 md:p-12 text-center order-1 md:order-2">
          <motion.div
            variants={brandingVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            <motion.div
              variants={brandingItem}
              className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-5"
            >
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </motion.div>

            <motion.h1
              variants={brandingItem}
              className="text-3xl font-bold text-white tracking-tight"
            >
              Shophub
            </motion.h1>

            <motion.p
              variants={brandingItem}
              className="text-slate-400 text-xs tracking-[0.2em] uppercase mt-3"
            >
              Multi-Tenant E-Commerce Platform
            </motion.p>

            <motion.div
              variants={brandingItem}
              className="w-12 h-0.5 bg-blue-500/40 rounded-full mt-5"
            />

            <motion.p
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-slate-300 text-base mt-5 max-w-xs leading-relaxed"
            >
              Join thousands of creators building the next generation of
              marketplaces.
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
