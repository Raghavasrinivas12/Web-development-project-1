import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../api/authService";

export default function Profile() {
  const { token, updateUser,logout } = useAuth();
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
      const data = await authService.getProfile();
      const u = data.user;
      setForm({ username: u.username, phone: u.phone || "", profilePic: u.profilePic || "" });
      updateUser(u);
    } catch (err) {
      console.error("Failed to recover profile mapping context:", err);
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
      const data = await authService.updateProfile(form);
      updateUser(data.user);
      setEditing(false);
    } catch (err) {
      console.error("Profile Write Rejection Layout Error: ", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you absolutely sure you want to permanently delete your ZAALIMA account? This cannot be undone.")) return;
    try {
      await authService.deleteAccount();
      logout();
      navigate("/signup");
    } catch (err) {
      console.error("Account Purge Exception Layout Error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-16 px-4 text-slate-100">
      <div className="max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center">
          {form.profilePic ? (
            <img src={form.profilePic} alt="avatar" className="w-20 h-20 rounded-full object-cover border-2 border-rose-500" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-rose-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-rose-600/20">
              {form.username?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
          <h1 className="text-2xl font-bold text-white mt-4 tracking-tight">{form.username}</h1>
        </div>

        <div className="mt-8 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Username</label>
            {editing ? (
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
              />
            ) : (
              <p className="text-white px-4 py-2.5 bg-slate-950/40 border border-slate-800/60 rounded-xl">{form.username}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Phone</label>
            {editing ? (
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
              />
            ) : (
              <p className="text-white px-4 py-2.5 bg-slate-950/40 border border-slate-800/60 rounded-xl">{form.phone || "—"}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Profile Picture URL</label>
            {editing ? (
              <input
                type="text"
                name="profilePic"
                value={form.profilePic}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-mono text-xs"
              />
            ) : (
              <p className="text-white px-4 py-2.5 bg-slate-950/40 border border-slate-800/60 rounded-xl truncate font-mono text-xs">{form.profilePic || "—"}</p>
            )}
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <div className="flex gap-3">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all cursor-pointer shadow-md shadow-rose-600/10"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button onClick={() => setEditing(false)} className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all cursor-pointer">
                    Cancel
                  </button>
                </>
              ) : (
                <button onClick={() => setEditing(true)} className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition-all cursor-pointer shadow-md shadow-rose-600/10">
                  Edit Profile
                </button>
              )}
            </div>
            
            {!editing && (
              <button 
                onClick={handleDeleteAccount}
                className="w-full mt-4 py-2 text-xs font-semibold text-red-500/70 hover:text-red-400 transition-colors border border-red-500/20 hover:border-red-500/40 bg-red-500/5 rounded-xl cursor-pointer"
              >
                Danger: Delete Account Permanently
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}