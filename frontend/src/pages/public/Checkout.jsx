import { useState, useRef, useEffect } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate, Navigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft, CreditCard, Banknote, MapPin, LocateFixed, AlertTriangle, CheckCircle, Smartphone } from "lucide-react";
import axios from "axios";
import * as LocationService from "../../services/LocationService";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const initialAddress = {
  street: "",
  city: "",
  state: "",
  zipCode: "",
  country: "India",
};

function CardPaymentForm({ address, totalPrice, token, items, clearCart, navigate }) {
  const stripe = useStripe();
  const elements = useElements();
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

    await createOrder("Paid");
  };

  const createOrder = async (status) => {
    try {
      await axios.post(
        "http://localhost:5000/api/orders/checkout",
        {
          items: items.map((i) => ({
            productId: i._id,
            title: i.title,
            quantity: i.quantity,
            priceAtPurchase: i.price,
          })),
          shippingAddress: address,
          orderStatus: status,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      clearCart();
      navigate("/payment-success");
    } catch (err) {
      const data = err.response?.data;
      const detail = data?.errors ? data.errors.map(e => e.message).join("; ") : "";
      setError(detail || data?.msg || "Failed to create order. Please try again.");
      setProcessing(false);
    }
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

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full flex items-center justify-center gap-2 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold rounded-xl transition"
      >
        <CreditCard size={18} />
        {processing ? "Processing..." : `Pay ₹${totalPrice.toLocaleString()}`}
      </button>
    </form>
  );
}

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [address, setAddress] = useState(initialAddress);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");

  const [locationState, setLocationState] = useState("idle");
  const [locationCoords, setLocationCoords] = useState(null);
  const [locationQuality, setLocationQuality] = useState(null);
  const [locationMsg, setLocationMsg] = useState("");

  if (!token) return <Navigate to="/login" replace />;
  if (items.length === 0 && !clientSecret) return <Navigate to="/cart" replace />;

  const handleAddressChange = (e) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isAddressValid = () => {
    return address.street && address.city && address.state && address.zipCode;
  };

  const detectLocation = async () => {
    setLocationState("acquiring");
    setLocationMsg("Acquiring GPS signal...");
    setError("");

    try {
      const position = await LocationService.getCurrentPosition();
      const quality = LocationService.evaluateAccuracy(position.accuracy);
      setLocationCoords(position);
      setLocationQuality(quality);

      setLocationState("resolving");
      setLocationMsg("Resolving address...");

      const addr = await LocationService.reverseGeocode(position.latitude, position.longitude);
      setAddress({
        street: addr.street,
        city: addr.city,
        state: addr.state,
        zipCode: addr.zipCode,
        country: addr.country,
      });

      if (quality.level === "poor") {
        setLocationState("unreliable");
        setLocationMsg(`Location accuracy is ${position.accuracy}m — please verify the filled address.`);
      } else {
        setLocationState("success");
        setLocationMsg(`Location detected (${quality.label.toLowerCase()} accuracy)`);
      }
    } catch (err) {
      setLocationState("error");
      setLocationMsg(err.message);
    }
  };

  const retryDetection = () => {
    setLocationState("idle");
    setLocationCoords(null);
    setLocationQuality(null);
    setLocationMsg("");
    detectLocation();
  };

  useEffect(() => {
    if (locationState === "success" || locationState === "unreliable" || locationState === "error") {
      const timer = setTimeout(() => setLocationState("idle"), 5000);
      return () => clearTimeout(timer);
    }
  }, [locationState]);

  useEffect(() => {
    if (locationState === "success" && locationCoords && mapContainerRef.current && !mapInstanceRef.current) {
      if (window.L) {
        const L = window.L;
        const map = L.map(mapContainerRef.current, {
          zoomControl: false,
          attributionControl: false,
        }).setView([locationCoords.latitude, locationCoords.longitude], 15);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
        }).addTo(map);

        L.circleMarker([locationCoords.latitude, locationCoords.longitude], {
          radius: 8,
          fillColor: "#3B82F6",
          color: "#1E40AF",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        }).addTo(map);

        mapInstanceRef.current = map;
      }
    }
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locationState, locationCoords]);

  const handleCOD = async () => {
    setSubmitting(true);
    setError("");
    try {
      await axios.post(
        "http://localhost:5000/api/orders/checkout",
        {
          items: items.map((i) => ({
            productId: i._id,
            title: i.title,
            quantity: i.quantity,
            priceAtPurchase: i.price,
          })),
          shippingAddress: address,
          orderStatus: "Pending",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      clearCart();
      navigate("/payment-success");
    } catch (err) {
      const data = err.response?.data;
      console.error("Order error response:", data);
      const detail = data?.errors?.length ? data.errors.map(e => e.message).join("; ") : "";
      setError(detail || data?.msg || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCardPayment = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/payment/create-payment-intent",
        { amount: totalPrice * 100, currency: "inr" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClientSecret(res.data.clientSecret);
    } catch {
      setError("Failed to initialize payment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const isDetecting = locationState === "acquiring" || locationState === "resolving";

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
            <MapPin size={24} className="text-blue-500" />
            <h1 className="text-2xl font-bold text-white">Checkout</h1>
          </div>

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

          <div className="border-t border-slate-800 pt-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <MapPin size={18} className="text-blue-500" />
                Delivery Address
              </h2>
              <button
                onClick={detectLocation}
                disabled={isDetecting}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 rounded-lg transition"
              >
                <LocateFixed size={14} className={isDetecting ? "animate-spin" : ""} />
                {isDetecting ? "Detecting..." : "Detect My Location"}
              </button>
            </div>

            {locationState !== "idle" && (
              <div className={`mb-4 p-3 rounded-xl border ${
                locationQuality ? locationQuality.bg + " " + locationQuality.border : "bg-slate-800/50 border-slate-700"
              }`}>
                {isDetecting && (
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <LocateFixed size={16} className="animate-spin text-blue-400" />
                    <span>{locationMsg}</span>
                  </div>
                )}

                {locationState === "success" && locationCoords && locationQuality && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} className={locationQuality.color} />
                        <span className="text-sm text-slate-300">{locationMsg}</span>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${locationQuality.bg} ${locationQuality.color} ${locationQuality.border} border`}>
                        {locationQuality.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs text-slate-400">
                      <div>
                        <span className="text-slate-500">Lat</span>
                        <p className="text-white font-mono">{locationCoords.latitude.toFixed(6)}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Lng</span>
                        <p className="text-white font-mono">{locationCoords.longitude.toFixed(6)}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Accuracy</span>
                        <p className="text-white font-mono">{locationCoords.accuracy}m</p>
                      </div>
                    </div>

                    <div ref={mapContainerRef} className="h-40 rounded-lg overflow-hidden border border-slate-700" />
                  </div>
                )}

                {locationState === "unreliable" && locationCoords && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={16} className="text-red-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-red-400 font-medium">Location detection is unreliable on this device.</p>
                        <p className="text-xs text-slate-400 mt-1">{locationMsg}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/50 p-2 rounded-lg">
                      <Smartphone size={14} />
                      <span>For accurate results, use a smartphone with GPS enabled.</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs text-slate-400">
                      <div>
                        <span className="text-slate-500">Lat</span>
                        <p className="text-white font-mono">{locationCoords.latitude.toFixed(6)}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Lng</span>
                        <p className="text-white font-mono">{locationCoords.longitude.toFixed(6)}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Accuracy</span>
                        <p className="text-red-400 font-mono">{locationCoords.accuracy}m</p>
                      </div>
                    </div>

                    <button
                      onClick={retryDetection}
                      className="w-full py-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {locationState === "error" && (
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={16} className="text-red-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-400">{locationMsg}</p>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                name="street"
                placeholder="Street address"
                value={address.street}
                onChange={handleAddressChange}
                className="sm:col-span-2 px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={address.city}
                onChange={handleAddressChange}
                className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={address.state}
                onChange={handleAddressChange}
                className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
              />
              <input
                type="text"
                name="zipCode"
                placeholder="ZIP / PIN code"
                value={address.zipCode}
                onChange={handleAddressChange}
                className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
              />
              <input
                type="text"
                name="country"
                value={address.country}
                onChange={handleAddressChange}
                className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
              />
            </div>
          </div>

          {!clientSecret ? (
            <>
              <div className="border-t border-slate-800 pt-6 mb-6">
                <h2 className="text-lg font-semibold text-white mb-4">Payment Method</h2>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod("cod")}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border font-medium transition-all duration-200 ${
                      paymentMethod === "cod"
                        ? "border-blue-500 bg-blue-500/10 text-blue-500"
                        : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600"
                    }`}
                  >
                    <Banknote size={20} />
                    Cash on Delivery
                  </button>
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border font-medium transition-all duration-200 ${
                      paymentMethod === "card"
                        ? "border-blue-500 bg-blue-500/10 text-blue-500"
                        : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600"
                    }`}
                  >
                    <CreditCard size={20} />
                    Card Payment
                  </button>
                </div>
              </div>

              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

              <button
                onClick={paymentMethod === "cod" ? handleCOD : handleCardPayment}
                disabled={!paymentMethod || !isAddressValid() || submitting}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold rounded-xl transition"
              >
                {submitting
                  ? "Processing..."
                  : paymentMethod === "cod"
                    ? `Place Order — ₹${totalPrice.toLocaleString()}`
                    : "Continue to Card Payment"}
              </button>
            </>
          ) : (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CardPaymentForm
                address={address}
                totalPrice={totalPrice}
                token={token}
                items={items}
                clearCart={clearCart}
                navigate={navigate}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}
