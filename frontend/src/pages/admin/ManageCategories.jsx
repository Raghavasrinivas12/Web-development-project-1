import { useState, useEffect, useRef } from "react";
import { Folder, Search, Plus, Edit, Trash2, Upload } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const addFileRef = useRef(null);
  const editFileRef = useRef(null);
  const [newCategory, setNewCategory] = useState({ image: "", name: "", isActive: true });
  const [editCategory, setEditCategory] = useState({ _id: "", image: "", name: "", isActive: true });

  const token = () => localStorage.getItem("token");
  const headers = () => ({ headers: { Authorization: `Bearer ${token()}` } });

  const fetchCategories = () => {
    axios.get("/api/admin/categories", headers())
      .then((res) => setCategories(res.data.categories))
      .catch(() => toast.error("Failed to load categories"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories() }, []);

  const uploadImage = async (file, cb) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("folder", "shophub/categories");
      const res = await axios.post("/api/upload/single", fd, {
        headers: { Authorization: `Bearer ${token()}`, "Content-Type": "multipart/form-data" },
      });
      cb(res.data.url);
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const addCategory = () => {
    if (!newCategory.name.trim()) return;
    axios.post("/api/admin/categories", newCategory, headers())
      .then(() => { fetchCategories(); setShowAddModal(false); toast.success("Category added"); })
      .catch((err) => toast.error(err.response?.data?.msg || "Failed to add category"));
    setNewCategory({ image: "", name: "", isActive: true });
  };

  const updateCategory = () => {
    axios.put(`/api/admin/categories/${editCategory._id}`, editCategory, headers())
      .then(() => { fetchCategories(); setShowEditModal(false); toast.success("Category updated"); })
      .catch((err) => toast.error(err.response?.data?.msg || "Failed to update category"));
  };

  const deleteCategory = (id) => {
    if (!window.confirm("Delete this category?")) return;
    axios.delete(`/api/admin/categories/${id}`, headers())
      .then(() => { fetchCategories(); toast.success("Category deleted"); })
      .catch(() => toast.error("Failed to delete category"));
  };

  const filtered = categories.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-center text-slate-400 py-20 text-base">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Folder size={28} className="text-blue-500" />
          <div>
            <h1 className="text-2xl font-bold">Manage Categories</h1>
            <p className="text-slate-400 text-sm">Add, edit and manage product categories</p>
          </div>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-8">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
          <input type="text" placeholder="Search Category..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-11 pr-4 py-3 text-sm outline-none focus:border-blue-500" />
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-5">Add Category</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Category Image</label>
                {newCategory.image ? (
                  <div className="relative inline-block">
                    <img src={newCategory.image} alt="Preview" className="w-24 h-24 rounded-lg object-cover border border-slate-700" />
                    <button onClick={() => setNewCategory({ ...newCategory, image: "" })}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs">&times;</button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-700 rounded-lg p-4 text-center hover:border-blue-500 transition cursor-pointer block bg-slate-800/30">
                    <input ref={addFileRef} type="file" accept="image/*" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f, (url) => setNewCategory({ ...newCategory, image: url })); }} />
                    <Upload size={20} className="text-blue-400 mx-auto mb-1" />
                    <p className="text-blue-400 text-sm font-medium">{uploading ? "Uploading..." : "Click to Upload"}</p>
                  </label>
                )}
              </div>
              <input type="text" placeholder="Category Name" value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm outline-none" />
              <select value={newCategory.isActive} onChange={(e) => setNewCategory({ ...newCategory, isActive: e.target.value === "true" })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm outline-none">
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowAddModal(false); }} className="bg-slate-700 hover:bg-slate-600 px-5 py-2 rounded-lg text-sm">Cancel</button>
              <button onClick={addCategory} className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg text-sm">Add Category</button>
            </div>
          </div>
        </div>
      )}

      <div className="hidden lg:block bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800 text-sm">
            <tr>
              <th className="text-left p-4">Image</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Products</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Created</th>
              <th className="text-center p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((cat) => (
              <tr key={cat._id} className="border-t border-slate-800 hover:bg-slate-800 text-sm">
                <td className="p-4">
                  <img src={cat.image} alt={cat.name} className="w-14 h-14 rounded-lg object-cover" />
                </td>
                <td className="p-4">
                  <h3 className="font-semibold">{cat.name}</h3>
                </td>
                <td className="p-4">{cat.productCount || 0}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${cat.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    {cat.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-4">{new Date(cat.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <div className="flex justify-center gap-3">
                    <button onClick={() => { setEditCategory(cat); setShowEditModal(true); }}
                      className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg"><Edit size={18} /></button>
                    <button onClick={() => deleteCategory(cat._id)} className="bg-slate-500 hover:bg-slate-600 p-2 rounded-lg"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden space-y-5">
        {filtered.map((cat) => (
          <div key={cat._id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <img src={cat.image} alt={cat.name} className="w-20 h-20 rounded-lg object-cover mb-4" />
            <h2 className="text-lg font-semibold">{cat.name}</h2>
            <p className="mt-2 text-sm">Products: {cat.productCount || 0}</p>
            <p className="text-xs text-slate-500 mt-1">Created: {new Date(cat.createdAt).toLocaleDateString()}</p>
            <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs ${cat.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
              {cat.isActive ? "Active" : "Inactive"}
            </span>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => { setEditCategory(cat); setShowEditModal(true); }}
                className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg"><Edit size={18} /></button>
              <button onClick={() => deleteCategory(cat._id)} className="bg-slate-500 hover:bg-slate-600 p-2 rounded-lg"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-5">Edit Category</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Category Image</label>
                {editCategory.image ? (
                  <div className="relative inline-block">
                    <img src={editCategory.image} alt="Preview" className="w-24 h-24 rounded-lg object-cover border border-slate-700" />
                    <button onClick={() => setEditCategory({ ...editCategory, image: "" })}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs">&times;</button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-700 rounded-lg p-4 text-center hover:border-blue-500 transition cursor-pointer block bg-slate-800/30">
                    <input ref={editFileRef} type="file" accept="image/*" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f, (url) => setEditCategory({ ...editCategory, image: url })); }} />
                    <Upload size={20} className="text-blue-400 mx-auto mb-1" />
                    <p className="text-blue-400 text-sm font-medium">{uploading ? "Uploading..." : "Click to Upload"}</p>
                  </label>
                )}
              </div>
              <input type="text" placeholder="Category Name" value={editCategory.name}
                onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm outline-none" />
              <select value={editCategory.isActive} onChange={(e) => setEditCategory({ ...editCategory, isActive: e.target.value === "true" })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm outline-none">
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowEditModal(false); }} className="bg-slate-700 hover:bg-slate-600 px-5 py-2 rounded-lg text-sm">Cancel</button>
              <button onClick={updateCategory} className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg text-sm">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
