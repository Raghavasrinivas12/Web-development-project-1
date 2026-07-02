import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import {
  Settings, Store, ShieldCheck, Bell, Globe, FileText, Palette, Database, History, Save, Edit3, X, Upload, Download,
} from "lucide-react";

const PAGE_MAP = {
  "About Us": "aboutUs",
  "Contact Us": "contactUs",
  "Privacy Policy": "privacyPolicy",
  "Terms & Conditions": "termsConditions",
  "Shipping Policy": "shippingPolicy",
  "Return & Refund Policy": "returnRefundPolicy",
  FAQ: "faq",
};

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const logoRef = useRef(null);

  const [storeSettings, setStoreSettings] = useState({
    storeName: "", supportEmail: "", supportPhone: "", gstNumber: "", address: "",
  });
  const [logo, setLogo] = useState("");
  const [logoUploading, setLogoUploading] = useState(false);
  const [currency, setCurrency] = useState("₹ INR");
  const [language, setLanguage] = useState("English");
  const [timeZone, setTimeZone] = useState("Asia/Kolkata");
  const [taxPercentage, setTaxPercentage] = useState(18);
  const [emailNotification, setEmailNotification] = useState(true);
  const [orderNotification, setOrderNotification] = useState(true);
  const [vendorAlert, setVendorAlert] = useState(true);
  const [lowStockAlert, setLowStockAlert] = useState(false);
  const [pushNotification, setPushNotification] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [compactSidebar, setCompactSidebar] = useState(false);
  const [enableAnimations, setEnableAnimations] = useState(true);
  const [contentPages, setContentPages] = useState({});

  // Content editor
  const [showModal, setShowModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState("");
  const [selectedPageKey, setSelectedPageKey] = useState("");
  const [content, setContent] = useState("");
  const [contentSaving, setContentSaving] = useState(false);

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordChanging, setPasswordChanging] = useState(false);

  // Activity logs
  const [activityLogs, setActivityLogs] = useState([]);

  // System
  const [restoring, setRestoring] = useState(false);
  const restoreRef = useRef(null);

  const token = () => localStorage.getItem("token");
  const headers = () => ({ headers: { Authorization: `Bearer ${token()}` } });

  useEffect(() => {
    axios.get("/api/admin/settings", headers())
      .then((res) => {
        const s = res.data.settings;
        setStoreSettings({
          storeName: s.storeName || "",
          supportEmail: s.supportEmail || "",
          supportPhone: s.supportPhone || "",
          gstNumber: s.gstNumber || "",
          address: s.address || "",
        });
        setLogo(s.logo || "");
        setCurrency(s.currency || "₹ INR");
        setLanguage(s.language || "English");
        setTimeZone(s.timeZone || "Asia/Kolkata");
        setTaxPercentage(s.taxPercentage ?? 18);
        setEmailNotification(s.emailNotifications ?? true);
        setOrderNotification(s.orderNotifications ?? true);
        setVendorAlert(s.vendorAlerts ?? true);
        setLowStockAlert(s.lowStockAlerts ?? false);
        setPushNotification(s.pushNotifications ?? true);
        setDarkMode(s.darkMode ?? true);
        setCompactSidebar(s.compactSidebar ?? false);
        setEnableAnimations(s.enableAnimations ?? true);
        setContentPages({
          aboutUs: s.aboutUs || "",
          contactUs: s.contactUs || "",
          privacyPolicy: s.privacyPolicy || "",
          termsConditions: s.termsConditions || "",
          shippingPolicy: s.shippingPolicy || "",
          returnRefundPolicy: s.returnRefundPolicy || "",
          faq: s.faq || "",
        });
      })
      .catch(() => toast.error("Failed to load settings"))
      .finally(() => setLoading(false));

    axios.get("/api/admin/activity-logs", headers())
      .then((res) => setActivityLogs(res.data.logs))
      .catch(() => {});
  }, []);

  const saveSettings = () => {
    setSaving(true);
    axios.put("/api/admin/settings", {
      storeName: storeSettings.storeName,
      supportEmail: storeSettings.supportEmail,
      supportPhone: storeSettings.supportPhone,
      gstNumber: storeSettings.gstNumber,
      address: storeSettings.address,
      currency, language, timeZone, taxPercentage,
      emailNotifications: emailNotification,
      orderNotifications: orderNotification,
      vendorAlerts: vendorAlert,
      lowStockAlerts: lowStockAlert,
      pushNotifications: pushNotification,
      darkMode, compactSidebar, enableAnimations,
    }, headers())
      .then(() => { toast.success("Settings saved successfully!"); fetchLogs(); })
      .catch(() => toast.error("Failed to save settings"))
      .finally(() => setSaving(false));
  };

  const fetchLogs = () => {
    axios.get("/api/admin/activity-logs", headers())
      .then((res) => setActivityLogs(res.data.logs))
      .catch(() => {});
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("logo", file);
    setLogoUploading(true);
    try {
      const res = await axios.post("/api/admin/settings/logo", formData, {
        headers: { Authorization: `Bearer ${token()}`, "Content-Type": "multipart/form-data" },
      });
      setLogo(res.data.url);
      toast.success("Logo uploaded");
      fetchLogs();
    } catch {
      toast.error("Logo upload failed");
    } finally {
      setLogoUploading(false);
    }
  };

  const changePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error("Fill all password fields");
    }
    if (newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    setPasswordChanging(true);
    try {
      await axios.put("/api/admin/settings/password", { currentPassword, newPassword }, headers());
      toast.success("Password changed");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      fetchLogs();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to change password");
    } finally {
      setPasswordChanging(false);
    }
  };

  const openEditor = (title) => {
    const key = PAGE_MAP[title];
    setSelectedPage(title);
    setSelectedPageKey(key);
    setContent(contentPages[key] || `Enter ${title} content here...`);
    setShowModal(true);
  };

  const saveContent = async () => {
    setContentSaving(true);
    try {
      await axios.put("/api/admin/settings/content", { page: selectedPageKey, content }, headers());
      setContentPages((prev) => ({ ...prev, [selectedPageKey]: content }));
      toast.success(`${selectedPage} updated`);
      setShowModal(false);
      fetchLogs();
    } catch {
      toast.error("Failed to save content");
    } finally {
      setContentSaving(false);
    }
  };

  const downloadBackup = async () => {
    try {
      const res = await axios.get("/api/admin/backup", headers());
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `shophub-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Backup downloaded");
      fetchLogs();
    } catch {
      toast.error("Failed to download backup");
    }
  };

  const restoreBackup = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRestoring(true);
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      await axios.post("/api/admin/backup/restore", json, headers());
      toast.success("Backup restored");
      fetchLogs();
    } catch {
      toast.error("Failed to restore backup");
    } finally {
      setRestoring(false);
      if (restoreRef.current) restoreRef.current.value = "";
    }
  };

  const clearCache = async () => {
    try {
      await axios.post("/api/admin/clear-cache", {}, headers());
      toast.success("Cache cleared");
      fetchLogs();
    } catch {
      toast.error("Failed to clear cache");
    }
  };

  const logColor = (action) => {
    if (action.toLowerCase().includes("password")) return "border-red-500";
    if (action.toLowerCase().includes("backup")) return "border-yellow-500";
    if (action.toLowerCase().includes("logo") || action.toLowerCase().includes("setting")) return "border-green-500";
    return "border-blue-500";
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString();
  };

  if (loading) return <div className="text-center text-slate-400 py-20 text-base">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="flex items-center gap-3 mb-8">
        <Settings size={30} className="text-blue-500" />
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-slate-400">Configure your website settings.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Store size={24} className="text-blue-500" />
          <div>
            <h2 className="text-xl font-semibold">Store Settings</h2>
            <p className="text-slate-400 text-sm">Configure your store information.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm text-slate-400">Store Name</label>
            <input type="text" value={storeSettings.storeName}
              onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
              className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-sm text-slate-400">Support Email</label>
            <input type="email" value={storeSettings.supportEmail}
              onChange={(e) => setStoreSettings({ ...storeSettings, supportEmail: e.target.value })}
              className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-sm text-slate-400">Support Phone</label>
            <input type="text" value={storeSettings.supportPhone}
              onChange={(e) => setStoreSettings({ ...storeSettings, supportPhone: e.target.value })}
              className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-sm text-slate-400">GST Number</label>
            <input type="text" value={storeSettings.gstNumber}
              onChange={(e) => setStoreSettings({ ...storeSettings, gstNumber: e.target.value })}
              className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-slate-400">Store Address</label>
            <textarea rows="4" value={storeSettings.address}
              onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
              className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none resize-none focus:border-blue-500" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-slate-400">Store Logo</label>
            <div className="mt-2 flex items-center gap-4">
              {logo && (
                <img src={logo} alt="Logo" className="w-20 h-20 rounded-lg object-cover border border-slate-700" />
              )}
              <input type="file" ref={logoRef} accept="image/*" onChange={handleLogoChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 file:bg-blue-500 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg file:cursor-pointer" />
              {logoUploading && <span className="text-blue-400 text-sm">Uploading...</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="text-blue-500" />
          <div>
            <h2 className="text-xl font-semibold">Security</h2>
            <p className="text-slate-400 text-sm">Manage password and account security.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm text-slate-400">Current Password</label>
            <input type="password" placeholder="Enter current password" value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-sm text-slate-400">New Password</label>
            <input type="password" placeholder="Enter new password" value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-slate-400">Confirm Password</label>
            <input type="password" placeholder="Confirm password" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500" />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={changePassword} disabled={passwordChanging}
            className={`bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg ${passwordChanging ? "opacity-50 cursor-not-allowed" : ""}`}>
            {passwordChanging ? "Changing..." : "Change Password"}
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="text-blue-500" />
          <div>
            <h2 className="text-xl font-semibold">Notification Settings</h2>
            <p className="text-slate-400 text-sm">Control which notifications you receive.</p>
          </div>
        </div>
        {[
          { label: "Email Notifications", state: emailNotification, setter: setEmailNotification },
          { label: "Order Notifications", state: orderNotification, setter: setOrderNotification },
          { label: "Vendor Registration Alerts", state: vendorAlert, setter: setVendorAlert },
          { label: "Low Stock Alerts", state: lowStockAlert, setter: setLowStockAlert },
          { label: "Push Notifications", state: pushNotification, setter: setPushNotification },
        ].map(({ label, state, setter }) => (
          <div key={label} className="flex justify-between items-center bg-slate-800 rounded-lg px-5 py-4 mb-4">
            <span>{label}</span>
            <button onClick={() => setter(!state)}
              className={`relative w-14 h-7 rounded-full transition duration-300 ${state ? "bg-blue-500" : "bg-slate-600"}`}>
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all duration-300 ${state ? "left-8" : "left-1"}`} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="text-blue-500" />
          <div>
            <h2 className="text-xl font-semibold">Website Settings</h2>
            <p className="text-slate-400 text-sm">Configure global website preferences.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm text-slate-400">Currency</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}
              className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3">
              <option>₹ INR</option><option>$ USD</option><option>€ EUR</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-400">Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}
              className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3">
              <option>English</option><option>தமிழ்</option><option>Hindi</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-400">Time Zone</label>
            <select value={timeZone} onChange={(e) => setTimeZone(e.target.value)}
              className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3">
              <option>Asia/Kolkata</option><option>UTC</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-400">Tax Percentage</label>
            <input type="number" value={taxPercentage} onChange={(e) => setTaxPercentage(Number(e.target.value))}
              className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="text-blue-500" />
          <div>
            <h2 className="text-xl font-semibold">Appearance</h2>
            <p className="text-slate-400 text-sm">Customize the admin dashboard appearance.</p>
          </div>
        </div>
        {[
          { label: "Dark Mode", state: darkMode, setter: setDarkMode },
          { label: "Compact Sidebar", state: compactSidebar, setter: setCompactSidebar },
          { label: "Enable Animations", state: enableAnimations, setter: setEnableAnimations },
        ].map(({ label, state, setter }) => (
          <div key={label} className="flex justify-between items-center bg-slate-800 rounded-lg px-5 py-4 mb-4">
            <span>{label}</span>
            <button onClick={() => setter(!state)}
              className={`relative w-14 h-7 rounded-full transition duration-300 ${state ? "bg-blue-500" : "bg-slate-600"}`}>
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all duration-300 ${state ? "left-8" : "left-1"}`} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="text-blue-500" />
          <div>
            <h2 className="text-xl font-semibold">Content Management</h2>
            <p className="text-slate-400 text-sm">Edit the website pages and policies.</p>
          </div>
        </div>
        {Object.keys(PAGE_MAP).map((title) => (
          <div key={title} className="flex justify-between items-center bg-slate-800 border border-slate-700 rounded-lg px-5 py-4 mb-4">
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-slate-400">Manage {title.toLowerCase()} page.</p>
            </div>
            <button onClick={() => openEditor(title)} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg">
              <Edit3 size={18} /> Edit
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-3xl p-6 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={22} /></button>
            <h2 className="text-2xl font-bold mb-6">Edit {selectedPage}</h2>
            <textarea rows="15" value={content} onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-4 outline-none resize-none focus:border-blue-500" />
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="bg-slate-700 hover:bg-slate-600 px-5 py-2 rounded-lg">Cancel</button>
              <button onClick={saveContent} disabled={contentSaving}
                className={`bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg ${contentSaving ? "opacity-50 cursor-not-allowed" : ""}`}>
                {contentSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Database className="text-blue-500" />
          <div>
            <h2 className="text-xl font-semibold">System</h2>
            <p className="text-slate-400 text-sm">Backup and maintenance tools.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <button onClick={downloadBackup} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-5 py-3 rounded-lg transition">
            <Download size={18} /> Download Backup
          </button>
          <label className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-black px-5 py-3 rounded-lg transition cursor-pointer">
            <Upload size={18} />
            {restoring ? "Restoring..." : "Restore Backup"}
            <input type="file" ref={restoreRef} accept=".json" onChange={restoreBackup} className="hidden" />
          </label>
          <button onClick={clearCache} className="bg-slate-500 hover:bg-slate-600 px-5 py-3 rounded-lg transition">Clear Cache</button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <History className="text-blue-500" />
          <div>
            <h2 className="text-xl font-semibold">Activity Log</h2>
            <p className="text-slate-400 text-sm">Recent administrator activities.</p>
          </div>
        </div>
        <div className="space-y-4">
          {activityLogs.length === 0 && (
            <p className="text-slate-500 text-center py-4">No activity yet.</p>
          )}
          {activityLogs.map((log) => (
            <div key={log._id} className={`border-l-4 ${logColor(log.action)} pl-4`}>
              <p className="font-medium">{log.action}</p>
              {log.details && <p className="text-sm text-slate-400">{log.details}</p>}
              <p className="text-xs text-slate-500 mt-1">
                {formatDate(log.createdAt)}{log.performedBy?.username ? ` by ${log.performedBy.username}` : ""}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end mb-10">
        <button onClick={saveSettings} disabled={saving}
          className={`flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-medium transition ${saving ? "opacity-50 cursor-not-allowed" : ""}`}>
          <Save size={18} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
