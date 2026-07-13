import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { Heart, ShoppingCart, Trash2, Star, ArrowLeft } from "lucide-react";

const placeholders = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46",
];

const Wishlist = () => {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();

  const getImage = (product) => {
    if (product.images && product.images.length > 0) return product.images[0];
    return placeholders[product.title.length % placeholders.length];
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
            <Heart size={36} className="text-slate-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Your Wishlist is Empty</h2>
          <p className="text-slate-400 mb-6">Save items you love and view them later.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-rose-600/10"
          >
            <ArrowLeft size={18} />
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="text-rose-500" size={28} />
          <h1 className="text-3xl font-bold text-white tracking-tight">My Wishlist</h1>
          <span className="text-slate-500 text-sm mt-1.5">
            ({items.length} item{items.length !== 1 ? "s" : ""})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item._id} className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all duration-200 shadow-xl shadow-black/30">
              <div className="relative group">
                <Link to={`/product/${item._id}`}>
                  <img src={getImage(item)} alt={item.title} className="h-48 w-full object-cover transition duration-300 group-hover:scale-102" />
                </Link>
                <button
                  onClick={() => removeItem(item._id)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-slate-950/80 backdrop-blur-sm flex items-center justify-center hover:bg-red-600 transition duration-150 cursor-pointer"
                >
                  <Trash2 size={15} className="text-white" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                <Link to={`/product/${item._id}`}>
                  <h3 className="text-white text-base font-semibold truncate hover:text-blue-400 transition">{item.title}</h3>
                </Link>

                {item.rating && (
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-slate-300 font-medium">{item.rating}</span>
                  </div>
                )}

                <div className="flex items-baseline gap-2">
                  <span className="text-rose-400 font-bold">₹{item.price?.toLocaleString('en-IN')}</span>
                  {item.originalPrice && (
                    <>
                      <span className="text-slate-500 line-through text-xs">₹{item.originalPrice?.toLocaleString('en-IN')}</span>
                      {item.discount && <span className="text-green-400 font-semibold text-xs">{item.discount}% OFF</span>}
                    </>
                  )}
                </div>

                <button
                  onClick={() => { addItem(item); removeItem(item._id); }}
                  className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white py-2.5 rounded-lg transition-colors duration-150 font-medium text-sm cursor-pointer shadow-md shadow-rose-600/5"
                >
                  <ShoppingCart size={15} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
