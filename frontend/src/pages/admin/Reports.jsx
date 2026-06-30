import { useState } from "react";
import {
  Calendar,
  Download,
  TrendingUp,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const Reports = () => {

  const [showDateModal, setShowDateModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const monthlySales = [
    { month: "Jan", sales: 180000 },
    { month: "Feb", sales: 210000 },
    { month: "Mar", sales: 260000 },
    { month: "Apr", sales: 240000 },
    { month: "May", sales: 310000 },
    { month: "Jun", sales: 375000 },
    { month: "Jul", sales: 420000 },
  ];

  const categorySales = [
    { name: "Electronics", value: 45 },
    { name: "Fashion", value: 25 },
    { name: "Books", value: 15 },
    { name: "Furniture", value: 15 },
  ];

  const orderStatus = [
    { status: "Delivered", orders: 820 },
    { status: "Pending", orders: 120 },
    { status: "Cancelled", orders: 45 },
  ];

  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
  ];

  const topProducts = [
    {
      id: 1,
      product: "iPhone 15",
      sold: 320,
      revenue: "₹3,20,000",
    },
    {
      id: 2,
      product: "Nike Shoes",
      sold: 285,
      revenue: "₹2,85,000",
    },
    {
      id: 3,
      product: "Boat Headphones",
      sold: 240,
      revenue: "₹1,92,000",
    },
  ];

  const topVendors = [
    {
      id: 1,
      vendor: "Tech World",
      revenue: "₹4,20,000",
    },
    {
      id: 2,
      vendor: "Fashion Hub",
      revenue: "₹3,60,000",
    },
    {
      id: 3,
      vendor: "Mobile Mart",
      revenue: "₹2,75,000",
    },
  ];

  const recentTransactions = [
    {
      id: 1,
      customer: "Rahul Sharma",
      amount: "₹2,500",
      status: "Paid",
    },
    {
      id: 2,
      customer: "Priya Reddy",
      amount: "₹1,800",
      status: "Pending",
    },
    {
      id: 3,
      customer: "Arjun Kumar",
      amount: "₹4,200",
      status: "Paid",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      {/* Header */}

      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">

        <div>

          <div className="flex items-center gap-3">

            <TrendingUp
              className="text-blue-500"
              size={30}
            />

            <h1 className="text-3xl font-bold">
              Reports & Analytics
            </h1>

          </div>

          <p className="text-slate-400 mt-2">
            Business insights and performance analytics
          </p>

        </div>

        <div className="flex gap-3">

          <button
            onClick={() => setShowDateModal(true)}
            className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Calendar size={18} />
            Date Filter
          </button>

          <button
            onClick={() => setShowExportModal(true)}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Download size={18} />
            Export Report
          </button>

        </div>

      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Monthly Sales */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <h2 className="text-xl font-semibold mb-5">
            Monthly Sales
          </h2>

          <div className="h-80">

            <ResponsiveContainer width="100%" height="100%">

              <LineChart data={monthlySales}
              margin={{
                top:10,
                right:20,
                left:35,
                bottom:10,
              }}
              >

                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

                <XAxis dataKey="month" stroke="#94A3B8" />

                <YAxis stroke="#94A3B8" />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#3B82F6"
                  strokeWidth={3}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* Category-wise Sales */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <h2 className="text-xl font-semibold mb-5">
            Category-wise Sales
          </h2>

          <div className="h-80">

            <ResponsiveContainer width="100%" height="100%">

              <PieChart>

                <Pie
                  data={categorySales}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >

                  {categorySales.map((entry, index) => (

                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />

                  ))}

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* Order Status */}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mt-6">

        <h2 className="text-xl font-semibold mb-5">
          Order Status
        </h2>

        <div className="h-80">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart data={orderStatus}>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
              />

              <XAxis
                dataKey="status"
                stroke="#94A3B8"
              />

              <YAxis stroke="#94A3B8" />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="orders"
                fill="#3B82F6"
                radius={[8, 8, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">

        {/* Top Selling Products */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <h2 className="text-xl font-semibold mb-5">
            Top Selling Products
          </h2>

          <table className="w-full text-sm">

            <thead>

              <tr className="border-b border-slate-700">

                <th className="text-left pb-3">Product</th>
                <th className="text-center pb-3">Sold</th>
                <th className="text-right pb-3">Revenue</th>

              </tr>

            </thead>

            <tbody>

              {topProducts.map((item) => (

                <tr
                  key={item.id}
                  className="border-b border-slate-800"
                >

                  <td className="py-4">
                    {item.product}
                  </td>

                  <td className="text-center">
                    {item.sold}
                  </td>

                  <td className="text-right text-green-400 font-semibold">
                    {item.revenue}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* Top Vendors */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

          <h2 className="text-xl font-semibold mb-5">
            Top Vendors
          </h2>

          <table className="w-full text-sm">

            <thead>

              <tr className="border-b border-slate-700">

                <th className="text-left pb-3">
                  Vendor
                </th>

                <th className="text-right pb-3">
                  Revenue
                </th>

              </tr>

            </thead>

            <tbody>

              {topVendors.map((vendor) => (

                <tr
                  key={vendor.id}
                  className="border-b border-slate-800"
                >

                  <td className="py-4">
                    {vendor.vendor}
                  </td>

                  <td className="text-right text-green-400 font-semibold">
                    {vendor.revenue}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* Recent Transactions */}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mt-6">

        <h2 className="text-xl font-semibold mb-5">
          Recent Transactions
        </h2>

        <table className="w-full text-sm">

          <thead>

            <tr className="border-b border-slate-700">

              <th className="text-left pb-3">
                Customer
              </th>

              <th className="text-center pb-3">
                Amount
              </th>

              <th className="text-right pb-3">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {recentTransactions.map((item) => (

              <tr
                key={item.id}
                className="border-b border-slate-800"
              >

                <td className="py-4">
                  {item.customer}
                </td>

                <td className="text-center font-semibold">
                  {item.amount}
                </td>

                <td className="text-right">

                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      item.status === "Paid"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {item.status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {showDateModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-6">

            <h2 className="text-xl font-semibold mb-5">
              Filter Reports
            </h2>

            <div className="space-y-4">

              <div>
                <label className="block text-sm mb-2">
                  From Date
                </label>

                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">
                  To Date
                </label>

                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
                />
              </div>

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setShowDateModal(false)}
                className="bg-slate-700 hover:bg-slate-600 px-5 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={() => setShowDateModal(false)}
                className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg"
              >
                Apply
              </button>

            </div>

          </div>
        </div>
      )}

      {/* Export Modal */}

      {showExportModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">

          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-6">

            <h2 className="text-xl font-semibold mb-5">
              Export Report
            </h2>

            <div className="space-y-3">

              <button className="w-full bg-slate-800 hover:bg-slate-700 py-3 rounded-lg">
                Export as PDF
              </button>

              <button className="w-full bg-slate-800 hover:bg-slate-700 py-3 rounded-lg">
                Export as Excel
              </button>

              <button className="w-full bg-slate-800 hover:bg-slate-700 py-3 rounded-lg">
                Export as CSV
              </button>

            </div>

            <div className="flex justify-end mt-6">

              <button
                onClick={() => setShowExportModal(false)}
                className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Reports;
