import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  User, Camera, Edit3, Mail, Phone, Shield, Calendar,
  Eye, EyeOff, Lock, Users, Store, ShoppingCart, FileText,
} from "lucide-react";

const AdminProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const personalInfoRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({ username: "", phone: "", profilePic: "" });
  const [originalForm, setOriginalForm] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const token = () => localStorage.getItem("token");
  const headers = () => ({ headers: { Authorization: `Bearer ${token()}` } });

  useEffect(() => {
    const t = token();
    if (!t) { navigate("/login"); return; }
    Promise.all([
      axios.get("http://localhost:5000/api/user/profile", headers()),
      axios.get("http://localhost:5000/api/admin/stats", headers()),
      axios.get("http://localhost:5000/api/admin/activity-logs", headers()),
    ])
      .then(([profRes, statsRes, logsRes]) => {
        const u = profRes.data.user;
        setUserData(u);
        setForm({ username: u.username, phone: u.phone || "", profilePic: u.profilePic || "" });
        setOriginalForm({ username: u.username, phone: u.phone || "", profilePic: u.profilePic || "" });
        setStats(statsRes.data.stats);
        setLogs(logsRes.data.logs || []);
      })
      .catch(() => toast.error("Failed to load profile"))
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
        headers: { Authorization: `Bearer ${token()}`, "Content-Type": "multipart/form-data" },
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
      const res = await axios.put("http://localhost:5000/api/user/profile", form, headers());
      const u = res.data.user;
      setUserData(u);
      setOriginalForm({ username: u.username, phone: u.phone || "", profilePic: u.profilePic || "" });
      setEditing(false);
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (originalForm) setForm({ ...originalForm });
    setEditing(false);
  };

  const changePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) return toast.error("Fill all fields");
    if (newPassword.length < 6) return toast.error("Min 6 characters");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    setChangingPassword(true);
    try {
      await axios.put("http://localhost:5000/api/admin/settings/password",
        { currentPassword, newPassword }, headers());
      toast.success("Password changed");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
  };

  const formatDateTime = (d) => {
    if (!d) return "—";
    const date = new Date(d);
    return date.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })
      + " • " + date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  const logColor = (action) => {
    if (action.toLowerCase().includes("password")) return "border-red-500";
    if (action.toLowerCase().includes("backup") || action.toLowerCase().includes("cache")) return "border-yellow-500";
    if (action.toLowerCase().includes("logo") || action.toLowerCase().includes("setting")) return "border-green-500";
    return "border-blue-500";
  };

  if (loading) return <div className="text-center text-slate-400 py-20 text-base">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="flex items-center gap-3 mb-8">
        <User className="text-blue-500" size={30} />
        <div>
          <h1 className="text-3xl font-bold">Admin Profile</h1>
          <p className="text-slate-400">Manage your profile information.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            {form.profilePic ? (
              <img src={form.profilePic} alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-slate-800 flex items-center justify-center border-4 border-blue-500">
                <User size={60} />
              </div>
            )}
            {editing && (
              <>
                <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                  className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 disabled:opacity-50">
                  <Camera size={18} />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} hidden />
              </>
            )}
            {uploading && <p className="text-blue-400 text-xs mt-1 text-center">Uploading...</p>}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold">{userData?.username}</h2>
            <p className="text-slate-400 capitalize">{userData?.role?.replace("superadmin", "Super Admin")}</p>
            <div className="flex flex-wrap gap-5 mt-4 text-slate-300 justify-center md:justify-start">
              <div className="flex items-center gap-2"><Mail size={18} />{userData?.email}</div>
              <div className="flex items-center gap-2"><Phone size={18} />{userData?.phone || "—"}</div>
            </div>
            {!editing && (
              <button onClick={() => setEditing(true)}
                className="mt-6 bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg flex items-center gap-2 mx-auto md:mx-0">
                <Edit3 size={18} /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div ref={personalInfoRef} className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <User className="text-blue-500" size={24} />
          <div>
            <h2 className="text-xl font-semibold">Personal Information</h2>
            <p className="text-slate-400 text-sm">Update your personal details.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm text-slate-400">Username</label>
            {editing ? (
              <input type="text" name="username" value={form.username} onChange={handleChange}
                className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500" />
            ) : (
              <p className="mt-2 w-full bg-slate-800/30 rounded-lg px-4 py-3">{userData?.username}</p>
            )}
          </div>
          <div>
            <label className="text-sm text-slate-400">Email</label>
            <p className="mt-2 w-full bg-slate-800/30 rounded-lg px-4 py-3">{userData?.email}</p>
          </div>
          <div>
            <label className="text-sm text-slate-400">Phone</label>
            {editing ? (
              <input type="text" name="phone" value={form.phone} onChange={handleChange}
                className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500" />
            ) : (
              <p className="mt-2 w-full bg-slate-800/30 rounded-lg px-4 py-3">{userData?.phone || "—"}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="text-blue-500" size={24} />
          <div>
            <h2 className="text-xl font-semibold">Account Information</h2>
            <p className="text-slate-400 text-sm">View your account details.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm text-slate-400">Role</label>
            <input type="text" value={userData?.role?.replace("superadmin", "Super Admin") || "—"} readOnly
              className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3" />
          </div>
          <div>
            <label className="text-sm text-slate-400">Account Status</label>
            <div className="mt-2">
              <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm">Active</span>
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-400">Joined</label>
            <input type="text" value={formatDate(userData?.createdAt || userData?.id)} readOnly
              className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-slate-400 text-sm flex items-center gap-2"><Users size={16} /> Total Users</h3>
          <p className="text-3xl font-bold mt-3">{stats?.totalUsers ?? 0}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-slate-400 text-sm flex items-center gap-2"><Store size={16} /> Vendors</h3>
          <p className="text-3xl font-bold mt-3">{stats?.totalVendors ?? 0}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-slate-400 text-sm flex items-center gap-2"><ShoppingCart size={16} /> Orders</h3>
          <p className="text-3xl font-bold mt-3">{stats?.totalOrders ?? 0}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-slate-400 text-sm flex items-center gap-2"><FileText size={16} /> Products</h3>
          <p className="text-3xl font-bold mt-3">{stats?.totalProducts ?? 0}</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="text-blue-500" />
          <div>
            <h2 className="text-xl font-semibold">Change Password</h2>
            <p className="text-slate-400 text-sm">Update your account password.</p>
          </div>
        </div>
        <div className="mb-5">
          <label className="text-sm text-slate-400">Current Password</label>
          <div className="relative mt-2">
            <input type={showCurrent ? "text" : "password"} value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 pr-12 outline-none focus:border-blue-500" />
            <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-3 text-slate-400">
              {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <div className="mb-5">
          <label className="text-sm text-slate-400">New Password</label>
          <div className="relative mt-2">
            <input type={showNew ? "text" : "password"} value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 pr-12 outline-none focus:border-blue-500" />
            <button onClick={() => setShowNew(!showNew)} className="absolute right-4 top-3 text-slate-400">
              {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <div>
          <label className="text-sm text-slate-400">Confirm Password</label>
          <div className="relative mt-2">
            <input type={showConfirm ? "text" : "password"} value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 pr-12 outline-none focus:border-blue-500" />
            <button onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-3 text-slate-400">
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button onClick={changePassword} disabled={changingPassword}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg disabled:opacity-50">
            {changingPassword ? "Changing..." : "Change Password"}
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
        <div className="space-y-5">
          {logs.length === 0 && <p className="text-slate-500 text-center py-4">No activity yet.</p>}
          {logs.map((log) => (
            <div key={log._id} className={`border-l-4 ${logColor(log.action)} pl-4`}>
              <h3 className="font-medium">{log.action}</h3>
              {log.details && <p className="text-sm text-slate-400">{log.details}</p>}
              <p className="text-xs text-slate-500 mt-1">{formatDateTime(log.createdAt)}</p>
            </div>
          ))}
        </div>
      </div>

      {editing && (
        <div className="flex justify-end gap-4 mb-10">
          <button onClick={handleCancel} className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition flex items-center gap-2 disabled:opacity-50">
            <Edit3 size={18} /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
