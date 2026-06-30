import { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingCart, Search, Eye } from "lucide-react";

const statusColors = {
  Pending: "bg-yellow-500/20 text-yellow-400",
  Paid: "bg-blue-500/20 text-blue-400",
  Shipped: "bg-purple-500/20 text-purple-400",
  Delivered: "bg-green-500/20 text-green-400",
  Cancelled: "bg-red-500/20 text-red-400",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders() }, []);

  const updateStatus = (id, status) => {
    const token = localStorage.getItem("token");
    axios
      .put(`http://localhost:5000/api/admin/orders/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => fetchOrders())
      .catch(console.error);
  };

  const filtered = orders.filter((o) => {
    const matchSearch = o._id?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || o.orderStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) return <div className="text-center text-slate-400 py-20 text-base">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShoppingCart className="text-blue-500" size={28} />
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-slate-400 mt-1">View and manage all orders.</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
            <input type="text" placeholder="Search by Order ID..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-11 pr-4 py-3 text-sm outline-none focus:border-blue-500" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500">
            <option>All</option><option>Pending</option><option>Paid</option><option>Shipped</option>
            <option>Delivered</option><option>Cancelled</option>
          </select>
        </div>
      </div>

      <div className="hidden lg:block bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr className="text-left text-sm">
              <th className="p-4">Order ID</th><th className="p-4">Customer</th><th className="p-4">Items</th>
              <th className="p-4">Total</th><th className="p-4">Status</th><th className="p-4">Date</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o._id} className="border-t border-slate-800 hover:bg-slate-800 text-sm">
                <td className="p-4 font-mono">#{o._id?.slice(-6).toUpperCase()}</td>
                <td className="p-4">{o.userId?.username || "-"}</td>
                <td className="p-4">{o.items?.length || 0}</td>
                <td className="p-4">₹{o.totalAmount?.toLocaleString("en-IN")}</td>
                <td className="p-4">
                  <select value={o.orderStatus}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border-0 outline-none cursor-pointer ${statusColors[o.orderStatus] || ""}`}>
                    <option value="Pending">Pending</option><option value="Paid">Paid</option>
                    <option value="Shipped">Shipped</option><option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="p-4">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <div className="flex justify-center">
                    <button onClick={() => setSelectedOrder(o)} className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg"><Eye size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden space-y-4">
        {filtered.map((o) => (
          <div key={o._id} className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-mono text-sm font-semibold">#{o._id?.slice(-6).toUpperCase()}</p>
                <p className="text-slate-400 text-sm">{o.userId?.username || "-"}</p>
              </div>
              <button onClick={() => setSelectedOrder(o)} className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg"><Eye size={18} /></button>
            </div>
            <div className="flex gap-4 mt-3 text-sm text-slate-300">
              <span>{o.items?.length} items</span>
              <span>₹{o.totalAmount?.toLocaleString("en-IN")}</span>
            </div>
            <div className="mt-3">
              <select value={o.orderStatus}
                onChange={(e) => updateStatus(o._id, e.target.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium border-0 outline-none cursor-pointer ${statusColors[o.orderStatus] || ""}`}>
                <option value="Pending">Pending</option><option value="Paid">Paid</option>
                <option value="Shipped">Shipped</option><option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-slate-900 w-full max-w-lg rounded-xl border border-slate-700 p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-2xl text-slate-400 hover:text-white">&times;</button>
            <h2 className="text-2xl font-bold text-blue-500 mb-5">Order #{selectedOrder._id?.slice(-6).toUpperCase()}</h2>

            <div className="space-y-4 text-sm">
              <div><p className="text-slate-400 text-sm mb-1">Customer</p><p className="font-medium">{selectedOrder.userId?.username} ({selectedOrder.userId?.email})</p></div>
              <div><p className="text-slate-400 text-sm mb-1">Shipping Address</p><p>{selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.zipCode}, {selectedOrder.shippingAddress?.country}</p></div>
              <div><p className="text-slate-400 text-sm mb-1">Items</p>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="bg-slate-800 rounded px-4 py-2.5 flex justify-between text-sm">
                      <span>{item.title} x{item.quantity}</span>
                      <span>₹{(item.priceAtPurchase * item.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-700">
                <span className="font-semibold text-base">Total</span>
                <span className="font-bold text-blue-400 text-lg">₹{selectedOrder.totalAmount?.toLocaleString("en-IN")}</span>
              </div>
              <div><p className="text-slate-400 text-sm mb-1">Status</p>
                <select value={selectedOrder.orderStatus}
                  onChange={(e) => { updateStatus(selectedOrder._id, e.target.value); setSelectedOrder({...selectedOrder, orderStatus: e.target.value}); }}
                  className={`px-3 py-1 rounded-full text-sm font-medium border-0 outline-none cursor-pointer ${statusColors[selectedOrder.orderStatus] || ""}`}>
                  <option value="Pending">Pending</option><option value="Paid">Paid</option>
                  <option value="Shipped">Shipped</option><option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <p className="text-xs text-slate-500">Ordered on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelectedOrder(null)} className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
