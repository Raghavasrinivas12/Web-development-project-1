import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

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
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    role: "customer",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/user/signup",
        form
      );
      alert("Registration Successful!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Registration Failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden flex flex-col md:flex-row md:h-[640px]"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-[0.03] blur-3xl"
            style={{
              background: "radial-gradient(circle, #3B82F6, transparent 70%)",
            }}
            animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full opacity-[0.02] blur-3xl"
            style={{
              background: "radial-gradient(circle, #2563EB, transparent 70%)",
            }}
            animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div
          className="absolute left-1/2 top-0 w-px h-full z-10 hidden md:block"
          style={{
            background:
              "linear-gradient(to bottom, transparent 5%, rgba(37,99,235,0.4) 30%, rgba(37,99,235,0.6) 50%, rgba(37,99,235,0.4) 70%, transparent 95%)",
            transform: "translateX(-50%) skewY(-15deg)",
            transformOrigin: "top center",
          }}
        />

        <div className="relative w-full md:w-1/2 min-h-[400px] md:min-h-full flex flex-col justify-center p-10 md:p-14 order-2 md:order-1">
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2
              variants={formItem}
              className="text-2xl font-bold text-white tracking-tight"
            >
              Create your account
            </motion.h2>
            <motion.p
              variants={formItem}
              className="text-slate-400 mt-1 mb-8"
            >
              Start building your marketplace
            </motion.p>

            <form onSubmit={handleSubmit}>
              <motion.div variants={formItem} className="mb-4">
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

              <motion.div variants={formItem} className="mb-4">
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

              <motion.div variants={formItem} className="mb-4">
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

              <motion.div variants={formItem} className="mb-4">
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

              <motion.div variants={formItem} className="mb-6">
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
                          ? "bg-blue-600 text-white shadow-lg shadow-black/30"
                          : "bg-slate-800/50 text-slate-400 border border-slate-700 hover:text-slate-200 hover:border-slate-600"
                      }`}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={formItem}>
                <motion.button
                  type="submit"
                  whileHover={{
                    scale: 1.01,
                    boxShadow: "0 8px 30px rgba(37, 99, 235, 0.25)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl shadow-lg shadow-black/30 cursor-pointer transition-colors duration-200"
                >
                  Create Account
                </motion.button>
              </motion.div>
            </form>

            <motion.p
              variants={formItem}
              className="text-center text-slate-400 mt-6 text-sm"
            >
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-blue-500 hover:text-blue-400 font-medium transition-colors duration-200"
              >
                Sign In
              </Link>
            </motion.p>
          </motion.div>
        </div>

        <div className="relative w-full md:w-1/2 min-h-[280px] md:min-h-full flex flex-col items-center justify-center p-10 md:p-14 text-center order-1 md:order-2">
          <motion.div
            variants={brandingVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            <motion.div
              variants={brandingItem}
              className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 mb-6"
            >
              <svg
                className="w-8 h-8 text-white"
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
              className="text-4xl font-bold text-white tracking-tight"
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
              className="w-12 h-0.5 bg-blue-600/40 rounded-full mt-6"
            />

            <motion.p
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-slate-300 text-base mt-6 max-w-xs leading-relaxed"
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
