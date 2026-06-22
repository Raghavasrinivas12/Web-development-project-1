const categories = [
  {
    name: "Fashion",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050",
  },
  {
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
  },
  {
    name: "Furniture",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
  },
  {
    name: "Books",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da",
  },
];

const FeaturedCategories = () => {
  return (
    <section className="bg-slate-950 py-16 px-6">
      <h2 className="text-4xl font-bold text-white text-center mb-10">
        Featured Categories
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((category, index) => (
          <div
            key={index}
            className="bg-slate-900 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition"
          >
            <img
              src={category.image}
              alt={category.name}
              className="h-56 w-full object-cover"
            />

            <div className="p-4">
              <h3 className="text-white text-xl font-semibold text-center">
                {category.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCategories;