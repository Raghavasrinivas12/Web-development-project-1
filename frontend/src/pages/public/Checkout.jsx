import { useState, useEffect } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft, CreditCard } from "lucide-react";
import axios from "axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
console.log("checkout",import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { token } = useAuth();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError("");

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message);
      setProcessing(false);
      return;
    }

    const { error: payError } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (payError) {
      setError(payError.message);
      setProcessing(false);
      return;
    }

    clearCart();
    navigate("/payment-success");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          style: {
            theme: "night",
            variables: {
              colorPrimary: "#3B82F6",
              colorBackground: "#0F172A",
              colorText: "#FFFFFF",
              colorDanger: "#EF4444",
              fontFamily: "system-ui, sans-serif",
              borderRadius: "12px",
            },
          },
        }}
      />

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      <div className="flex items-center justify-between pt-2">
        <p className="text-white font-bold text-lg">
          Total: ₹{totalPrice.toLocaleString()}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!stripe || processing}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold rounded-xl transition"
          >
            <CreditCard size={18} />
            {processing ? "Processing..." : `Pay ₹${totalPrice.toLocaleString()}`}
          </button>
        </div>
      </div>
    </form>
  );
}

export default function Checkout() {
  const { items, totalPrice } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (items.length === 0) {
      navigate("/cart");
      return;
    }

    axios
      .post(
        "http://localhost:5000/api/payment/create-payment-intent",
        { amount: totalPrice * 100, currency: "inr" },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => setClientSecret(res.data.clientSecret))
      .catch(() => navigate("/cart"));
  }, []);

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-6"
        >
          <ArrowLeft size={18} />
          Back to Cart
        </button>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard size={24} className="text-blue-500" />
            <h1 className="text-2xl font-bold text-white">Checkout</h1>
          </div>

          {items.length > 0 && (
            <div className="mb-6 space-y-2">
              {items.map((item) => (
                <div key={item._id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-300 truncate">
                    {item.title} × {item.quantity}
                  </span>
                  <span className="text-white font-medium">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="border-t border-slate-800 pt-2 flex items-center justify-between font-bold">
                <span className="text-white">Total</span>
                <span className="text-blue-500">₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          )}

          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm />
          </Elements>
        </div>
      </div>
    </div>
  );
}
