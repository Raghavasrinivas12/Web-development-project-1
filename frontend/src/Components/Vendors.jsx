const vendors = [
  "Tech Store",
  "Fashion Hub",
  "Book World",
  "Home Essentials",
];

const TopVendors = () => {
  return (
    <section className="bg-slate-900 py-16 px-6">
      <h2 className="text-4xl font-bold text-white text-center mb-10">
        Top Vendors
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {vendors.map((vendor, index) => (
          <div
            key={index}
            className="bg-slate-950 border border-slate-800 p-8 rounded-xl text-center hover:border-blue-500 transition"
          >
            <h3 className="text-white font-semibold text-lg">
              {vendor}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopVendors;