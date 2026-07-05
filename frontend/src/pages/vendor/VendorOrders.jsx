import React, { useState } from "react";
import {
  ShoppingBag,
  Clock3,
  Truck,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

const VendorOrders = () => {
  const [orders, setOrders] = useState([
    {
      id: "#ORD1001",
      customer: "Rahul Sharma",
      product: "Wireless Mouse",
      quantity: 2,
      amount: "₹1,200",
      payment: "Paid",
      status: "Pending",
      date: "04 Jul 2026",
    },
    {
      id: "#ORD1002",
      customer: "Priya Singh",
      product: "Gaming Keyboard",
      quantity: 2,
      amount: "₹3,500",
      payment: "Paid",
      status: "Delivered",
      date: "03 Jul 2026",
    },
    {
      id: "#ORD1003",
      customer: "Arjun Patel",
      product: "USB Hub",
      quantity: 2,
      amount: "₹2,100",
      payment: "COD",
      status: "Processing",
      date: "02 Jul 2026",
    },
    {
      id: "#ORD1004",
      customer: "Rahul Sharma",
      product: "Laptop Stand",
      quantity: 2,
      amount: "₹1,200",
      payment: "Paid",
      status: "Shipped",
      date: "01 Jul 2026",
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || order.status === filter;

    return matchesSearch && matchesFilter;
  });

  const updateStatus = () => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === selectedOrder.id
          ? { ...order, status }
          : order
      )
    );

    toast.success("Order status updated successfully!");

    setShowModal(false);
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      {/* Header */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Orders
        </h1>

        <p className="text-slate-400 mt-2">
          Manage and track all customer orders
        </p>
      </div>

      {/* Summary */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm">
                Total Orders
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {orders.length}
              </h2>
            </div>

            <ShoppingBag
              className="text-blue-500"
              size={34}
            />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm">
                Pending
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {orders.filter((o) => o.status === "Pending").length}
              </h2>
            </div>

            <Clock3
              className="text-yellow-400"
              size={34}
            />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm">
                Shipped
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {orders.filter((o) => o.status === "Shipped").length}
              </h2>
            </div>

            <Truck
              className="text-purple-400"
              size={34}
            />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm">
                Delivered
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {orders.filter((o) => o.status === "Delivered").length}
              </h2>
            </div>

            <CheckCircle2
              className="text-green-500"
              size={34}
            />
          </div>
        </div>

      </div>

      {/* Search */}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">

        <div className="flex flex-col lg:flex-row gap-4">

          <input
            type="text"
            placeholder="Search Order ID or Customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
          >
            <option>All</option>
            <option>Pending</option>
            <option>Processing</option>
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
              <th className="px-6 py-4 text-left">Product</th>
              <th className="px-6 py-4 text-left">Qty</th>
              <th className="px-6 py-4 text-left">Amount</th>
              <th className="px-6 py-4 text-left">Payment</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-left">Action</th>

            </tr>

          </thead>

          <tbody>

            {filteredOrders.map((order) => (

              <tr
                key={order.id}
                className="border-t border-slate-800 hover:bg-slate-800/40"
              >

                <td className="px-6 py-4">{order.id}</td>

                <td className="px-6 py-4">{order.customer}</td>

                <td className="px-6 py-4">{order.product}</td>

                <td className="px-6 py-4">{order.quantity}</td>

                <td className="px-6 py-4">{order.amount}</td>

                <td className="px-6 py-4">{order.payment}</td>
                                <td className="px-6 py-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      order.status === "Delivered"
                        ? "bg-green-500/20 text-green-400"
                        : order.status === "Pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : order.status === "Processing"
                        ? "bg-blue-500/20 text-blue-400"
                        : order.status === "Shipped"
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {order.status}
                  </span>

                </td>

                <td className="px-6 py-4">
                  {order.date}
                </td>

                <td className="px-6 py-4">

                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setStatus(order.status);
                      setShowModal(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
                  >
                    View
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Mobile Cards */}

      <div className="lg:hidden space-y-5">

        {filteredOrders.map((order) => (

          <div
            key={order.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5"
          >

            <div className="flex justify-between">

              <div>

                <h2 className="font-bold text-lg">
                  {order.id}
                </h2>

                <p className="text-slate-400">
                  {order.customer}
                </p>

              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  order.status === "Delivered"
                    ? "bg-green-500/20 text-green-400"
                    : order.status === "Pending"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : order.status === "Processing"
                    ? "bg-blue-500/20 text-blue-400"
                    : order.status === "Shipped"
                    ? "bg-purple-500/20 text-purple-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {order.status}
              </span>

            </div>

            <div className="mt-4 space-y-3 text-sm">

              <p>
                <span className="text-slate-400">Product:</span>{" "}
                {order.product}
              </p>

              <p>
                <span className="text-slate-400">Quantity:</span>{" "}
                {order.quantity}
              </p>

              <p>
                <span className="text-slate-400">Amount:</span>{" "}
                {order.amount}
              </p>

              <p>
                <span className="text-slate-400">Payment:</span>{" "}
                {order.payment}
              </p>

              <p>
                <span className="text-slate-400">Date:</span>{" "}
                {order.date}
              </p>

            </div>

            <button
              onClick={() => {
                setSelectedOrder(order);
                setStatus(order.status);
                setShowModal(true);
              }}
              className="mt-5 w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-lg font-semibold transition"
            >
              View Details
            </button>

          </div>

        ))}

      </div>

      {/* Modal */}

      {showModal && selectedOrder && (

        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">

          <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center border-b border-slate-800 p-6">

              <h2 className="text-xl md:text-2xl font-bold">
                Order Details
              </h2>

              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedOrder(null);
                }}
                className="text-3xl leading-none text-slate-400 hover:text-blue-400"
              >
                ×
              </button>

            </div>

            <div className="p-4 md:p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <p className="text-slate-400 text-sm">Order ID</p>
                  <h3>{selectedOrder.id}</h3>
                </div>

                <div>
                  <p className="text-slate-400 text-sm">Customer</p>
                  <h3>{selectedOrder.customer}</h3>
                </div>

                <div>
                  <p className="text-slate-400 text-sm">Product</p>
                  <h3>{selectedOrder.product}</h3>
                </div>

                <div>
                  <p className="text-slate-400 text-sm">Quantity</p>
                  <h3>{selectedOrder.quantity}</h3>
                </div>

                <div>
                  <p className="text-slate-400 text-sm">Amount</p>
                  <h3>{selectedOrder.amount}</h3>
                </div>

                <div>
                  <p className="text-slate-400 text-sm">Payment</p>
                  <h3>{selectedOrder.payment}</h3>
                </div>

                <div className="md:col-span-2">

                  <p className="text-slate-400 text-sm mb-2">
                    Update Status
                  </p>

                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                  >
                    <option>Pending</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>

                </div>

              </div>

              <div>

                <p className="text-slate-400 text-sm mb-2">
                  Shipping Address
                </p>

                <div className="bg-slate-800 rounded-lg p-4 break-words">
                  45 MG Road <br />
                  Bengaluru <br />
                  Karnataka - 560001
                </div>

              </div>

            </div>

            <div className="border-t border-slate-800 p-4 md:p-6 flex flex-col sm:flex-row justify-end gap-3">

              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedOrder(null);
                }}
                className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-lg"
              >
                Close
              </button>

              <button
                onClick={updateStatus}
                className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg"
              >
                Update Status
              </button>

            </div>

          </div>

        </div>

      )}

      {/* Pagination */}

      <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4 border-t border-slate-800 pt-6">

        <p className="text-slate-400">
          Showing {filteredOrders.length} of {orders.length} Orders
        </p>

        <div className="flex gap-3">

          <button className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg">
            Previous
          </button>

          <button className="bg-blue-500 px-4 py-2 rounded-lg">
            1
          </button>

          <button className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg">
            Next
          </button>

        </div>

      </div>

    </div>
  );
};

export default VendorOrders;