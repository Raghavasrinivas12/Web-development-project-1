import { Link } from "react-router-dom";
import { CheckCircle, ArrowLeft } from "lucide-react";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle size={44} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
        <p className="text-slate-400 mb-8">
          Your order has been placed. You'll receive a confirmation shortly.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition"
        >
          <ArrowLeft size={18} />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
