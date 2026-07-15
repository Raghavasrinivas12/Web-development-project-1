import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import API_URL from "../../config";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    axios.get(`${API_URL}/api/user/verify-email/${token}`)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {status === "success" ? (
          <>
            <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
            <h1 className="text-3xl font-bold text-white mb-2">Email Verified</h1>
            <p className="text-slate-400 mb-8">Your email has been verified successfully.</p>
          </>
        ) : (
          <>
            <XCircle size={64} className="mx-auto text-red-500 mb-6" />
            <h1 className="text-3xl font-bold text-white mb-2">Verification Failed</h1>
            <p className="text-slate-400 mb-8">The link is invalid or has expired.</p>
          </>
        )}
        <Link to="/login" className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition">
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;
