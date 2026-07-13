import { useState, useEffect, useRef } from "react";
import { Save, Store, FileText, Image, Globe, Upload, Building2, Tag } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const API = "http://localhost:5000";

const StoreSettings = () => {
  const { token } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  const [form, setForm] = useState({ storeName: "", description: "", logoUrl: "" });
  const [storeId, setStoreId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    axios.get(`${API}/api/stores/my-store`, { headers })
      .then((res) => {
        const s = res.data.store;
        setStoreId(s._id);
        setForm({ storeName: s.storeName || "", description: s.description || "", logoUrl: s.logoUrl || "" });
      })
      .catch(() => toast.error("Failed to load store settings"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await axios.post(`${API}/api/upload`, fd, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });
      setForm((p) => ({ ...p, logoUrl: res.data.url }));
      toast.success("Logo uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!storeId) return;
    setSaving(true);
    try {
      const res = await axios.put(`${API}/api/stores/${storeId}`, {
        storename: form.storeName,
        description: form.description,
        logoUrl: form.logoUrl || undefined,
      }, { headers });
      toast.success(res.data.msg || "Store settings saved");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Store className="w-8 h-8 text-blue-400" /> Store Settings
            </h1>
            <p className="text-slate-400 mt-1 flex items-center gap-2">
              <Globe className="w-4 h-4" /> Configure your public storefront branding identity parameters
            </p>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-400" />
                <label className="block text-sm font-semibold text-slate-300">Store Brand Name</label>
              </div>
              <div className="relative">
                <input type="text" name="storeName" value={form.storeName} onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pl-11"
                  placeholder="Enter your store name" required />
                <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <label className="block text-sm font-semibold text-slate-300">Bio / Public Description</label>
              </div>
              <textarea rows={4} name="description" value={form.description} onChange={handleChange}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                placeholder="Describe your store and what makes it unique..." required />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4 text-blue-400" />
                <label className="block text-sm font-semibold text-slate-300">Branding Logo Asset</label>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input type="url" name="logoUrl" value={form.logoUrl} onChange={handleChange}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono text-xs pl-11"
                    placeholder="https://example.com/logo.png" />
                  <div className="relative mt-2">
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium transition flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />{uploading ? "Uploading..." : "Upload Image"}
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </div>
                </div>
                <div className="md:w-56 bg-slate-800/30 border border-slate-700 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-700 flex-shrink-0 bg-slate-800 flex items-center justify-center">
                    {form.logoUrl ? (
                      <img src={form.logoUrl} alt="Logo Preview" className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = "none"; }} />
                    ) : (
                      <Store className="w-6 h-6 text-slate-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-300 truncate">Logo Preview</p>
                    <p className="text-xs text-slate-500 truncate">{form.logoUrl ? "Live preview" : "No logo set"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500/50"></div>
                <span>All fields required</span>
              </div>
              <button type="submit" disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-6 rounded-xl text-sm shadow-md shadow-blue-600/20 transition flex items-center gap-2">
                {saving ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Saving...</>
                ) : (
                  <><Save className="w-4 h-4" /> Save Configuration</>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg"><Tag className="w-5 h-5 text-blue-400" /></div>
            <div>
              <h3 className="text-sm font-semibold text-slate-300">Need help with your store settings?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your store name and logo appear across your storefront. For best results,
                use a square logo (1:1 ratio) and keep your description informative.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreSettings;
