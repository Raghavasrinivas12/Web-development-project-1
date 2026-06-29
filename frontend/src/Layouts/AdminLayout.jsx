import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  ShoppingCart,
  FolderTree,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  UserCircle,
} from "lucide-react";

const AdminLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admindashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Users",
      path: "/adminusers",
      icon: <Users size={20} />,
    },
    {
      name: "Vendors",
      path: "/adminvendors",
      icon: <Store size={20} />,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: <Package size={20} />,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: <ShoppingCart size={20} />,
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: <FolderTree size={20} />,
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: <BarChart3 size={20} />,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50
        h-screen w-64 bg-slate-900 border-r border-slate-800
        transform transition-transform duration-300
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }
        lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">

          <h1 className="text-2xl font-bold">
            Shop<span className="text-blue-500">Hub</span>
            <p className="text-sm text-slate-400 font-normal">
              Admin Panel
            </p>
          </h1>

          <button
            className="lg:hidden hover:text-blue-500"
            onClick={() => setSidebarOpen(false)}
          >
            <X />
          </button>

        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">

          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
                ${
                  location.pathname === item.path
                    ? "bg-blue-500 text-white"
                    : "hover:bg-slate-800 text-slate-300"
                }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}

        </nav>

        {/* Logout */}
        <div className="absolute bottom-5 left-0 w-full px-4">

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-slate-500 hover:bg-slate-600 py-3 rounded-lg"
          >
            <LogOut size={20} />
            Logout
          </button>

        </div>

      </aside>

      {/* Main Section */}
      <div className="flex-1 flex flex-col">

        {/* Top Navbar */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">

          <div className="flex items-center gap-4">

            <button
              className="lg:hidden hover:text-blue-400"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu />
            </button>

            <h2 className="text-xl font-semibold">
              Admin Dashboard
            </h2>

          </div>

          <div className="flex items-center gap-5">

            <button className="relative">

              <Bell size={22} />

              <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full px-1">
                3
              </span>

            </button>

            <div className="flex items-center gap-2">

              {user?.profilePic ? (
                <img src={user.profilePic} alt="" className="w-8 h-8 rounded-full object-cover border border-blue-500" />
              ) : (
                <UserCircle size={30} className="text-blue-500" />
              )}

              <div className="hidden sm:block">

                <p className="font-medium">
                  {user?.username || "Admin"}
                </p>

                <p className="text-xs text-slate-400">
                  {user?.email || "admin@shophub.com"}
                </p>

              </div>

            </div>

          </div>

        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;