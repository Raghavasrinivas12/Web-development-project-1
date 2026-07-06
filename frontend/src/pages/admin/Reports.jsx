import { useState, useEffect } from "react";
import { Calendar, Download, TrendingUp } from "lucide-react";
import axios from "axios";
import {
  ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("/api/admin/reports", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center text-slate-400 py-20 text-base">Loading...</div>;
  if (!data) return <div className="text-center text-slate-400 py-20 text-base">Failed to load reports</div>;

  const monthlySales = data.monthlySales?.map((m) => ({ month: m._id, sales: m.sales })) || [];
  const categorySales = data.categorySales?.map((c) => ({ name: c._id || "Uncategorized", value: c.value })) || [];
  const orderStatus = data.orderStatus?.map((o) => ({ status: o._id, orders: o.orders })) || [];

  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return "₹" + Number(amount).toLocaleString("en-IN");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <TrendingUp className="text-blue-500" size={30} />
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          </div>
          <p className="text-slate-400 mt-2">Business insights and performance analytics</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowDateModal(true)} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg flex items-center gap-2">
            <Calendar size={18} /> Date Filter
          </button>
          <button onClick={() => setShowExportModal(true)} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2">
            <Download size={18} /> Export Report
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-xl font-semibold mb-5">Monthly Sales</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlySales} margin={{ top: 10, right: 20, left: 35, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-xl font-semibold mb-5">Category-wise Sales</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categorySales} dataKey="value" nameKey="name" outerRadius={100} label>
                  {categorySales.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mt-6">
        <h2 className="text-xl font-semibold mb-5">Order Status</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={orderStatus}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="status" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-xl font-semibold mb-5">Top Selling Products</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left pb-3">Product</th>
                <th className="text-center pb-3">Sold</th>
                <th className="text-right pb-3">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {(data.topProducts?.length ? data.topProducts : []).map((item, i) => (
                <tr key={i} className="border-b border-slate-800">
                  <td className="py-4">{item.product}</td>
                  <td className="text-center">{item.sold}</td>
                  <td className="text-right text-green-400 font-semibold">{formatCurrency(item.revenue)}</td>
                </tr>
              ))}
              {!data.topProducts?.length && (
                <tr><td colSpan={3} className="py-8 text-center text-slate-500">No data yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-xl font-semibold mb-5">Top Vendors</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left pb-3">Vendor</th>
                <th className="text-right pb-3">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {(data.topVendors?.length ? data.topVendors : []).map((v, i) => (
                <tr key={i} className="border-b border-slate-800">
                  <td className="py-4">{v.storeName}</td>
                  <td className="text-right text-green-400 font-semibold">{formatCurrency(v.revenue)}</td>
                </tr>
              ))}
              {!data.topVendors?.length && (
                <tr><td colSpan={2} className="py-8 text-center text-slate-500">No data yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mt-6">
        <h2 className="text-xl font-semibold mb-5">Recent Transactions</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left pb-3">Customer</th>
              <th className="text-center pb-3">Amount</th>
              <th className="text-right pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {(data.recentTransactions?.length ? data.recentTransactions : []).map((t, i) => (
              <tr key={i} className="border-b border-slate-800">
                <td className="py-4">{t.userId?.username || "Unknown"}</td>
                <td className="text-center font-semibold">{formatCurrency(t.totalAmount)}</td>
                <td className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    t.orderStatus === "Delivered" || t.orderStatus === "Paid"
                      ? "bg-green-500/20 text-green-400"
                      : t.orderStatus === "Pending"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                  }`}>{t.orderStatus}</span>
                </td>
              </tr>
            ))}
            {!data.recentTransactions?.length && (
              <tr><td colSpan={3} className="py-8 text-center text-slate-500">No transactions yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showDateModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-5">Filter Reports</h2>
            <div className="space-y-4">
              <div><label className="block text-sm mb-2">From Date</label><input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3" /></div>
              <div><label className="block text-sm mb-2">To Date</label><input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3" /></div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowDateModal(false)} className="bg-slate-700 hover:bg-slate-600 px-5 py-2 rounded-lg">Cancel</button>
              <button onClick={() => setShowDateModal(false)} className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg">Apply</button>
            </div>
          </div>
        </div>
      )}

      {showExportModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-5">Export Report</h2>
            <div className="space-y-3">
              <button className="w-full bg-slate-800 hover:bg-slate-700 py-3 rounded-lg">Export as PDF</button>
              <button className="w-full bg-slate-800 hover:bg-slate-700 py-3 rounded-lg">Export as Excel</button>
              <button className="w-full bg-slate-800 hover:bg-slate-700 py-3 rounded-lg">Export as CSV</button>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => setShowExportModal(false)} className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
