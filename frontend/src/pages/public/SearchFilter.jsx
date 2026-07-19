import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Star, Heart, ShoppingCart } from "lucide-react";
import axios from "axios";
import API_URL from "../../config";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const categories = ["All", "Electronics", "Fashion", "Books", "Grocery", "Accessories"];

const SearchFilter = () => {
  const { addItem, items } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/products`);
      setProducts(res.data.products);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products
    .filter(
      (product) =>
        product.title?.toLowerCase().includes(search.toLowerCase()) &&
        (category === "All" || product.category === category.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Search & Filter Products</h1>

        <div className="relative mb-6">
          <Search size={20} className="absolute left-4 top-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-12 pr-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 outline-none"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 outline-none"
          >
            <option value="">Sort By</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-slate-900 rounded-xl overflow-hidden hover:scale-105 transition duration-300 border border-slate-800"
              >
                <Link to={`/product/${product._id}`}>
                  <div className="relative">
                    <img
                      src={product.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"}
                      alt={product.title}
                      className="w-full h-52 object-cover"
                    />
                    <button
                      onClick={(e) => { e.preventDefault(); toggleItem(product); }}
                      className="absolute top-3 right-3 bg-slate-950/70 p-2 rounded-full hover:text-blue-600"
                    >
                      <Heart
                        size={18}
                        className={isWishlisted(product._id) ? "fill-blue-500 text-blue-500" : ""}
                      />
                    </button>
                  </div>
                </Link>

                <div className="p-4">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-semibold text-lg hover:text-blue-400 transition">{product.title}</h3>
                  </Link>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center bg-green-600 px-2 py-1 rounded text-sm">
                      {product.rating || 4.0}
                      <Star size={12} className="ml-1 fill-white text-white" />
                    </div>
                  </div>

                  <p className="text-blue-500 text-xl font-bold mt-3">₹{product.price?.toLocaleString()}</p>

                  <div className="flex gap-2 mt-4">
                    <Link
                      to={`/product/${product._id}`}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 py-2 rounded-lg font-medium block text-center text-sm"
                    >
                      View Product
                    </Link>
                    <button
                      onClick={() => addItem(product)}
                      className="bg-slate-700 hover:bg-slate-600 p-2 rounded-lg"
                      title="Add to Cart"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center mt-10">
            <h2 className="text-xl text-slate-400">No Products Found</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
