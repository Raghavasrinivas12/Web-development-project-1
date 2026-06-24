import {
  Package,
  MapPin,
  CreditCard,
  Truck,
  FileText,
  CheckCircle,
} from "lucide-react";

const OrderDetails = () => {
  const order = {
    id: "#ORD12345",
    date: "22 June 2026",
    status: "Delivered",
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    product: {
      name: "Wireless Headphones",
      price: 1499,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    },
    address: {
      name: "Anusha",
      street: "123 Main Street",
      city: "Chennai",
      pincode: "600001",
    },
  };

  const shipping = 100;
  const discount = 200;
  const total = order.product.price + shipping - discount;

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 sm:px-6 py-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="bg-slate-900 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Package className="text-blue-500" size={28} />
            <h1 className="text-3xl font-bold">
              Order Details
            </h1>
          </div>

          <p className="text-slate-300">
            Order ID: {order.id}
          </p>

          <p className="text-slate-300 mt-1">
            Placed On: {order.date}
          </p>

          <div className="flex items-center justify-between flex-wrap gap-4 mt-4">
            <span className="px-4 py-2 rounded-full bg-green-500/20 text-green-400 font-medium">
              {order.status}
            </span>

            <span className="text-slate-400 text-sm">
              Expected Delivery: 25 June 2026
            </span>
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-slate-900 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-5">
            Product Details
          </h2>

          <div className="flex flex-col md:flex-row gap-5">
            <img
              src={order.product.image}
              alt={order.product.name}
              className="w-full md:w-40 h-40 object-cover rounded-lg"
            />

            <div>
              <h3 className="text-xl font-semibold">
                {order.product.name}
              </h3>

              <p className="text-blue-500 font-bold text-lg mt-2">
                ₹{order.product.price}
              </p>

              <p className="text-slate-400 mt-1">
                Quantity: {order.product.quantity}
              </p>
            </div>
          </div>
        </div>

        {/* Tracking */}
        <div className="bg-slate-900 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-6">
            Order Tracking
          </h2>

          <div className="space-y-5">

            <div className="flex items-center gap-4">
              <CheckCircle className="text-green-500" />
              <p>Order Placed</p>
            </div>

            <div className="flex items-center gap-4">
              <CheckCircle className="text-green-500" />
              <p>Order Confirmed</p>
            </div>

            <div className="flex items-center gap-4">
              <CheckCircle className="text-green-500" />
              <p>Shipped</p>
            </div>

            <div className="flex items-center gap-4">
              <CheckCircle className="text-green-500" />
              <p>Delivered</p>
            </div>

          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-slate-900 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="text-blue-500" />
            <h2 className="text-2xl font-semibold">
              Delivery Address
            </h2>
          </div>

          <p>{order.address.name}</p>
          <p>{order.address.street}</p>
          <p>{order.address.city}</p>
          <p>{order.address.pincode}</p>
        </div>

        {/* Payment Information */}
        <div className="bg-slate-900 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="text-blue-500" />
            <h2 className="text-2xl font-semibold">
              Payment Information
            </h2>
          </div>

          <p>
            Payment Method:
            <span className="text-blue-500 ml-2">
              {order.paymentMethod}
            </span>
          </p>

          <p className="mt-2">
            Status:
            <span className="text-green-500 ml-2">
              {order.paymentStatus}
            </span>
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-slate-900 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-5">
            Order Summary
          </h2>

          <div className="space-y-3">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{order.product.price}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{shipping}</span>
            </div>

            <div className="flex justify-between text-green-500">
              <span>Discount</span>
              <span>-₹{discount}</span>
            </div>

            <hr className="border-slate-700" />

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-blue-500">
                ₹{total}
              </span>
            </div>

          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <button className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 py-3 rounded-lg font-medium">
            <Truck size={20} />
            Track Order
          </button>

          <button className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 py-3 rounded-lg font-medium">
            <FileText size={20} />
            Download Invoice
          </button>

        </div>

      </div>
    </div>
  );
};

export default OrderDetails;