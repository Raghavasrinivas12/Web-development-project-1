import { useState, useEffect } from "react";
import { Package, Boxes, AlertTriangle, CircleX } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const API = "http://localhost:5000";

const VendorInventory = () => {
  const { token } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stockValue, setStockValue] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    axios.get(`${API}/api/stores/my-store`, { headers })
      .then((res) => axios.get(`${API}/api/products?storeId=${res.data.store._id}`, { headers }))
      .then((res) => setProducts(res.data.products))
      .catch(() => toast.error("Failed to load inventory"))
      .finally(() => setLoading(false));
  }, []);

  const updateStock = async () => {
    if (!selectedProduct) return;
    const newStock = Number(stockValue);
    if (isNaN(newStock) || newStock < 0) {
      toast.error("Stock quantity must be 0 or more");
      return;
    }
    setUpdating(true);
    try {
      const res = await axios.put(`${API}/api/products/${selectedProduct._id}`, {
        storeId: storeIdStr(selectedProduct),
        title: selectedProduct.title,
        price: selectedProduct.price,
        stockQuantity: newStock,
      }, { headers });
      setProducts((prev) => prev.map((p) => (p._id === selectedProduct._id ? res.data.product : p)));
      toast.success("Stock updated");
      setShowModal(false);
      setSelectedProduct(null);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to update stock");
    } finally {
      setUpdating(false);
    }
  };

    const storeIdStr = (p) => (typeof p.storeId === "object" ? p.storeId._id : p.storeId);

  const getStatus = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 5) return "Low Stock";
    return "In Stock";
  };

  const statusClass = (status) => {
    if (status === "In Stock") return "bg-green-500/20 text-green-400";
    if (status === "Low Stock") return "bg-yellow-500/20 text-yellow-400";
    return "bg-red-500/20 text-red-400";
  };

  const filteredProducts = products.filter((p) => {
    const status = getStatus(p.stockQuantity);
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = statusFilter === "All" || status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const statCounts = {
    total: products.length,
    inStock: products.filter((p) => getStatus(p.stockQuantity) === "In Stock").length,
    lowStock: products.filter((p) => getStatus(p.stockQuantity) === "Low Stock").length,
    outOfStock: products.filter((p) => getStatus(p.stockQuantity) === "Out of Stock").length,
  };

  const pct = (num) => (products.length ? Math.round((num / products.length) * 100) : 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <p className="text-slate-400 mt-2">Manage product stock and inventory levels.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Products", value: statCounts.total, icon: Package, color: "text-blue-500" },
          { label: "In Stock", value: statCounts.inStock, icon: Boxes, color: "text-green-500" },
          { label: "Low Stock", value: statCounts.lowStock, icon: AlertTriangle, color: "text-yellow-500" },
          { label: "Out of Stock", value: statCounts.outOfStock, icon: CircleX, color: "text-red-500" },
        ].map((item) => (
          <div key={item.label} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-400 text-sm">{item.label}</p>
                <h2 className="text-3xl font-bold mt-2">{item.value}</h2>
              </div>
              <item.icon size={32} className={item.color} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <input type="text" placeholder="Search by Product..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500">
            <option>All Stock</option>
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr>
              <th className="text-left px-6 py-4">Product</th>
              <th className="text-left px-6 py-4">SKU</th>
              <th className="text-left px-6 py-4">Price</th>
              <th className="text-left px-6 py-4">Stock</th>
              <th className="text-left px-6 py-4">Status</th>
              <th className="text-left px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => {
              const status = getStatus(p.stockQuantity);
              const sku = `SKU-${p._id.slice(-6).toUpperCase()}`;
              return (
                <tr key={p._id} className="border-t border-slate-800 hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-medium">{p.title}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{sku}</td>
                  <td className="px-6 py-4 text-green-400">₹{p.price.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-4">{p.stockQuantity}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${statusClass(status)}`}>{status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => { setSelectedProduct(p); setStockValue(p.stockQuantity); setShowModal(true); }}
                      className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition">Update Stock</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h2 className="text-2xl font-bold">Update Stock</h2>
              <button onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-2xl">&times;</button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="text-slate-400 text-sm">Product</label>
                <h3 className="font-semibold mt-1">{selectedProduct.title}</h3>
              </div>
              <div>
                <label className="block text-slate-400 mb-2">Stock Quantity</label>
                <input type="number" min="0" value={stockValue}
                  onChange={(e) => setStockValue(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500" />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-slate-800">
              <button onClick={() => setShowModal(false)}
                className="bg-slate-700 hover:bg-slate-600 px-5 py-2 rounded-lg">Cancel</button>
              <button onClick={updateStock} disabled={updating}
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 px-5 py-2 rounded-lg">
                {updating ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">Stock Overview</h2>
          <div className="space-y-5">
            {[
              { label: "In Stock", pct: pct(statCounts.inStock), color: "bg-green-500", textColor: "text-green-400" },
              { label: "Low Stock", pct: pct(statCounts.lowStock), color: "bg-yellow-500", textColor: "text-yellow-400" },
              { label: "Out of Stock", pct: pct(statCounts.outOfStock), color: "bg-red-500", textColor: "text-red-400" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between mb-2">
                  <span>{item.label}</span>
                  <span className={item.textColor}>{item.pct}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3">
                  <div className={`${item.color} h-3 rounded-full`} style={{ width: `${item.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">Low Stock Products</h2>
          <div className="space-y-4">
            {products.filter((p) => getStatus(p.stockQuantity) !== "In Stock").length === 0 && (
              <p className="text-slate-500 text-sm">All products are well stocked.</p>
            )}
            {products.filter((p) => getStatus(p.stockQuantity) !== "In Stock").map((p) => {
              const status = getStatus(p.stockQuantity);
              return (
                <div key={p._id} className="flex justify-between items-center bg-slate-800 rounded-lg p-4">
                  <div>
                    <h3 className="font-medium">{p.title}</h3>
                    <p className="text-sm text-slate-400">SKU: SKU-{p._id.slice(-6).toUpperCase()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${statusClass(status)}`}>{p.stockQuantity} Left</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
        <p className="text-slate-400">Showing {filteredProducts.length} of {products.length} Products</p>
      </div>
    </div>
  );
};

export default VendorInventory;
