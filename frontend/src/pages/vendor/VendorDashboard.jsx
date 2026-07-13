import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { IndianRupee, Package, Clock, AlertTriangle } from "lucide-react";

import API from "../../config";

const VendorDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API}/api/stores/stats`, { headers })
      .then((res) => setStats(res.data))
      .catch(() => toast.error("Failed to load dashboard data"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: stats ? `₹${stats.revenue.toLocaleString("en-IN")}` : "₹0",
      subtitle: stats ? `${stats.orderCount} order(s) placed` : "No data yet",
      color: "text-emerald-400",
      icon: IndianRupee,
    },
    {
      title: "Active Listings",
      value: stats ? `${stats.activeListings} Items` : "0 Items",
      subtitle: stats?.activeListings ? "In stock and live" : "No products listed",
      color: "text-blue-500",
      icon: Package,
    },
    {
      title: "Pending Orders",
      value: stats ? `${stats.pendingOrderCount} Orders` : "0 Orders",
      subtitle: stats?.pendingOrderCount ? "Requires dispatch action" : "All clear",
      color: "text-amber-400",
      icon: Clock,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Overview Console</h1>
        <p className="text-slate-400 mt-1">Track your marketplace analytics and operational health data metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-2xl hover:border-slate-700 transition-all duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.title}</h3>
              <stat.icon size={18} className={stat.color} />
            </div>
            <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
            <span className="text-xs text-slate-400 mt-1 block">{stat.subtitle}</span>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Immediate Actions Required</h2>
        <div className="divide-y divide-slate-800">
          {(!stats || (stats.pendingOrders.length === 0 && stats.lowStockProducts.length === 0)) && (
            <p className="py-4 text-slate-500 text-sm">No pending actions. Everything looks good!</p>
          )}
          {stats?.pendingOrders.map((order) => (
            <div key={order._id} className="py-4 flex justify-between items-center hover:bg-slate-800/10 transition-colors">
              <div>
                <p className="text-sm font-semibold text-slate-200">
                  Order #{order.orderId} requires confirmation
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {order.items.map((i) => `${i.name} × ${i.quantity}${i.size ? ` (${i.size})` : ""}`).join(", ")}
                </p>
              </div>
              <Link
                to={`/vendor/dashboard/orders`}
                className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
              >
                Pending
              </Link>
            </div>
          ))}
          {stats?.lowStockProducts.map((product) => (
            <div key={product._id} className="py-4 flex justify-between items-center hover:bg-slate-800/10 transition-colors">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-rose-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-200">Low Inventory Alert</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {product.name} (Stock remaining: {product.stock})
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Low Stock
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
