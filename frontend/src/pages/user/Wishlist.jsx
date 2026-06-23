import {
  Heart,
  ShoppingCart,
  Trash2,
  Star,
} from "lucide-react";

const Wishlist = () => {
  const wishlistItems = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 1499,
      originalPrice: 1999,
      discount: 25,
      rating: 4.5,
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
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    },
    {
      id: 3,
      name: "Gaming Mouse",
      price: 799,
      originalPrice: 1199,
      discount: 33,
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
    },
    {
    id: 4,
    name: "Laptop",
    price: "₹49,999",
    originalPrice: 60000,
    discount: 10,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
  },
  ];

  return (
    <div className=" bg-slate-950 text-white px-6 py-14">
      {/* Heading */}
      <div className="flex items-center gap-3 mb-8">
        <Heart className="text-blue-500" size={32} />
        <h1 className="text-4xl font-bold">
          My Wishlist
        </h1>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
            >
              {/* Product Image */}
              <img
                src={item.image}
                alt={item.name}
                className="h-48 w-full object-cover"
              />

              <div className="p-3">
                {/* Product Name */}
                <h3 className="text-white text-base font-semibold">
                  {item.name}
                </h3>

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

                {/* Buttons */}
                <div className="flex gap-3 mt-5">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 py-2 rounded-lg transition">
                    
                    Add to Cart
                  </button>

                  <button className="p-2 bg-slate-500 hover:bg-red-600 rounded-lg transition">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-20">
          <Heart
            size={80}
            className="text-slate-700 mb-4"
          />

          <h2 className="text-2xl font-semibold mb-2">
            Your Wishlist is Empty
          </h2>

          <p className="text-slate-400">
            Save items you love and view them later.
          </p>
        </div>
      )}
    </div>
  );
};

export default Wishlist;