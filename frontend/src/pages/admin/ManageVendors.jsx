import { useState } from "react";
import {
  Store,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  Mail,
  Phone,
  CalendarDays,
} from "lucide-react";

const ManageVendors = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedVendor, setSelectedVendor] = useState(null);

  const [vendors, setVendors] = useState([
    {
      id: 1,
      owner: "Rahul Sharma",
      store: "Tech World",
      email: "techworld@gmail.com",
      phone: "+91 9876543210",
      joined: "10 Jun 2026",
      status: "Pending",
    },
    {
      id: 2,
      owner: "Priya Reddy",
      store: "Fashion Hub",
      email: "fashionhub@gmail.com",
      phone: "+91 9876543211",
      joined: "15 Jun 2026",
      status: "Approved",
    },
    {
      id: 3,
      owner: "Arjun Kumar",
      store: "Home Essentials",
      email: "home@gmail.com",
      phone: "+91 9876543212",
      joined: "18 Jun 2026",
      status: "Rejected",
    },
    {
      id: 4,
      owner: "Sneha Patel",
      store: "Sports Zone",
      email: "sports@gmail.com",
      phone: "+91 9876543213",
      joined: "22 Jun 2026",
      status: "Pending",
    },
    {
      id: 5,
      owner: "Kiran Rao",
      store: "Mobile Mart",
      email: "mobile@gmail.com",
      phone: "+91 9876543214",
      joined: "25 Jun 2026",
      status: "Approved",
    },
  ]);

  const approveVendor = (id) => {
    setVendors((prev) =>
      prev.map((vendor) =>
        vendor.id === id
          ? { ...vendor, status: "Approved" }
          : vendor
      )
    );
  };

  const rejectVendor = (id) => {
    setVendors((prev) =>
      prev.map((vendor) =>
        vendor.id === id
          ? { ...vendor, status: "Rejected" }
          : vendor
      )
    );
  };

  const deleteVendor = (id) => {
    setVendors((prev) =>
      prev.filter((vendor) => vendor.id !== id)
    );
  };

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.store.toLowerCase().includes(search.toLowerCase()) ||
      vendor.owner.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || vendor.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <div className="min-h-screen bg-slate-950 text-white p-6">

        {/* Header */}

        <div className="flex items-center gap-3 mb-8">
          <Store className="text-blue-500" size={30} />

          <div>
            <h1 className="text-3xl font-bold">
              Manage Vendors
            </h1>

            <p className="text-slate-400">
              Approve, reject and manage vendors.
            </p>
          </div>
        </div>

        {/* Search & Filter */}

        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 mb-8">
          <div className="grid md:grid-cols-2 gap-4">

            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-4 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search vendor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-11 pr-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            >
              <option>All</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>

          </div>
        </div>
                

        <div className="hidden lg:block bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">

          <table className="w-full">

            <thead className="bg-slate-800">
              <tr className="text-left">
                <th className="p-4">Store</th>
                <th className="p-4">Owner</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Joined</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredVendors.map((vendor) => (

                <tr
                  key={vendor.id}
                  className="border-t border-slate-800 hover:bg-slate-800"
                >

                  <td className="p-4 font-semibold">{vendor.store}</td>
                  <td className="p-4">{vendor.owner}</td>
                  <td className="p-4">{vendor.email}</td>
                  <td className="p-4">{vendor.phone}</td>
                  <td className="p-4">{vendor.joined}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium
                      ${
                        vendor.status === "Approved"
                          ? "bg-green-500/20 text-green-400"
                          : vendor.status === "Pending"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {vendor.status}
                    </span>
                  </td>

                  <td className="p-4">

                    <div className="flex justify-center gap-2">

                      {/* Eye Button */}
                      <button
                        onClick={() => setSelectedVendor(vendor)}
                        className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        onClick={() => approveVendor(vendor.id)}
                        className="bg-green-500 hover:bg-green-600 p-2 rounded-lg"
                      >
                        <CheckCircle size={18} />
                      </button>

                      <button
                        onClick={() => rejectVendor(vendor.id)}
                        className="bg-yellow-500 hover:bg-yellow-600 p-2 rounded-lg"
                      >
                        <XCircle size={18} />
                      </button>

                      <button
                        onClick={() => deleteVendor(vendor.id)}
                        className="bg-red-500 hover:bg-red-600 p-2 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* Mobile Cards */}

        <div className="lg:hidden space-y-5">

          {filteredVendors.map((vendor) => (

            <div
              key={vendor.id}
              className="bg-slate-900 rounded-xl p-5 border border-slate-800"
            >

              <h2 className="text-xl font-semibold">
                {vendor.store}
              </h2>

              <p className="text-slate-400 mb-4">
                Owner: {vendor.owner}
              </p>

              <div className="space-y-3 text-slate-300">

                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-blue-500" />
                  {vendor.email}
                </div>

                <div className="flex items-center gap-2">
                  <Phone size={18} className="text-blue-500" />
                  {vendor.phone}
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays size={18} className="text-blue-500" />
                  {vendor.joined}
                </div>

                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm
                    ${
                      vendor.status === "Approved"
                        ? "bg-green-500/20 text-green-400"
                        : vendor.status === "Pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {vendor.status}
                  </span>
                </div>

              </div>

              <div className="grid grid-cols-4 gap-3 mt-6">

                <button
                  onClick={() => setSelectedVendor(vendor)}
                  className="bg-blue-500 hover:bg-blue-600 py-2 rounded-lg flex justify-center"
                >
                  <Eye size={18} />
                </button>

                <button
                  onClick={() => approveVendor(vendor.id)}
                  className="bg-green-500 hover:bg-green-600 py-2 rounded-lg flex justify-center"
                >
                  <CheckCircle size={18} />
                </button>

                <button
                  onClick={() => rejectVendor(vendor.id)}
                  className="bg-yellow-500 hover:bg-yellow-600 py-2 rounded-lg flex justify-center"
                >
                  <XCircle size={18} />
                </button>

                <button
                  onClick={() => deleteVendor(vendor.id)}
                  className="bg-slate-500 hover:bg-slate-600 py-2 rounded-lg flex justify-center"
                >
                  <Trash2 size={18} />
                </button>

              </div>

            </div>

          ))}

        </div>
                {/* Vendor Details Modal */}

        {selectedVendor && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedVendor(null)}
          >
            <div
              className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedVendor(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl"
              >
                ×
              </button>

              <div className="flex items-center gap-3 mb-6">
                <Store size={32} className="text-blue-500" />

                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedVendor.store}
                  </h2>

                  <p className="text-slate-400">
                    Vendor Details
                  </p>
                </div>
              </div>

              <div className="space-y-4">

                <div>
                  <p className="text-slate-400 text-sm">
                    Owner
                  </p>

                  <p className="font-semibold">
                    {selectedVendor.owner}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm">
                    Email
                  </p>

                  <p>{selectedVendor.email}</p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm">
                    Phone
                  </p>

                  <p>{selectedVendor.phone}</p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm">
                    Joined Date
                  </p>

                  <p>{selectedVendor.joined}</p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm">
                    Status
                  </p>

                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-sm
                    ${
                      selectedVendor.status === "Approved"
                        ? "bg-green-500/20 text-green-400"
                        : selectedVendor.status === "Pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-slate-500/20 text-red-400"
                    }`}
                  >
                    {selectedVendor.status}
                  </span>
                </div>

              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setSelectedVendor(null)}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default ManageVendors;