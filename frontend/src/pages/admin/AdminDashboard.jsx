import { useState, useEffect } from "react";
import axios from "axios";
import {
  Users, Store, Package, ShoppingCart, IndianRupee, TrendingUp,
  ClipboardList, PlusCircle, ShieldCheck, Activity,
} from "lucide-react";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/admin/stats", {
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
      <div className="text-center text-slate-400 py-20">Loading dashboard...</div>
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
    { title: "Add Category", icon: <PlusCircle size={22} /> },
    { title: "Manage Users", icon: <Users size={22} /> },
    { title: "Approve Vendors", icon: <ShieldCheck size={22} /> },
    { title: "View Orders", icon: <ClipboardList size={22} /> },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome back, Admin</p>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 px-5 py-3 rounded-lg font-medium">
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {statsCards.map((item, index) => (
          <div key={index} className="bg-slate-900 rounded-xl p-6 border border-slate-800 hover:border-blue-500 transition">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-400">{item.title}</p>
                <h2 className="text-3xl font-bold mt-2 text-white">{item.value}</h2>
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
            <button key={index} className="bg-slate-800 hover:bg-blue-500 transition rounded-xl p-5 flex flex-col items-center gap-3">
              {action.icon}
              <span className="text-sm">{action.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="text-blue-500" />
          <h2 className="text-2xl font-semibold">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 text-left">
                <th className="py-3">Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentOrders?.map((order) => (
                <tr key={order._id} className="border-b border-slate-800 hover:bg-slate-800">
                  <td className="py-4 font-mono text-sm">{order._id.slice(-8)}</td>
                  <td>{order.userId?.username || "N/A"}</td>
                  <td>{formatCurrency(order.totalAmount)}</td>
                  <td>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      order.orderStatus === "Delivered" ? "bg-green-500/20 text-green-400" :
                      order.orderStatus === "Shipped" ? "bg-blue-500/20 text-blue-400" :
                      order.orderStatus === "Paid" ? "bg-cyan-500/20 text-cyan-400" :
                      order.orderStatus === "Pending" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>
                      {order.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {(!data?.recentOrders || data.recentOrders.length === 0) && (
                <tr><td colSpan={4} className="py-8 text-center text-slate-500">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
          <h2 className="text-2xl font-semibold mb-5">Recent Vendors</h2>
          <div className="space-y-4">
            {data?.vendorStats?.map((store) => (
              <div key={store._id} className="bg-slate-800 rounded-lg p-4 flex justify-between">
                <div>
                  <h3 className="font-semibold">{store.storeName}</h3>
                  <p className="text-slate-400 text-sm">{store.ownerId?.username || "N/A"}</p>
                </div>
                <span className={`text-sm font-semibold ${
                  store.isApproved === "Approved" ? "text-green-400" :
                  store.isApproved === "Rejected" ? "text-red-400" :
                  "text-yellow-400"
                }`}>{store.isApproved || "Pending"}</span>
              </div>
            ))}
            {(!data?.vendorStats || data.vendorStats.length === 0) && (
              <p className="text-center text-slate-500 py-8">No vendors yet</p>
            )}
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
          <h2 className="text-2xl font-semibold mb-5">Sales Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800 rounded-lg p-5">
              <p className="text-slate-400">Today</p>
              <h3 className="text-2xl font-bold text-green-400 mt-2">{formatCurrency(0)}</h3>
            </div>
            <div className="bg-slate-800 rounded-lg p-5">
              <p className="text-slate-400">This Week</p>
              <h3 className="text-2xl font-bold text-blue-400 mt-2">{formatCurrency(0)}</h3>
            </div>
            <div className="bg-slate-800 rounded-lg p-5">
              <p className="text-slate-400">Total Revenue</p>
              <h3 className="text-2xl font-bold text-yellow-400 mt-2">{formatCurrency(data?.stats?.totalRevenue ?? 0)}</h3>
            </div>
            <div className="bg-slate-800 rounded-lg p-5">
              <p className="text-slate-400">Orders</p>
              <h3 className="text-2xl font-bold text-cyan-400 mt-2">{data?.stats?.totalOrders ?? 0}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-slate-500 pt-8 border-t border-slate-800">
        &copy; 2026 ShopHub Admin Dashboard. All Rights Reserved.
      </div>
    </div>
  );
};

export default AdminDashboard;
