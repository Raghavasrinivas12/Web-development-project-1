import { useState } from "react";
import { Search, Star, Heart,ShoppingCart } from "lucide-react";

const SearchFilter = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");

  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      category: "Electronics",
      price: 1499,
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    },
    {
      id: 2,
      name: "Smart Watch",
      category: "Electronics",
      price: 2499,
      rating: 4.2,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    },
    {
      id: 3,
      name: "Running Shoes",
      category: "Fashion",
      price: 1999,
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    },
    {
      id: 4,
      name: "Backpack",
      category: "Accessories",
      price: 999,
      rating: 4.3,
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    },
    {
      id: 5,
      name: "Bluetooth Speaker",
      category: "Electronics",
      price: 1799,
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500",
    },
    {
      id: 6,
      name: "Casual T-Shirt",
      category: "Fashion",
      price: 699,
      rating: 4.1,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    },
  ];

  const filteredProducts = products
    .filter(
      (product) =>
        product.name
          .toLowerCase()
          .includes(search.toLowerCase()) &&
        (category === "All" ||
          product.category === category)
    )
    .sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <h1 className="text-3xl font-bold mb-8">
          Search & Filter Products
        </h1>

        {/* Search */}
        <div className="relative mb-6">
          <Search
            size={20}
            className="absolute left-4 top-4 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-12 pr-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 outline-none"
          >
            <option>All</option>
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Accessories</option>
          </select>

          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
            className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 outline-none"
          >
            <option value="">
              Sort By
            </option>

            <option value="low">
              Price: Low to High
            </option>

            <option value="high">
              Price: High to Low
            </option>
          </select>

        </div>

        {/* Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-slate-900 rounded-xl overflow-hidden hover:scale-105 transition duration-300"
            >

              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-52 object-cover"
                />
                
                <div className="flex items-center gap-2 ">
                <button className="absolute top-3 right-15 bg-slate-950/70 p-2 rounded-full hover:text-blue-600">
                  <Heart size={18} />
                  
                </button>
                <button className="absolute top-3 right-3 bg-slate-950/70 p-2 rounded-full hover:text-blue-600">
                <ShoppingCart size={18} />
                </button>
              </div>
              </div>

              <div className="p-4">

                <h3 className="font-semibold text-lg">
                  {product.name}
                </h3>

                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center bg-green-600 px-2 py-1 rounded text-sm">
                    {product.rating}
                    <Star
                      size={12}
                      className="ml-1 fill-white text-white"
                    />
                  </div>
                </div>

                <p className="text-blue-500 text-xl font-bold mt-3">
                  ₹{product.price}
                </p>

                <button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 py-2 rounded-lg font-medium">
                  View Product
                </button>

              </div>
            </div>
          ))}

        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center mt-10">
            <h2 className="text-xl text-slate-400">
              No Products Found
            </h2>
          </div>
        )}

      </div>
    </div>
  );
};

export default SearchFilter;