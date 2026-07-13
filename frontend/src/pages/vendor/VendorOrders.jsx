import { useState, useEffect } from "react";
import { ShoppingBag, Clock3, Truck, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

import API from "../../config";

const statusColors = {
  Pending: "bg-yellow-500/20 text-yellow-400",
  Paid: "bg-blue-500/20 text-blue-400",
  Shipped: "bg-purple-500/20 text-purple-400",
  Delivered: "bg-green-500/20 text-green-400",
  Cancelled: "bg-red-500/20 text-red-400",
};

const VendorOrders = () => {
  const { token } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    axios.get(`${API}/api/orders/vendor-dashboard`, { headers })
      .then((res) => setOrders(res.data.orders))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async () => {
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      const res = await axios.put(
        `${API}/api/orders/${selectedOrder._id}/status`,
        { status: newStatus },
        { headers }
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === selectedOrder._id ? { ...o, orderStatus: newStatus } : o))
      );
      toast.success(res.data.msg);
      setShowModal(false);
      setSelectedOrder(null);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const orderId = order.orderId || order._id.slice(-6);
    const matchesSearch =
      orderId.toLowerCase().includes(search.toLowerCase()) ||
      (order.userId?.username || "").toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || order.orderStatus === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-slate-400 mt-2">Manage and track all customer orders</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Orders", value: orders.length, icon: ShoppingBag, color: "text-blue-500" },
          { label: "Pending", value: orders.filter((o) => o.orderStatus === "Pending").length, icon: Clock3, color: "text-yellow-400" },
          { label: "Shipped", value: orders.filter((o) => o.orderStatus === "Shipped").length, icon: Truck, color: "text-purple-400" },
          { label: "Delivered", value: orders.filter((o) => o.orderStatus === "Delivered").length, icon: CheckCircle2, color: "text-green-500" },
        ].map((item) => (
          <div key={item.label} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-400 text-sm">{item.label}</p>
                <h2 className="text-3xl font-bold mt-2">{item.value}</h2>
              </div>
              <item.icon size={34} className={item.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <input type="text" placeholder="Search Order ID or Customer..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500">
            <option>All</option>
            <option>Pending</option>
            <option>Paid</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto shadow-xl">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-6 py-4 text-left">Order ID</th>
              <th className="px-6 py-4 text-left">Customer</th>
              <th className="px-6 py-4 text-left">Items</th>
              <th className="px-6 py-4 text-left">Amount</th>
              <th className="px-6 py-4 text-left">Payment</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => {
              const displayId = order.orderId || `#${order._id.slice(-6).toUpperCase()}`;
              const vendorItems = order.vendorItems || order.items;
              return (
                <tr key={order._id} className="border-t border-slate-800 hover:bg-slate-800/40">
                  <td className="px-6 py-4 font-mono text-sm">{displayId}</td>
                  <td className="px-6 py-4">{order.userId?.username || "Unknown"}</td>
                  <td className="px-6 py-4">
                    {vendorItems.map((item, i) => (
                      <span key={i} className="block text-sm text-slate-300">
                        {item.title || item.name} × {item.quantity}
                      </span>
                    ))}
                  </td>
                  <td className="px-6 py-4 font-semibold text-green-400">
                    ₹{order.totalAmount?.toLocaleString("en-IN") || 0}
                  </td>
                  <td className="px-6 py-4">{order.stripePaymentIntentId ? "Card" : "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${statusColors[order.orderStatus] || "bg-slate-500/20 text-slate-400"}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => { setSelectedOrder(order); setNewStatus(order.orderStatus); setShowModal(true); }}
                      className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm">View</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-5">
        {filteredOrders.map((order) => {
          const displayId = order.orderId || `#${order._id.slice(-6).toUpperCase()}`;
          const vendorItems = order.vendorItems || order.items;
          return (
            <div key={order._id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex justify-between">
                <div>
                  <h2 className="font-bold text-lg">{displayId}</h2>
                  <p className="text-slate-400">{order.userId?.username || "Unknown"}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${statusColors[order.orderStatus] || ""}`}>
                  {order.orderStatus}
                </span>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                {vendorItems.map((item, i) => (
                  <p key={i}><span className="text-slate-400">Item {i + 1}:</span> {item.title || item.name} × {item.quantity}</p>
                ))}
                <p><span className="text-slate-400">Amount:</span> ₹{order.totalAmount?.toLocaleString("en-IN") || 0}</p>
                <p><span className="text-slate-400">Date:</span> {new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
              </div>
              <button onClick={() => { setSelectedOrder(order); setNewStatus(order.orderStatus); setShowModal(true); }}
                className="mt-5 w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-lg font-semibold transition">View Details</button>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 p-6">
              <h2 className="text-xl md:text-2xl font-bold">Order Details</h2>
              <button onClick={() => { setShowModal(false); setSelectedOrder(null); }}
                className="text-3xl leading-none text-slate-400 hover:text-blue-400">&times;</button>
            </div>
            <div className="p-4 md:p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <p className="text-slate-400 text-sm">Order ID</p>
                  <h3>{selectedOrder.orderId || `#${selectedOrder._id.slice(-6).toUpperCase()}`}</h3>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Customer</p>
                  <h3>{selectedOrder.userId?.username || "Unknown"}</h3>
                </div>
                <div className="md:col-span-2">
                  <p className="text-slate-400 text-sm mb-1">Items</p>
                  {(selectedOrder.vendorItems || selectedOrder.items).map((item, i) => (
                    <div key={i} className="bg-slate-800 rounded-lg p-3 mb-2 flex justify-between">
                      <span>{(item.title || item.name)} × {item.quantity}</span>
                      <span className="text-green-400">₹{(item.priceAtPurchase * item.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Total Amount</p>
                  <h3 className="text-green-400">₹{selectedOrder.totalAmount?.toLocaleString("en-IN") || 0}</h3>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Payment</p>
                  <h3>{selectedOrder.stripePaymentIntentId ? "Card" : "—"}</h3>
                </div>
                <div className="md:col-span-2">
                  <p className="text-slate-400 text-sm mb-2">Update Status</p>
                  <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500">
                    <option>Pending</option>
                    <option>Paid</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>
              {selectedOrder.shippingAddress && (
                <div>
                  <p className="text-slate-400 text-sm mb-2">Shipping Address</p>
                  <div className="bg-slate-800 rounded-lg p-4 break-words text-sm">
                    {selectedOrder.shippingAddress.street}<br />
                    {selectedOrder.shippingAddress.city}<br />
                    {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.zipCode}
                  </div>
                </div>
              )}
            </div>
            <div className="border-t border-slate-800 p-4 md:p-6 flex flex-col sm:flex-row justify-end gap-3">
              <button onClick={() => { setShowModal(false); setSelectedOrder(null); }}
                className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-lg">Close</button>
              <button onClick={updateStatus} disabled={updating}
                className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 disabled:opacity-50 px-6 py-2 rounded-lg">
                {updating ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4 border-t border-slate-800 pt-6">
        <p className="text-slate-400">Showing {filteredOrders.length} of {orders.length} Orders</p>
      </div>
    </div>
  );
};

export default VendorOrders;
