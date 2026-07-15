import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import API_URL from "../../config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(`${API_URL}/api/user/forgot-password`, { email });
      setSent(true);
    } catch {
      setError("Something went wrong. Try again.");
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
          <h1 className="text-3xl font-bold text-white mb-2">Check Your Email</h1>
          <p className="text-slate-400">If that email is registered, we've sent a password reset link.</p>
          <Link to="/login" className="inline-block mt-8 text-blue-500 hover:text-blue-400">Back to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-6">
          <ArrowLeft size={18} /> Back to Login
        </Link>
        <h1 className="text-2xl font-bold text-white mb-2">Forgot Password?</h1>
        <p className="text-slate-400 text-sm mb-6">Enter your email and we'll send you a reset link.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-300 mb-1.5 block">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-3.5 text-slate-400" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:border-blue-500" />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition">
            Send Reset Link
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
