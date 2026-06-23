import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { Heart, ShoppingCart, Trash2, Star, ArrowLeft } from "lucide-react";

const placeholders = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46",
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
  "https://images.unsplash.com/photo-1503602642458-232111445657",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
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
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800 flex items-center justify-center">
            <Heart size={36} className="text-slate-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Your Wishlist is Empty
          </h2>
          <p className="text-slate-400 mb-6">
            Save items you love and view them later.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors duration-200"
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
          <Heart className="text-blue-500" size={28} />
          <h1 className="text-3xl font-bold text-white">My Wishlist</h1>
          <span className="text-slate-400 text-sm mt-1.5">
            ({items.length} item{items.length !== 1 ? "s" : ""})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all duration-200"
            >
              <div className="relative">
                <img
                  src={getImage(item)}
                  alt={item.title}
                  className="h-48 w-full object-cover"
                />
                <button
                  onClick={() => removeItem(item._id)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-slate-900/80 flex items-center justify-center hover:bg-red-500/80 transition"
                >
                  <Trash2 size={16} className="text-white" />
                </button>
              </div>

              <div className="p-3">
                <h3 className="text-white text-base font-semibold">
                  {item.title}
                </h3>

                {item.rating && (
                  <div className="flex items-center gap-1 mt-2">
                    <Star
                      size={16}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span className="text-sm text-slate-300">
                      {item.rating}
                    </span>
                  </div>
                )}

                <div className="mt-2">
                  <span className="text-blue-500 font-bold">
                    ₹{item.price?.toLocaleString()}
                  </span>
                  {item.originalPrice && (
                    <>
                      <span className="ml-2 text-slate-400 line-through text-sm">
                        ₹{item.originalPrice?.toLocaleString()}
                      </span>
                      {item.discount && (
                        <span className="ml-2 text-green-500 font-semibold text-sm">
                          {item.discount}% OFF
                        </span>
                      )}
                    </>
                  )}
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => addItem(item)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 py-2.5 rounded-lg transition-colors duration-200 font-medium"
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="p-2.5 bg-slate-800 hover:bg-red-500/80 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
