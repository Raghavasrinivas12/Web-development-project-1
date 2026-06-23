import{
  Star,
 
}from "lucide-react";

const products = [
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

const TrendingProducts = () => {
  return (
    <section className="bg-slate-950 py-14 px-6">
      <h2 className="text-3xl font-bold text-white text-center mb-8">
        Trending Products
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div
            key={index}
            className="bg-slate-900 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-48 w-full object-cover"
            />

            <div className="p-3">
              <h3 className="text-white text-base font-semibold">
                {product.name}
              </h3>

              <div className="flex items-center gap-1 mt-2">
                  <Star
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />
                  <span className="text-sm text-slate-300">
                    {product.rating}
                  </span>
                </div>

              <span className="text-blue-500 font-bold mt-2">
                {product.price}
              </span>

              <span className="ml-3 text-slate-400 line-through">
                    ₹{product.originalPrice}
              </span>

              <span className="ml-3 text-green-500 font-semibold">
                    {product.discount}% OFF
              </span>

              <button className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg">
                
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingProducts;
