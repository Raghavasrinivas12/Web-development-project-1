import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Package, Truck, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";

const statusColors = {
  Pending: "bg-yellow-500/20 text-yellow-500",
  Paid: "bg-blue-500/20 text-blue-500",
  Shipped: "bg-purple-500/20 text-purple-500",
  Delivered: "bg-green-500/20 text-green-500",
  Cancelled: "bg-red-500/20 text-red-500",
};

const placeholders = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46",
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
];

export default function MyOrders() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.orders);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getImage = (index) => placeholders[index % placeholders.length];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Package className="text-blue-500" size={28} />
          <h1 className="text-3xl font-bold text-white">My Orders</h1>
          {orders.length > 0 && (
            <span className="text-slate-400 text-sm mt-1.5">
              ({orders.length})
            </span>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
              <Package size={32} className="text-slate-500" />
            </div>
            <p className="text-slate-400 text-lg">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-slate-500">
                        Ordered on{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        ID: {order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[order.orderStatus] || "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {order.orderStatus || "Pending"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <img
                          src={item.productId?.images?.[0] || getImage(idx)}
                          alt={item.title}
                          className="w-16 h-16 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm truncate">
                            {item.title}
                          </p>
                          <p className="text-slate-400 text-xs">
                            Qty: {item.quantity} × ₹{item.priceAtPurchase?.toLocaleString()}
                          </p>
                        </div>
                        <p className="text-white font-semibold text-sm">
                          ₹{(item.quantity * item.priceAtPurchase).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800">
                    <p className="text-white font-bold">
                      Total: ₹{order.totalAmount?.toLocaleString()}
                    </p>
                    <button
                      onClick={() =>
                        setExpanded(expanded === order._id ? null : order._id)
                      }
                      className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition"
                    >
                      {expanded === order._id ? (
                        <>Hide Details <ChevronUp size={14} /></>
                      ) : (
                        <>Shipment Details <ChevronDown size={14} /></>
                      )}
                    </button>
                  </div>
                </div>

                {expanded === order._id && order.shippingAddress && (
                  <div className="bg-slate-950/50 px-5 py-4 border-t border-slate-800">
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-blue-500 mt-0.5 shrink-0" />
                      <div className="text-sm text-slate-300">
                        <p>{order.shippingAddress.street}</p>
                        <p>
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state}{" "}
                          {order.shippingAddress.zipCode}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-sm text-slate-400">
                      <Truck size={16} />
                      <span>
                        Status:{" "}
                        <span className="text-white font-medium">
                          {order.orderStatus || "Pending"}
                        </span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
