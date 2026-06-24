import { Package, Truck } from "lucide-react";

const MyOrders = () => {
  const orders = [
    {
      id: "#ORD001",
      product: "Wireless Headphones",
      price: 1499,
      date: "20 June 2026",
      status: "Delivered",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    },
    {
      id: "#ORD002",
      product: "Smart Watch",
      price: 2999,
      date: "22 June 2026",
      status: "Shipped",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Package className="text-blue-500" size={32} />
        <h1 className="text-4xl font-bold">My Orders</h1>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-slate-900 rounded-xl p-5 flex flex-col md:flex-row gap-5"
          >
            <img
              src={order.image}
              alt={order.product}
              className="w-full md:w-40 h-40 object-cover rounded-lg"
            />

            <div className="flex-1">
              <h2 className="text-xl font-semibold">
                {order.product}
              </h2>

              <p className="text-blue-500 font-bold mt-2">
                ₹{order.price}
              </p>

              <p className="text-slate-400 mt-2">
                Order ID: {order.id}
              </p>

              <p className="text-slate-400">
                Ordered On: {order.date}
              </p>

              <span
                className={`inline-block mt-3 px-3 py-1 rounded-full text-sm ${
                  order.status === "Delivered"
                    ? "bg-green-500/20 text-green-500"
                    : "bg-yellow-500/20 text-yellow-500"
                }`}
              >
                {order.status}
              </span>
            </div>

            <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg h-fit">
              <Truck size={18} />
              Track Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;