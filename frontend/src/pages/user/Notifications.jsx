import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Bell, CheckCheck, ShoppingCart, Store, Package, Settings, ArrowLeft } from "lucide-react";
import API_URL from "../../config";

const TYPE_ICONS = { order: ShoppingCart, vendor: Store, product: Package, system: Settings };
const TYPE_COLORS = { order: "border-blue-500", vendor: "border-green-500", product: "border-yellow-500", system: "border-purple-500" };

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const headers = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

  const fetchNotifications = () => {
    axios.get(`${API_URL}/api/notifications`, headers())
      .then((res) => {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      })
      .catch(() => toast.error("Failed to load notifications"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchNotifications() }, []);

  const markAsRead = (id) => {
    axios.put(`${API_URL}/api/notifications/${id}/read`, {}, headers())
      .then(() => fetchNotifications())
      .catch(() => {});
  };

  const markAllRead = () => {
    axios.put(`${API_URL}/api/notifications/read-all`, {}, headers())
      .then(() => fetchNotifications())
      .catch(() => {});
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-slate-400 text-base">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 rounded-lg hover:bg-slate-800 transition">
              <ArrowLeft size={22} className="text-slate-400" />
            </Link>
            <Bell size={30} className="text-blue-500" />
            <div>
              <h1 className="text-3xl font-bold">Notifications</h1>
              <p className="text-slate-400">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "No unread notifications"}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm transition">
              <CheckCheck size={18} /> Mark All Read
            </button>
          )}
        </div>

        <div className="space-y-3">
          {notifications.length === 0 && (
            <div className="text-center text-slate-500 py-20">No notifications yet.</div>
          )}
          {notifications.map((notif) => {
            const Icon = TYPE_ICONS[notif.type] || Bell;
            return (
              <Link key={notif._id}
                to={notif.link || "#"}
                onClick={() => { if (!notif.isRead) markAsRead(notif._id); }}
                className={`block bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-blue-500 transition flex items-start gap-4 ${!notif.isRead ? "ring-1 ring-blue-500/30" : "opacity-70"}`}>
                <div className={`p-2 rounded-full bg-slate-800 shrink-0 ${notif.isRead ? "" : "text-blue-400"}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-semibold truncate ${!notif.isRead ? "text-white" : "text-slate-300"}`}>{notif.title}</h3>
                    {!notif.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                  </div>
                  {notif.message && <p className="text-sm text-slate-400 mt-1">{notif.message}</p>}
                  <p className="text-xs text-slate-500 mt-2">{new Date(notif.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                {!notif.isRead && (
                  <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); markAsRead(notif._id); }}
                    className="text-xs text-blue-400 hover:text-blue-300 shrink-0">Mark read</button>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
