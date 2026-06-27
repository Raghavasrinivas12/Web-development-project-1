import { useState } from "react";
import {
  Star,
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  Truck,
  Tag,
} from "lucide-react";

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1);

  const product = {
    id: 1,
    name: "Wireless Headphones",
    price: 1499,
    originalPrice: 1999,
    discount: 25,
    rating: 4.5,
    ratingsCount:12345,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    description:
      "Premium wireless headphones with noise cancellation, deep bass, and 30 hours battery life.",
  };

 return (
  <div className="min-h-screen bg-slate-950 text-white px-4 sm:px-6 py-6 sm:py-10">
    <div className="max-w-7xl mx-auto">

      {/* Product Section */}
      <div className="grid grid-cols-1 lg;grid-cols-2 gap-6 lg:gap:10">

        {/* Product Image */}
        <div className="bg-slate-900 rounded-xl p-6">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 sm:h-80 md:h-96 lg:h-[450px] object-cover rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-2xl md:text-4xl font-bold">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-4">
            <div className="flex items-center bg-green-600 px-2 py-1 rounded">
              <span className="mr-1">{product.rating}</span>

              <Star
                size={14}
                className="fill-yellow-400 text-yellow-400"
              />
            </div>

            <span className="text-slate-400">
              {product.ratingsCount.toLocaleString()} Ratings
            </span>
          </div>

          {/* Price */}
          <div className="mt-4">
            <span className="text-2xl md:text-3xl font-bold text-blue-500">
              ₹{product.price}
            </span>

            <span className="ml-3 text-slate-400 line-through">
              ₹{product.originalPrice}
            </span>

            <span className="ml-3 text-green-500 font-semibold">
              {product.discount}% OFF
            </span>
          </div>

          {/* Description */}
          <p className="mt-6 text-slate-300 leading-relaxed">
            {product.description}
          </p>

          {/* Offers */}
          <div className="bg-slate-900 p-5 rounded-xl mt-6">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Tag size={18} />
              Available Offers
            </h3>

            <ul className="space-y-2 text-slate-300">
              <li>🏷️ 10% Instant Discount on HDFC Cards</li>
              <li>🏷️ Flat ₹500 Off on Orders Above ₹3000</li>
              <li>🏷️ No Cost EMI Available</li>
              <li>🚚 Free Delivery Available</li>
            </ul>
          </div>

          {/* Delivery */}
          <div className="mt-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Truck size={18} />
              Delivery
            </h3>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Enter Pincode"
                className="bg-slate-800 px-4 py-3 rounded-lg outline-none flex-1"
              />

              <button className="bg-blue-500 hover:bg-blue-600 px-5 rounded-lg">
                Check
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <h3 className="font-semibold mb-3">
              Quantity
            </h3>

            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  quantity > 1 &&
                  setQuantity(quantity - 1)
                }
                className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700"
              >
                <Minus size={18} />
              </button>

              <span className="text-xl font-semibold">
                {quantity}
              </span>

              <button
                onClick={() =>
                  setQuantity(quantity + 1)
                }
                className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">

  <button className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg">
    <ShoppingCart size={20} />
    Add to Cart
  </button>

  <button className="w-full bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg">
    Buy Now
  </button>

  <button className="w-full flex items-center justify-center gap-2 bg-slate-500 hover:bg-slate-600 px-6 py-3 rounded-lg">
    <Heart size={20} />
    Wishlist
  </button>

</div>

      {/*Highlights*/}
              </div>
      </div>

      {/* Highlights */}
      <div className="bg-slate-900 rounded-xl p-6 mt-10">
        <h2 className="text-2xl font-bold mb-4">
          Highlights
        </h2>

        <ul className="list-disc ml-6 space-y-2 text-slate-300">
          <li>Bluetooth 5.3 Connectivity</li>
          <li>30 Hours Battery Backup</li>
          <li>Active Noise Cancellation</li>
          <li>Fast Charging Support</li>
          <li>Built-in Microphone</li>
        </ul>
      </div>

      {/* Specifications */}
      <div className="bg-slate-900 rounded-xl p-6 mt-10">
        <h2 className="text-2xl font-bold mb-4">
          Specifications
        </h2>

        <ul className="space-y-3 text-slate-300">
          <li>Bluetooth 5.3 Connectivity</li>
          <li>30 Hours Battery Backup</li>
          <li>Active Noise Cancellation</li>
          <li>Fast Charging Support</li>
          <li>Built-in Microphone</li>
        </ul>
      </div>

      {/* Reviews */}
      <div className="bg-slate-900 rounded-xl p-4 sm:p-6 mt-8">
        <h2 className="text-2xl font-bold mb-4">
          Customer Reviews
        </h2>

        <div className="border-b border-slate-700 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Star
              size={16}
              className="fill-yellow-400 text-yellow-400"
            />
            <span>5.0</span>
          </div>

          <p className="mt-2 text-slate-300">
            Excellent sound quality and battery life.
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <Star
              size={16}
              className="fill-yellow-400 text-yellow-400"
            />
            <span>4.0</span>
          </div>

          <p className="mt-2 text-slate-300">
            Comfortable to wear and worth the price.
          </p>
        </div>
      </div>

      {/* Similar Products */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6">
          Similar Products
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-slate-900 rounded-xl p-4 hover:scale-105 transition"
            >
              <img
                src={product.image}
                alt="Product"
                className="w-full h-28 sm:h-40 object-cover rounded-lg"
              />

              <h3 className="mt-3 text-sm md:text-base font-semibold">
                Wireless Headphones
              </h3>

              <p className="text-blue-500 font-bold mt-2">
                ₹1499
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
);
};

export default ProductDetails;