import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Package, Search, Trash2, IndianRupee } from "lucide-react";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProducts = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProducts(res.data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts() }, []);

  const deleteProduct = (id) => {
    if (!window.confirm("Delete this product?")) return;
    const token = localStorage.getItem("token");
    axios
      .delete(`http://localhost:5000/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => fetchProducts())
      .catch(console.error);
  };

  const filtered = products.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-center text-slate-400 py-20 text-base">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Package className="text-blue-500" size={28} />
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-slate-400 mt-1">Manage all products across stores.</p>
        </div>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
        <input type="text" placeholder="Search by product name..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-11 pr-4 py-3 text-sm outline-none focus:border-blue-500" />
      </div>

      <div className="hidden lg:block bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr className="text-left text-sm">
              <th className="p-4">Product</th><th className="p-4">Store</th><th className="p-4">Price</th>
              <th className="p-4">Stock</th><th className="p-4">Category</th><th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p._id} className="border-t border-slate-800 hover:bg-slate-800 text-sm">
                <td className="p-4 font-medium">
                  <Link to={`/product/${p._id}`} className="hover:text-blue-400 transition">{p.title}</Link>
                </td>
                <td className="p-4">{p.storeId?.storeName || "-"}</td>
                <td className="p-4"><span className="flex items-center gap-0.5"><IndianRupee size={14} />{p.price?.toLocaleString("en-IN")}</span></td>
                <td className="p-4">{p.stockQuantity}</td>
                <td className="p-4">{p.category || "-"}</td>
                <td className="p-4">
                  <div className="flex justify-center">
                    <button onClick={() => deleteProduct(p._id)} className="bg-red-500 hover:bg-red-600 p-2 rounded-lg"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden space-y-4">
        {filtered.map((p) => (
          <div key={p._id} className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <div className="flex justify-between items-start">
              <div>
                <Link to={`/product/${p._id}`} className="text-xl font-semibold hover:text-blue-400 transition">{p.title}</Link>
                <p className="text-slate-400 text-sm mt-1">{p.storeId?.storeName || "-"}</p>
              </div>
              <button onClick={() => deleteProduct(p._id)} className="bg-red-500 hover:bg-red-600 p-2 rounded-lg shrink-0"><Trash2 size={18} /></button>
            </div>
            <div className="flex gap-5 mt-4 text-sm text-slate-300">
              <span className="flex items-center gap-1"><IndianRupee size={14} />{p.price?.toLocaleString("en-IN")}</span>
              <span>Stock: {p.stockQuantity}</span>
              <span>{p.category || "-"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
