import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Lock, CheckCircle } from "lucide-react";
import API_URL from "../../config";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) return setError("Min 6 characters");
    if (password !== confirm) return setError("Passwords do not match");

    try {
      await axios.post(`${API_URL}/api/user/reset-password/${token}`, { password });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid or expired link");
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
          <h1 className="text-3xl font-bold text-white mb-2">Password Reset</h1>
          <p className="text-slate-400 mb-8">Your password has been changed successfully.</p>
          <Link to="/login" className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
        <p className="text-slate-400 text-sm mb-6">Enter your new password.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-300 mb-1.5 block">New Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-3.5 text-slate-400" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-300 mb-1.5 block">Confirm Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-3.5 text-slate-400" />
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:border-blue-500" />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition">
            Reset Password
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
