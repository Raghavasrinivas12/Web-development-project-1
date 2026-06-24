
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft } from "lucide-react";

const placeholders = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
];

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  const getImage = (product) => {
    if (product.images && product.images.length > 0) return product.images[0];
    return placeholders[product.title.length % placeholders.length];
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
            <ShoppingBag size={36} className="text-slate-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-slate-400 mb-6">Add some products to get started</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-rose-600/10"
          >
            <ArrowLeft size={18} />
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Shopping Cart</h1>
            <p className="text-slate-400 text-sm mt-1">
              {totalItems} item{totalItems !== 1 ? "s" : ""} · <span className="text-rose-400 font-semibold">₹{totalPrice.toLocaleString('en-IN')}</span>
            </p>
          </div>
          <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-300 font-medium transition cursor-pointer">
            Clear All
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4 shadow-xl shadow-black/20">
              <img src={getImage(item)} alt={item.title} className="w-20 h-20 rounded-lg object-cover shrink-0 border border-slate-800" />

              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold truncate">{item.title}</h3>
                <p className="text-rose-400 font-bold mt-1">₹{item.price?.toLocaleString('en-IN')}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="text-white font-semibold w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>

              <p className="text-white font-semibold w-24 text-right">
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </p>

              <button onClick={() => removeItem(item._id)} className="text-slate-500 hover:text-red-400 transition shrink-0 cursor-pointer">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between text-lg">
            <span className="text-slate-400 font-medium">Total Summary</span>
            <span className="text-white font-extrabold text-2xl tracking-tight">₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="mt-4 w-full py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}