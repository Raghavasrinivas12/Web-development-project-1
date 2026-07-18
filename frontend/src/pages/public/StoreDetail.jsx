import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Store, MapPin, Package, Star } from "lucide-react";
import axios from "axios";
import API from "../../config";

const StoreDetail = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/api/stores/${id}`),
      axios.get(`${API}/api/products?storeId=${id}`),
    ])
      .then(([storeRes, prodRes]) => {
        setStore(storeRes.data.store);
        setProducts(prodRes.data.products);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Store not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
            {store.logoUrl ? (
              <img src={store.logoUrl} alt="" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <Store size={32} className="text-blue-400" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{store.storeName}</h1>
            {store.description && <p className="text-slate-400 text-sm mt-1">{store.description}</p>}
            <p className="text-xs text-slate-500 mt-1">
              {products.length} product{products.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Package size={20} className="text-blue-400" /> Products
        </h2>

        {products.length === 0 ? (
          <p className="text-slate-500">No products in this store yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-blue-500 transition group"
              >
                <div className="h-40 overflow-hidden">
                  <img
                    src={product.images?.[0] || "https://via.placeholder.com/300"}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm truncate">{product.title}</h3>
                  <p className="text-blue-500 font-bold mt-1">₹{product.price.toLocaleString("en-IN")}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreDetail;
