import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Camera } from "lucide-react";
import axios from "axios";
import API_URL from "../../config";

export default function Profile() {
  const { user, token, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: "", phone: "", profilePic: "" });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const u = res.data.user;
      setForm({ username: u.username, phone: u.phone || "", profilePic: u.profilePic || "" });
      updateUser(u);
    } catch {
      logout();
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await axios.post(`${API_URL}/api/upload`, fd, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setForm((prev) => ({ ...prev, profilePic: res.data.url }));
    } catch {
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.put(`${API_URL}/api/user/profile`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      updateUser(res.data.user);
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setForm({
        username: user.username,
        phone: user.phone || "",
        profilePic: user.profilePic || "",
      });
    }
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-16 px-4">
      <div className="max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black/40 p-8">
        <div className="flex flex-col items-center">
          <div className="relative">
            {form.profilePic ? (
              <img
                src={form.profilePic}
                alt="avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-3xl font-bold text-white">
                {user?.username?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}

            {editing && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center border-2 border-slate-900 transition disabled:opacity-50"
                >
                  <Camera size={14} className="text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </>
            )}
          </div>

          {uploading && (
            <p className="text-blue-400 text-xs mt-2">Uploading...</p>
          )}

          <h1 className="text-2xl font-bold text-white mt-4">
            {user?.username}
          </h1>
          <p className="text-slate-400 text-sm capitalize">{user?.role}</p>
        </div>

        <div className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
            {editing ? (
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
              />
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
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
              />
            ) : (
              <p className="text-white px-4 py-2.5 bg-slate-800/30 rounded-xl">{user?.phone || "—"}</p>
            )}
          </div>

          <div className="pt-4 flex gap-3">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-2.5 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 py-2.5 px-6 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="w-full py-2.5 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-200"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
