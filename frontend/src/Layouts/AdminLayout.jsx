import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  LayoutDashboard, Users, Store, Package, ShoppingCart,
  FolderTree, BarChart3, Settings, LogOut, Menu, X, Bell, UserCircle, House,
} from "lucide-react";
import API_URL from "../config";

const AdminLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const expanded = sidebarExpanded || sidebarOpen;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios.get(`${API_URL}/api/admin/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setUnreadNotifs(res.data.unreadCount)).catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    { name: "Home",       path: "/",                icon: <House size={20} /> },
    { name: "Dashboard",  path: "/admindashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Users",      path: "/adminusers",      icon: <Users size={20} /> },
    { name: "Vendors",    path: "/adminvendors",    icon: <Store size={20} /> },
    { name: "Products",   path: "/admin/products",  icon: <Package size={20} /> },
    { name: "Orders",     path: "/admin/orders",    icon: <ShoppingCart size={20} /> },
    { name: "Categories", path: "/admin/categories", icon: <FolderTree size={20} /> },
    { name: "Reports",    path: "/admin/reports",   icon: <BarChart3 size={20} /> },
    { name: "Notifications", path: "/admin/notifications", icon: <Bell size={20} /> },
    { name: "Settings",   path: "/admin/settings",  icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-10 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Top Bar — fixed at top, always visible */}
      <header className="fixed top-0 left-0 right-0 z-30 h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button className="lg:hidden hover:text-blue-400" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <Link to="/admindashboard" className="flex items-center gap-2 hover:text-blue-400 transition">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">SH</div>
            <span className="font-bold text-lg hidden sm:inline">Shop<span className="text-blue-500">Hub</span> <span className="text-slate-400 font-normal text-sm">Admin</span></span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/admin/notifications")} className="relative">
            <Bell size={20} />
            {unreadNotifs > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-[10px] rounded-full px-1">{unreadNotifs}</span>
            )}
          </button>
        </div>
      </header>

      {/* Sidebar — below top bar */}
      <aside
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
        className={`fixed top-14 left-0 z-20 h-[calc(100vh-3.5rem)] ${expanded ? "w-64" : "w-16"}
          bg-slate-900 border-r border-slate-800 transition-all duration-200 overflow-hidden
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Close button */}
        <button className="lg:hidden absolute top-2 right-2 hover:text-blue-500 z-50" onClick={() => setSidebarOpen(false)}>
          <X size={20} />
        </button>

        {/* Profile */}
        <div className="flex items-center h-16 border-b border-slate-800 px-3">
          <button
            onClick={() => navigate("/admin/profile")}
            className={`flex items-center gap-3 hover:text-blue-400 transition truncate ${expanded ? "" : "mx-auto"}`}
          >
            {user?.profilePic ? (
              <img src={user.profilePic} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 shrink-0" />
            ) : (
              <UserCircle size={32} className="text-blue-500 shrink-0" />
            )}
            {expanded && (
              <div className="text-left truncate min-w-0">
                <p className="text-base font-medium leading-tight truncate">{user?.username || "Admin"}</p>
                <p className="text-xs text-slate-400 leading-tight truncate">{user?.email || ""}</p>
              </div>
            )}
          </button>
        </div>

        {/* Menu */}
        <nav className="p-2 space-y-0.5 mt-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition whitespace-nowrap
                ${location.pathname === item.path
                  ? "bg-blue-500 text-white"
                  : "hover:bg-slate-800 text-slate-300"
                }`}
              title={!expanded ? item.name : undefined}
            >
              <span className="shrink-0 flex items-center justify-center w-5">{item.icon}</span>
              <span className={`text-sm transition-opacity duration-200 ${expanded ? "opacity-100" : "opacity-0"}`}>
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-0 w-full px-2">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center bg-slate-700 hover:bg-slate-600 py-2.5 rounded-lg transition ${expanded ? "gap-2" : "gap-0"}`}
            title={!expanded ? "Logout" : undefined}
          >
            <LogOut size={18} className="shrink-0" />
            {expanded && (
              <span className="text-sm">Logout</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content — offset for top bar + sidebar */}
      <div className={`pt-14 transition-all duration-200 min-h-screen ${sidebarExpanded ? "lg:ml-64" : "lg:ml-16"} ml-0`}>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
