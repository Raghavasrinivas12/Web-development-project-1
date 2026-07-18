import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Settings, Menu, X, ShoppingCart, ChartColumn, User,
  MessageSquare, Package, House, LogOut, Gift, UserCircle, Bell,
} from "lucide-react";

const VendorLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const expanded = sidebarExpanded || sidebarOpen;

  const menuItems = [
    { name: "Home",         path: "/",                       icon: <House size={20} /> },
    { name: "Profile",      path: "/vendor/dashboard/profile",  icon: <User size={20} /> },
    { name: "Overview",     path: "/vendor/dashboard",          icon: <LayoutDashboard size={20} /> },
    { name: "Products",     path: "/vendor/dashboard/products", icon: <Gift size={20} /> },
    { name: "Settings",     path: "/vendor/dashboard/settings", icon: <Settings size={20} /> },
    { name: "Orders",       path: "/vendor/dashboard/orders",   icon: <ShoppingCart size={20} /> },
    { name: "Sales",        path: "/vendor/dashboard/sales",    icon: <ChartColumn size={20} /> },
    { name: "Inventory",    path: "/vendor/dashboard/inventory", icon: <Package size={20} /> },
    { name: "Reviews",      path: "/vendor/dashboard/reviews",  icon: <MessageSquare size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-10 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-30 h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button className="lg:hidden hover:text-blue-400" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <Link to="/vendor/dashboard" className="flex items-center gap-2 hover:text-blue-400 transition">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">SH</div>
            <span className="font-bold text-lg hidden sm:inline">Shop<span className="text-blue-500">Hub</span> <span className="text-slate-400 font-normal text-sm">Vendor</span></span>
          </Link>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
        className={`fixed top-14 left-0 z-20 h-[calc(100vh-3.5rem)] ${expanded ? "w-64" : "w-16"}
          bg-slate-900 border-r border-slate-800 transition-all duration-200 overflow-hidden
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <button className="lg:hidden absolute top-2 right-2 hover:text-blue-500 z-50" onClick={() => setSidebarOpen(false)}>
          <X size={20} />
        </button>

        {/* Profile */}
        <div className="flex items-center h-16 border-b border-slate-800 px-3">
          <button
            onClick={() => navigate("/vendor/dashboard/profile")}
            className={`flex items-center gap-3 hover:text-blue-400 transition truncate ${expanded ? "" : "mx-auto"}`}
          >
            {user?.profilePic ? (
              <img src={user.profilePic} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 shrink-0" />
            ) : (
              <UserCircle size={32} className="text-blue-500 shrink-0" />
            )}
            {expanded && (
              <div className="text-left truncate min-w-0">
                <p className="text-base font-medium leading-tight truncate">{user?.username || "Vendor"}</p>
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
            onClick={() => { logout(); navigate("/login"); }}
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

      {/* Main Content */}
      <div className={`pt-14 transition-all duration-200 min-h-screen ${sidebarExpanded ? "lg:ml-64" : "lg:ml-16"} ml-0`}>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default VendorLayout;
