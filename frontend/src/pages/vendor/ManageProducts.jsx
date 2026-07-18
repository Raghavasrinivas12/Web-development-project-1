import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Eye, SquarePen, Trash2, Package, Upload } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

import API from "../../config";

const ManageProducts = () => {
  const { token } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  const [products, setProducts] = useState([]);
  const [storeId, setStoreId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "", category: "", brand: "", price: "", discount: "",
    stock: "", status: "Active", variants: "", description: "", images: [],
  });

  useEffect(() => {
    axios.get(`${API}/api/stores/my-store`, { headers })
      .then((res) => {
        const sid = res.data.store._id;
        setStoreId(sid);
        return axios.get(`${API}/api/products?storeId=${sid}`, { headers });
      })
      .then((res) => setProducts(res.data.products))
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setForm({ title: "", category: "", brand: "", price: "", discount: "",
      stock: "", status: "Active", variants: "", description: "", images: [] });
    setEditingProduct(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setForm({
      title: product.title,
      category: product.category || "",
      brand: "",
      price: product.price.toString(),
      discount: "",
      stock: product.stockQuantity.toString(),
      status: product.stockQuantity === 0 ? "Out of Stock" : "Active",
      variants: (product.variants || []).join(","),
      description: product.description || "",
      images: product.images || [],
    });
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append("images", f));
      fd.append("folder", "shophub/products");
      const res = await axios.post(`${API}/api/upload`, fd, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });
      setForm((p) => ({ ...p, images: [...p.images, ...res.data.urls] }));
      toast.success(`${res.data.urls.length} image(s) uploaded`);
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index) => {
    setForm((p) => ({ ...p, images: p.images.filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    if (!form.title || !form.price || !form.stock) {
      toast.error("Title, price, and stock are required");
      return;
    }
    const payload = {
      storeId,
      title: form.title,
      description: form.description || undefined,
      price: Number(form.price),
      stockQuantity: Number(form.stock),
      category: form.category || undefined,
      images: form.images.length ? form.images : [],
      variants: form.variants ? form.variants.split(",").map((v) => v.trim()).filter(Boolean) : [],
    };
    try {
      if (editingProduct) {
        const res = await axios.put(`${API}/api/products/${editingProduct._id}`, payload, { headers });
        setProducts((prev) => prev.map((p) => (p._id === editingProduct._id ? res.data.product : p)));
        toast.success("Product updated");
      } else {
        const res = await axios.post(`${API}/api/products`, payload, { headers });
        setProducts((prev) => [res.data.product, ...prev]);
        toast.success("Product created");
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to save product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API}/api/products/${id}`, { headers });
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const getStockBadge = (stock) => {
    if (stock === 0) return "bg-red-500/10 text-red-400 border border-red-500/20";
    if (stock <= 5) return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
    return "bg-green-500/10 text-green-400 border border-green-500/20";
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || product.category === categoryFilter;
    const matchesStock =
      stockFilter === "All" ||
      (stockFilter === "In Stock" && product.stockQuantity > 5) ||
      (stockFilter === "Low Stock" && product.stockQuantity > 0 && product.stockQuantity <= 5) ||
      (stockFilter === "Out of Stock" && product.stockQuantity === 0);
    return matchesSearch && matchesCategory && matchesStock;
  });

  const allCategories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Products</h1>
          <p className="text-slate-400 mt-2">Manage your store products, pricing, stock and product details.</p>
        </div>
        <button onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-lg shadow-blue-600/10 transition text-sm w-full md:w-auto flex items-center gap-2">
          <Plus size={18} /> Add New Product
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search products..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-10 pr-4 outline-none focus:border-blue-500 text-white" />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500 text-white">
            <option value="All">All Categories</option>
            {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500 text-white">
            <option value="All">All Stock</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
          <div className="bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center">
            <p className="text-slate-300 font-medium">Total Products : <span className="text-blue-400 font-bold ml-2">{filteredProducts.length}</span></p>
          </div>
        </div>
      </div>

      <div className="hidden lg:block bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr className="text-slate-300 text-sm">
              <th className="text-left px-6 py-4">Product</th>
              <th className="text-left px-6 py-4">Category</th>
              <th className="text-left px-6 py-4">Price</th>
              <th className="text-left px-6 py-4">Stock</th>
              <th className="text-left px-6 py-4">Variants</th>
              <th className="text-left px-6 py-4">Status</th>
              <th className="text-center px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id} className="border-t border-slate-800 hover:bg-slate-800/40 transition">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <img src={product.images?.[0] || "https://via.placeholder.com/70"} alt={product.title}
                      className="w-16 h-16 rounded-lg object-cover border border-slate-700" />
                    <div>
                      <Link to={`/product/${product._id}`} className="font-semibold text-white hover:text-blue-400 transition">{product.title}</Link>
                      <p className="text-slate-400 text-sm">ID : {product._id.slice(-6)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-slate-300">{product.category || "—"}</td>
                <td className="px-6 py-5 font-semibold text-green-400">₹{product.price.toLocaleString("en-IN")}</td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStockBadge(product.stockQuantity)}`}>
                    {product.stockQuantity}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex gap-2 flex-wrap">
                    {(product.variants || []).map((v, i) => (
                      <span key={i} className="bg-slate-800 border border-slate-700 px-2 py-1 rounded text-xs text-white">{v}</span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-5">
                  {product.stockQuantity === 0 ? (
                    <span className="text-red-400 font-medium">Out of Stock</span>
                  ) : product.stockQuantity <= 5 ? (
                    <span className="text-yellow-400 font-medium">Low Stock</span>
                  ) : (
                    <span className="text-green-400 font-medium">Active</span>
                  )}
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-center gap-3">
                    <Link to={`/product/${product._id}`} className="bg-slate-800 hover:bg-blue-600 p-2 rounded-lg transition text-white inline-flex"><Eye size={18} /></Link>
                    <button onClick={() => openEditModal(product)} className="bg-slate-800 hover:bg-green-600 p-2 rounded-lg transition text-white"><SquarePen size={18} /></button>
                    <button onClick={() => handleDelete(product._id)} className="bg-slate-800 hover:bg-red-600 p-2 rounded-lg transition text-white"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h2 className="text-2xl font-bold text-white">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }}
                className="text-2xl text-slate-400 hover:text-white">&times;</button>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm text-slate-400">Product Name *</label>
                  <input type="text" name="title" value={form.title} onChange={handleChange}
                    className="w-full mt-2 bg-slate-800 rounded-lg px-4 py-3 text-white border border-slate-700 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="text-sm text-slate-400">Category</label>
                  <select name="category" value={form.category} onChange={handleChange}
                    className="w-full mt-2 bg-slate-800 rounded-lg px-4 py-3 text-white border border-slate-700 focus:border-blue-500 outline-none">
                    <option value="">Select Category</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Electronics">Electronics</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Price *</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange}
                    className="w-full mt-2 bg-slate-800 rounded-lg px-4 py-3 text-white border border-slate-700 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="text-sm text-slate-400">Stock *</label>
                  <input type="number" name="stock" value={form.stock} onChange={handleChange}
                    className="w-full mt-2 bg-slate-800 rounded-lg px-4 py-3 text-white border border-slate-700 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="text-sm text-slate-400">Variants</label>
                  <input type="text" name="variants" placeholder="S,M,L" value={form.variants} onChange={handleChange}
                    className="w-full mt-2 bg-slate-800 rounded-lg px-4 py-3 text-white border border-slate-700 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="text-sm text-slate-400">Status</label>
                  <select name="status" value={form.status} onChange={handleChange}
                    className="w-full mt-2 bg-slate-800 rounded-lg px-4 py-3 text-white border border-slate-700 focus:border-blue-500 outline-none">
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-slate-400">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                    className="w-full mt-2 bg-slate-800 rounded-lg px-4 py-3 text-white border border-slate-700 focus:border-blue-500 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-slate-400 block mb-2">Product Images</label>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative">
                        <img src={img} alt="" className="w-24 h-24 object-cover rounded-lg border border-slate-700" />
                        <button onClick={() => removeImage(i)}
                          className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs">&times;</button>
                      </div>
                    ))}
                  </div>
                  <label className="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center hover:border-blue-500 transition cursor-pointer block bg-slate-800/30">
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} multiple className="hidden" />
                    <Upload size={22} className="text-blue-400 mx-auto mb-1" />
                    <p className="text-blue-400 font-medium text-sm">{uploading ? "Uploading..." : "Click to Upload Images"}</p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 10MB each</p>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-800 p-6">
              <button onClick={() => { setShowModal(false); resetForm(); }}
                className="bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-lg text-white">Cancel</button>
              <button onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition text-white">Save Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
