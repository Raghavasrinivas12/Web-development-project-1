import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const FeaturedCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/home/categories")
      .then((res) => setCategories(res.data.categories))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || categories.length === 0) return null;

  return (
    <section className="bg-slate-950 py-14 px-6">
      <h2 className="text-3xl font-bold text-white text-center mb-8">
        Featured Categories
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            to={`/products?category=${cat.name.toLowerCase()}`}
            className="bg-slate-900 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition block"
          >
            {cat.image && (
              <img
                src={cat.image}
                alt={cat.name}
                className="h-48 w-full object-cover"
              />
            )}
            <div className="p-3">
              <h3 className="text-white text-lg font-semibold text-center">
                {cat.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCategories;
