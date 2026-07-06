import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { Camera, User } from "lucide-react";
import axios from "axios";

const VendorProfile = () => {
  const { user, token, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({ username: "", phone: "", profilePic: "" });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/api/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const u = res.data.user;
        setForm({ username: u.username, phone: u.phone || "", profilePic: u.profilePic || "" });
        updateUser(u);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await axios.post("http://localhost:5000/api/upload", fd, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setForm((p) => ({ ...p, profilePic: res.data.url }));
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.put("http://localhost:5000/api/user/profile", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      updateUser(res.data.user);
      setEditing(false);
    } catch {
      alert("Failed to update profile");
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
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8">
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
    </div>
  );
};

export default VendorProfile;
