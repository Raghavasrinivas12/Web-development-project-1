import { useState } from "react";
import {
  MapPin,
  CreditCard,
  Pencil,
  ShoppingBag,
} from "lucide-react";

const Checkout = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [address, setAddress] = useState({
    name: "Anusha",
    street: "123 Main Street",
    city: "Chennai",
    pincode: "600001",
  });

  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 1499,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 2999,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    },
  ];

  const subtotal = products.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = 100;
  const discount = 500;
  const total = subtotal + shipping - discount;

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <h1 className="text-4xl font-bold mb-8">
        Checkout
      </h1>

      {/* Purchased Products */}
      <div className="bg-slate-900 p-6 rounded-xl mb-8">
        <div className="flex items-center gap-2 mb-5">
          <ShoppingBag className="text-blue-500" />
          <h2 className="text-2xl font-semibold">
            Purchased Products
          </h2>
        </div>

        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col md:flex-row gap-4 bg-slate-800 p-4 rounded-lg"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full md:w-24 h-24 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  {product.name}
                </h3>

                <p className="text-blue-500 font-bold mt-1">
                  ₹{product.price}
                </p>

                <p className="text-slate-400">
                  Quantity: {product.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-slate-900 p-6 rounded-xl mb-8">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <MapPin className="text-blue-500" />
            <h2 className="text-2xl font-semibold">
              Delivery Address
            </h2>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
          >
            <Pencil size={16} />
            Edit
          </button>
        </div>

        {!isEditing ? (
          <div className="space-y-2 text-slate-300">
            <p>{address.name}</p>
            <p>{address.street}</p>
            <p>{address.city}</p>
            <p>{address.pincode}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              value={address.name}
              onChange={(e) =>
                setAddress({
                  ...address,
                  name: e.target.value,
                })
              }
              className="w-full p-3 rounded-lg bg-slate-800 outline-none"
              placeholder="Full Name"
            />

            <input
              type="text"
              value={address.street}
              onChange={(e) =>
                setAddress({
                  ...address,
                  street: e.target.value,
                })
              }
              className="w-full p-3 rounded-lg bg-slate-800 outline-none"
              placeholder="Street Address"
            />

            <input
              type="text"
              value={address.city}
              onChange={(e) =>
                setAddress({
                  ...address,
                  city: e.target.value,
                })
              }
              className="w-full p-3 rounded-lg bg-slate-800 outline-none"
              placeholder="City"
            />

            <input
              type="text"
              value={address.pincode}
              onChange={(e) =>
                setAddress({
                  ...address,
                  pincode: e.target.value,
                })
              }
              className="w-full p-3 rounded-lg bg-slate-800 outline-none"
              placeholder="Pincode"
            />
           <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => setIsEditing(false)}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
            >
              Save Address
            </button>
            <button onClick={()=>setIsEditing(false)} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg">
               Cancel
            </button>
          </div>
          </div>
        )}
      </div>

      {/* Payment Method */}
      <div className="bg-slate-900 p-6 rounded-xl mb-8">
        <div className="flex items-center gap-2 mb-5">
          <CreditCard className="text-blue-500" />
          <h2 className="text-2xl font-semibold">
            Payment Method
          </h2>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input type="radio" name="payment" />
            Cash on Delivery
          </label>

          <label className="flex items-center gap-3">
            <input type="radio" name="payment" />
            UPI Payment
          </label>

          <label className="flex items-center gap-3">
            <input type="radio" name="payment" />
            Credit / Debit Card
          </label>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-slate-900 p-6 rounded-xl">
        <h2 className="text-2xl font-semibold mb-5">
          Order Summary
        </h2>

        <div className="space-y-3">
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
            <span>-₹{discount}</span>
          </div>

          <hr className="border-slate-700" />

          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>

            <span className="text-blue-500">
              ₹{total}
            </span>
          </div>

          <button className="w-full mt-6 bg-blue-500 hover:bg-blue-600 py-3 rounded-lg font-semibold transition">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;