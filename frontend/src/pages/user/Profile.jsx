import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function Profile() {
  const { user, token, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: "", phone: "", profilePic: "" });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/profile", {
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

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.put("http://localhost:5000/api/user/profile", form, {
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
          {form.profilePic ? (
            <img
              src={form.profilePic}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-2xl font-bold text-white">
              {user?.username?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}

          <h1 className="text-2xl font-bold text-white mt-4">
            {user?.username}
          </h1>
          <p className="text-slate-400 text-sm capitalize">
            {user?.role}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Username
            </label>
            {editing ? (
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
              />
            ) : (
              <p className="text-white px-4 py-2.5 bg-slate-800/30 rounded-xl">
                {user?.username}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Email
            </label>
            <p className="text-white px-4 py-2.5 bg-slate-800/30 rounded-xl">
              {user?.email}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Phone
            </label>
            {editing ? (
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
              />
            ) : (
              <p className="text-white px-4 py-2.5 bg-slate-800/30 rounded-xl">
                {user?.phone || "—"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Profile Picture URL
            </label>
            {editing ? (
              <input
                type="text"
                name="profilePic"
                value={form.profilePic}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
              />
            ) : (
              <p className="text-white px-4 py-2.5 bg-slate-800/30 rounded-xl truncate">
                {user?.profilePic || "—"}
              </p>
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
