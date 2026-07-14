import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import {
  Laptop,
  Shirt,
  BookOpen,
  ShoppingBasket,
  Watch,
  X,
  ShoppingCart,
  Heart,
} from "lucide-react";

const categories = [
  { name: "Electronics", icon: <Laptop size={16} /> },
  { name: "Fashion", icon: <Shirt size={16} /> },
  { name: "Books", icon: <BookOpen size={16} /> },
  { name: "Grocery", icon: <ShoppingBasket size={16} /> },
  { name: "Accessories", icon: <Watch size={16} /> },
];

const placeholders = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46",
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
  "https://images.unsplash.com/photo-1503602642458-232111445657",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
];

export default function Products() {
  const { addItem, items } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const params = activeCategory ? { category: activeCategory } : {};
      const res = await axios.get("http://localhost:5000/api/products", { params });
      setProducts(res.data.products);
    } catch {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const getImage = (product) => {
    if (product.images && product.images.length > 0) return product.images[0];
    return placeholders[product.title.length % placeholders.length];
  };

  const clearCategory = () => {
    setSearchParams({});
  };

  const setCategory = (name) => {
    setSearchParams({ category: name.toLowerCase() });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 text-lg">{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {activeCategory
                ? activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)
                : "All Products"}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {products.length} product{products.length !== 1 ? "s" : ""} available
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button
            onClick={clearCategory}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              !activeCategory
                ? "bg-blue-500 text-white"
                : "bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setCategory(cat.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeCategory === cat.name.toLowerCase()
                  ? "bg-blue-500 text-white"
                  : "bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
              }`}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
          {activeCategory && (
            <button
              onClick={clearCategory}
              className="flex items-center gap-1 px-3 py-2 text-sm text-slate-400 hover:text-white transition"
            >
              <X size={14} />
              Clear
            </button>
          )}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-slate-400 text-lg">No products found</p>
            {activeCategory && (
              <button
                onClick={clearCategory}
                className="mt-3 text-blue-500 hover:text-blue-400 text-sm transition"
              >
                View all products
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all duration-200"
              >
                <Link to={`/product/${product._id}`}>
                  <div className="relative">
                    <img
                      src={getImage(product)}
                      alt={product.title}
                      className="h-48 w-full object-cover"
                    />
                    <button
                      onClick={(e) => { e.preventDefault(); toggleItem(product); }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-slate-900/80 flex items-center justify-center hover:bg-slate-800 transition"
                    >
                      <Heart
                        size={16}
                        className={
                          isWishlisted(product._id)
                            ? "fill-blue-500 text-blue-500"
                            : "text-white"
                        }
                      />
                    </button>
                  </div>

                  <div className="p-4 pb-0">
                    {product.storeId && (
                      <p className="text-xs text-slate-500 mb-1">
                        {product.storeId.storeName || "Store"}
                      </p>
                    )}

                    <h3 className="text-white font-semibold text-base leading-tight mb-1">
                      {product.title}
                    </h3>

                    {product.description && (
                      <p className="text-slate-400 text-sm line-clamp-2 mb-3">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <p className="text-blue-500 font-bold text-lg">
                        ₹{product.price?.toLocaleString()}
                      </p>

                      <span className="text-xs text-slate-500">
                        {product.stockQuantity > 0
                          ? product.stockQuantity + " left"
                          : "Out of stock"}
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="p-4 pt-3">
                  <button
                    onClick={() => addItem(product)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors duration-200"
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
        )}
      </div>
    </div>
  );
}
