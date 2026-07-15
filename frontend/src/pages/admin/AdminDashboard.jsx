import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Users, Store, Package, ShoppingCart, IndianRupee, TrendingUp,
  ClipboardList, PlusCircle, ShieldCheck, Activity,
} from "lucide-react";
import API_URL from "../../config";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (amount) =>
    "₹" + Number(amount).toLocaleString("en-IN");

  if (loading)
    return (
      <div className="text-center text-slate-400 py-20 text-base">Loading dashboard...</div>
    );

  const statsCards = [
    { title: "Total Users", value: data?.stats?.totalUsers ?? 0, icon: <Users size={28} />, color: "text-blue-500" },
    { title: "Total Vendors", value: data?.stats?.totalVendors ?? 0, icon: <Store size={28} />, color: "text-green-500" },
    { title: "Total Products", value: data?.stats?.totalProducts ?? 0, icon: <Package size={28} />, color: "text-yellow-500" },
    { title: "Total Orders", value: data?.stats?.totalOrders ?? 0, icon: <ShoppingCart size={28} />, color: "text-pink-500" },
    { title: "Revenue", value: formatCurrency(data?.stats?.totalRevenue ?? 0), icon: <IndianRupee size={28} />, color: "text-emerald-500" },
    { title: "Monthly Growth", value: "+18%", icon: <TrendingUp size={28} />, color: "text-cyan-500" },
  ];

  const quickActions = [
    { title: "Add Category", icon: <PlusCircle size={22} />, to: "/admin/categories" },
    { title: "Manage Users", icon: <Users size={22} />, to: "/adminusers" },
    { title: "Approve Vendors", icon: <ShieldCheck size={22} />, to: "/adminvendors" },
    { title: "View Orders", icon: <ClipboardList size={22} />, to: "/admin/orders" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome back, Admin</p>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 px-5 py-2.5 rounded-lg text-sm font-medium">
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {statsCards.map((item, index) => (
          <div key={index} className="bg-slate-900 rounded-xl p-6 border border-slate-800 hover:border-blue-500 transition">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-400 text-sm">{item.title}</p>
                <h2 className="text-3xl font-bold mt-1 text-white">{item.value}</h2>
              </div>
              <div className={item.color}>{item.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {quickActions.map((action, index) => (
            <button key={index} onClick={() => navigate(action.to)}
              className="bg-slate-800 hover:bg-blue-500 transition rounded-xl py-5 flex flex-col items-center gap-3">
              {action.icon}
              <span className="text-sm">{action.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <div className="flex items-center gap-3 mb-5">
          <Activity className="text-blue-500" size={22} />
          <h2 className="text-2xl font-semibold">Recent Activities</h2>
        </div>
        <div className="space-y-4">
          {[
            "New vendor 'Tech World' registered.",
            "25 new orders received today.",
            "Admin approved 3 vendors.",
            "10 products added today.",
            "Revenue increased by 18% this month.",
          ].map((activity, index) => (
            <div key={index} className="bg-slate-800 rounded-lg p-4 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
              <p className="text-slate-200 text-sm">{activity}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-slate-500 pt-8 border-t border-slate-800 text-sm">
        &copy; 2026 ShopHub Admin Dashboard. All Rights Reserved.
      </div>
    </div>
  );
};

export default AdminDashboard;
