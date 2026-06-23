import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Star,
} from "lucide-react";

const Cart = () => {
  const cartItems = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 1499,
      originalPrice: 1999,
      discount: 25,
      rating: 4.5,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 2999,
      originalPrice: 3999,
      discount: 25,
      rating: 4.2,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    },
  ];

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = 100;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      {/* Heading */}
      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart
          size={32}
          className="text-blue-500"
        />
        <h1 className="text-4xl font-bold">
          Shopping Cart
        </h1>
      </div>

      
        {/* Cart Items */}
        <div className=" space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 rounded-xl p-6 flex flex-col md:flex-row gap-6 shadow-lg w-full"
            >
              {/* Product Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-full md:w-40 h-40 object-cover rounded-lg"
              />

              {/* Product Details */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold">
                  {item.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-2">
                  <Star
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />
                  <span className="text-sm text-slate-300">
                    {item.rating}
                  </span>
                </div>

                {/* Price */}
                <div className="mt-3">
                  <span className="text-blue-500 text-xl font-bold">
                    ₹{item.price}
                  </span>

                  <span className="ml-3 text-slate-400 line-through">
                    ₹{item.originalPrice}
                  </span>

                  <span className="ml-3 text-green-500 font-semibold">
                    {item.discount}% OFF
                  </span>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3 mt-5">
                  <button className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700">
                    <Minus size={16} />
                  </button>

                  <span className="font-semibold">
                    {item.quantity}
                  </span>

                  <button className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700">
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Remove */}
              <button className="self-start bg-slate-500 hover:bg-blue-600 p-2 rounded-lg transition">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-slate-900 rounded-xl p-6 mt-8 shadow-lg w-full">
          <h2 className="text-2xl font-bold mb-6">
            Order Summary
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{shipping}</span>
            </div>

            <div className="flex justify-between text-green-500">
              <span>Discount</span>
              <span>-₹500</span>
            </div>

            <hr className="border-slate-700" />

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>

              <span className="text-blue-500">
                ₹{total}
              </span>
            </div>

            <button className="w-full  bg-blue-500 hover:bg-blue-600 py-4 rounded-lg font-semibold transition">
              Proceed to Checkout
            </button>
          </div>
        </div>
      
    </div>
  );
};

export default Cart;