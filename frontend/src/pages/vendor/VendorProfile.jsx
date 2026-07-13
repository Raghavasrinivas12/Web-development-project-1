import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { Camera, User, Store, Package, ShoppingCart, IndianRupee } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const API = "http://localhost:5000";

const VendorProfile = () => {
  const { user, token, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({ username: "", phone: "", profilePic: "" });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [store, setStore] = useState(null);
  const [stats, setStats] = useState(null);
  const [storeLoading, setStoreLoading] = useState(true);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/api/user/profile`, { headers }),
      axios.get(`${API}/api/stores/my-store`, { headers }).catch(() => null),
      axios.get(`${API}/api/stores/stats`, { headers }).catch(() => null),
    ])
      .then(([profRes, storeRes, statsRes]) => {
        const u = profRes.data.user;
        setForm({ username: u.username, phone: u.phone || "", profilePic: u.profilePic || "" });
        updateUser(u);
        if (storeRes) setStore(storeRes.data.store);
        if (statsRes) setStats(statsRes.data);
      })
      .catch(() => {})
      .finally(() => { setLoading(false); setStoreLoading(false); });
  }, []);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await axios.post(`${API}/api/upload`, fd, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });
      setForm((p) => ({ ...p, profilePic: res.data.url }));
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.put(`${API}/api/user/profile`, form, { headers });
      updateUser(res.data.user);
      setEditing(false);
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) setForm({ username: user.username, phone: user.phone || "", profilePic: user.profilePic || "" });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Vendor Profile</h1>
        <p className="text-slate-400 mt-1">Manage your account and store information.</p>
      </div>

      <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <div className="flex flex-col items-center">
          <div className="relative">
            {form.profilePic ? (
              <img src={form.profilePic} alt="avatar" className="w-24 h-24 rounded-full object-cover border-2 border-blue-500" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-3xl font-bold text-white">
                {user?.username?.charAt(0)?.toUpperCase() || <User size={32} />}
              </div>
            )}
            {editing && (
              <>
                <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center border-2 border-slate-900 disabled:opacity-50">
                  <Camera size={14} />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </>
            )}
          </div>
          {uploading && <p className="text-blue-400 text-xs mt-2">Uploading...</p>}
          <h1 className="text-2xl font-bold text-white mt-4">{user?.username}</h1>
          <p className="text-slate-400 text-sm capitalize">{user?.role}</p>
        </div>

        <div className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
            {editing ? (
              <input type="text" name="username" value={form.username} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500" />
            ) : (
              <p className="text-white px-4 py-2.5 bg-slate-800/30 rounded-xl">{user?.username}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <p className="text-white px-4 py-2.5 bg-slate-800/30 rounded-xl">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
            {editing ? (
              <input type="text" name="phone" value={form.phone} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500" />
            ) : (
              <p className="text-white px-4 py-2.5 bg-slate-800/30 rounded-xl">{user?.phone || "—"}</p>
            )}
          </div>

          <div className="pt-4 flex gap-3">
            {editing ? (
              <>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 py-2.5 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl disabled:opacity-50">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button onClick={handleCancel}
                  className="flex-1 py-2.5 px-6 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)}
                className="w-full py-2.5 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl">
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {store && (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Store className="text-blue-500" size={24} />
            <div>
              <h2 className="text-xl font-semibold text-white">Store Information</h2>
              <p className="text-slate-400 text-sm">Your registered store details.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-6">
            {store.logoUrl ? (
              <img src={store.logoUrl} alt="Store" className="w-16 h-16 rounded-xl object-cover border border-slate-700" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center">
                <Store size={28} className="text-slate-500" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold">{store.storeName}</h3>
              {store.description && <p className="text-sm text-slate-400 mt-1">{store.description}</p>}
              <span className={`inline-block mt-2 px-3 py-0.5 rounded-full text-xs ${
                store.isApproved === "Approved" ? "bg-green-500/20 text-green-400"
                : store.isApproved === "Rejected" ? "bg-red-500/20 text-red-400"
                : "bg-yellow-500/20 text-yellow-400"
              }`}>{store.isApproved || "Pending"}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {[
              { label: "Products", value: store.productCount ?? 0, icon: Package, color: "text-yellow-500" },
              { label: "Orders", value: stats?.orderCount ?? 0, icon: ShoppingCart, color: "text-pink-500" },
              { label: "Revenue", value: "₹" + ((stats?.revenue ?? 0)).toLocaleString("en-IN"), icon: IndianRupee, color: "text-emerald-500" },
            ].map((item) => (
              <div key={item.label} className="bg-slate-800 rounded-xl p-4 flex items-center gap-3">
                <item.icon size={20} className={item.color} />
                <div>
                  <p className="text-xs text-slate-400">{item.label}</p>
                  <p className="text-lg font-bold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!store && !storeLoading && (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <Store size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No store registered yet.</p>
        </div>
      )}
    </div>
  );
};

export default VendorProfile;
