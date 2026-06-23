import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { ShoppingCart, Star, Heart } from "lucide-react";
import axios from "axios";

const placeholders = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46",
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
  "https://images.unsplash.com/photo-1503602642458-232111445657",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
];

const TrendingProducts = () => {
  const { addItem, items } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data.products.slice(0, 8)))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const getImage = (product) => {
    if (product.images && product.images.length > 0) return product.images[0];
    return placeholders[product.title.length % placeholders.length];
  };

  if (loading || products.length === 0) return null;

  return (
    <section className="bg-slate-950 py-14 px-6">
      <h2 className="text-3xl font-bold text-white text-center mb-8">
        Trending Products
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-slate-900 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition"
          >
            <div className="relative">
              <img
                src={getImage(product)}
                alt={product.title}
                className="h-48 w-full object-cover"
              />
              <button
                onClick={() => toggleItem(product)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-slate-900/80 flex items-center justify-center hover:bg-slate-800 transition"
              >
                <Heart
                  size={16}
                  className={
                    isWishlisted(product._id)
                      ? "fill-red-500 text-red-500"
                      : "text-white"
                  }
                />
              </button>
            </div>

            <div className="p-3">
              <h3 className="text-white text-base font-semibold">
                {product.title}
              </h3>

              <p className="text-blue-500 font-bold mt-2">
                ₹{product.price?.toLocaleString()}
              </p>

              <button
                onClick={() => addItem(product)}
                className="mt-3 w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors duration-200"
              >
                <ShoppingCart size={16} />
                {items.find((i) => i._id === product._id)
                  ? "Add Again"
                  : "Add to Cart"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingProducts;
