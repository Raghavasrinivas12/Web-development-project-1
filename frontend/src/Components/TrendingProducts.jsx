const products = [
  {
    name: "Wireless Headphones",
    price: "₹1,499",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  },
  {
    name: "Smart Watch",
    price: "₹2,999",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  },
  {
    name: "Gaming Mouse",
    price: "₹799",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46",
  },
  {
    name: "Laptop",
    price: "₹49,999",
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
            className="bg-slate-900 rounded-xl overflow-hidden shadow-lg"
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

              <p className="text-blue-500 font-bold mt-2">
                {product.price}
              </p>

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
