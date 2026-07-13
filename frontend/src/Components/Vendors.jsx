import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../config";

const TopVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/stores`)
      .then((res) => setVendors(res.data.stores))
      .catch(() => setVendors([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || vendors.length === 0) return null;

  return (
    <section className="bg-slate-900 py-14 px-6">
      <h2 className="text-3xl font-bold text-white text-center mb-8">
        Top Vendors
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {vendors.slice(0, 8).map((vendor) => (
          <div
            key={vendor._id}
            className="bg-slate-950 border border-slate-800 p-6 rounded-xl text-center hover:border-blue-500 transition"
          >
            <h3 className="text-white font-semibold text-base">
              {vendor.storeName}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopVendors;
