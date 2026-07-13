import { useState, useEffect } from "react";
import { IndianRupee, ShoppingCart, TrendingUp, Wallet, Download } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, Legend,
} from "recharts";

import API from "../../config";

const VendorSales = () => {
  const { token } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/stores/sales`, { headers })
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    { title: "Total Revenue", value: `₹${(data?.totalRevenue || 0).toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-green-500" },
    { title: "Total Orders", value: (data?.totalOrders || 0).toLocaleString("en-IN"), icon: ShoppingCart, color: "text-blue-500" },
    { title: "Monthly Sales", value: `₹${(data?.monthlySales || 0).toLocaleString("en-IN")}`, icon: TrendingUp, color: "text-purple-500" },
    { title: "Available Balance", value: `₹${(data?.availableBalance || 0).toLocaleString("en-IN")}`, icon: Wallet, color: "text-yellow-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Sales & Earnings</h1>
        <p className="text-slate-400 mt-2">Monitor your revenue, sales performance and earnings.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500 transition">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-slate-400 text-sm">{item.title}</p>
                  <h2 className="text-3xl font-bold mt-3">{item.value}</h2>
                </div>
                <div className="bg-slate-800 p-4 rounded-full">
                  <Icon className={item.color} size={30} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold">Revenue Trend</h2>
            <p className="text-slate-400 text-sm">Monthly revenue performance</p>
          </div>
          <div className="flex gap-3">
            <select className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2">
              <option>2026</option>
            </select>
            <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2">
              <Download size={18} /> Export
            </button>
          </div>
        </div>
        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer>
            <LineChart data={data?.revenueByMonth || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" width={80} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]} />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Monthly Sales</h2>
          <p className="text-slate-400 text-sm">Number of orders sold every month</p>
        </div>
        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer>
            <BarChart data={data?.monthlySalesData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" width={80} />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Top Selling Products</h2>
            <p className="text-slate-400 text-sm">Best performing products</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left py-4">Product</th>
                <th className="text-center py-4">Units Sold</th>
                <th className="text-center py-4">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {(data?.topProducts || []).map((product) => (
                <tr key={product.id} className="border-b border-slate-800 hover:bg-slate-800 transition">
                  <td className="py-4 font-medium">{product.name}</td>
                  <td className="text-center py-4">{product.sold}</td>
                  <td className="text-center py-4 text-green-400 font-semibold">{product.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left py-4">Transaction</th>
                <th className="text-left py-4">Customer</th>
                <th className="text-left py-4">Amount</th>
                <th className="text-left py-4">Payment</th>
                <th className="text-left py-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {(data?.recentTransactions || []).map((item) => (
                <tr key={item.id} className="border-b border-slate-800 hover:bg-slate-800 transition">
                  <td className="py-4 font-mono text-sm">TXN{item.id}</td>
                  <td className="py-4">{item.customer}</td>
                  <td className="py-4 text-green-400 font-semibold">₹{item.amount.toLocaleString("en-IN")}</td>
                  <td className="py-4">{item.payment}</td>
                  <td className="py-4">{new Date(item.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-slate-400">Today's Earnings</p>
          <h2 className="text-3xl font-bold mt-3 text-green-400">₹{(data?.todayEarnings || 0).toLocaleString("en-IN")}</h2>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-slate-400">This Week</p>
          <h2 className="text-3xl font-bold mt-3 text-green-400">₹{(data?.weekEarnings || 0).toLocaleString("en-IN")}</h2>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-slate-400">This Month</p>
          <h2 className="text-3xl font-bold mt-3 text-green-400">₹{(data?.monthEarnings || 0).toLocaleString("en-IN")}</h2>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-slate-400">This Year</p>
          <h2 className="text-3xl font-bold mt-3 text-green-400">₹{(data?.yearEarnings || 0).toLocaleString("en-IN")}</h2>
        </div>
      </div>
    </div>
  );
};

export default VendorSales;
