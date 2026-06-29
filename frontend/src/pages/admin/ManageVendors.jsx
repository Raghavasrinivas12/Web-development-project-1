import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Store, Search, Eye, CheckCircle, XCircle, Trash2, Mail, CalendarDays, ArrowLeft,
} from "lucide-react";

const ManageVendors = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const api = (url, method = "put") =>
    axios({ method, url, headers: { Authorization: `Bearer ${token}` } });

  const fetchVendors = () => {
    axios
      .get("http://localhost:5000/api/stores", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setVendors(res.data.stores))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchVendors() }, []);

  const approveVendor = (id) => {
    api(`http://localhost:5000/api/admin/vendors/${id}/approve`).then(fetchVendors);
  };

  const rejectVendor = (id) => {
    api(`http://localhost:5000/api/admin/vendors/${id}/reject`).then(fetchVendors);
  };

  const deleteVendor = (id) => {
    if (confirm("Delete this vendor?"))
      api(`http://localhost:5000/api/admin/vendors/${id}`, "delete").then(fetchVendors);
  };

  const filteredVendors = vendors.filter((v) => {
    const q = search.toLowerCase();
    return (v.storeName.toLowerCase().includes(q) || (v.ownerId?.username || "").toLowerCase().includes(q)) &&
      (filter === "All" || v.isApproved === filter);
  });

  if (loading)
    return <div className="text-center text-slate-400 py-20">Loading vendors...</div>;

  return (
    <>
      <div className="min-h-screen bg-slate-950 text-white p-6">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate("/admindashboard")} className="p-2 rounded-lg hover:bg-slate-800 transition">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <Store className="text-blue-500" size={30} />
            <div>
              <h1 className="text-3xl font-bold">Manage Vendors</h1>
              <p className="text-slate-400">Approve, reject and manage vendors.</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-4 text-slate-400" />
              <input
                type="text" placeholder="Search vendor..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-11 pr-4 py-3 outline-none focus:border-blue-500"
              />
            </div>
            <select
              value={filter} onChange={(e) => setFilter(e.target.value)}
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
                <th className="p-4">Joined</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map((vendor) => (
                <tr key={vendor._id} className="border-t border-slate-800 hover:bg-slate-800">
                  <td className="p-4 font-semibold">{vendor.storeName}</td>
                  <td className="p-4">{vendor.ownerId?.username || "N/A"}</td>
                  <td className="p-4">{vendor.ownerId?.email || "—"}</td>
                  <td className="p-4">{new Date(vendor.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      vendor.isApproved === "Approved" ? "bg-green-500/20 text-green-400" :
                      vendor.isApproved === "Rejected" ? "bg-red-500/20 text-red-400" :
                      "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {vendor.isApproved || "Pending"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => setSelectedVendor(vendor)} className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg"><Eye size={18} /></button>
                      <button onClick={() => approveVendor(vendor._id)} className="bg-green-500 hover:bg-green-600 p-2 rounded-lg"><CheckCircle size={18} /></button>
                      <button onClick={() => rejectVendor(vendor._id)} className="bg-yellow-500 hover:bg-yellow-600 p-2 rounded-lg"><XCircle size={18} /></button>
                      <button onClick={() => deleteVendor(vendor._id)} className="bg-red-500 hover:bg-red-600 p-2 rounded-lg"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredVendors.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-slate-500">No vendors found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden space-y-5">
          {filteredVendors.map((vendor) => (
            <div key={vendor._id} className="bg-slate-900 rounded-xl p-5 border border-slate-800">
              <h2 className="text-xl font-semibold">{vendor.storeName}</h2>
              <p className="text-slate-400 mb-4">Owner: {vendor.ownerId?.username || "N/A"}</p>
              <div className="space-y-3 text-slate-300">
                <div className="flex items-center gap-2"><Mail size={18} className="text-blue-500" />{vendor.ownerId?.email || "—"}</div>
                <div className="flex items-center gap-2"><CalendarDays size={18} className="text-blue-500" />{new Date(vendor.createdAt).toLocaleDateString()}</div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    vendor.isApproved === "Approved" ? "bg-green-500/20 text-green-400" :
                    vendor.isApproved === "Rejected" ? "bg-red-500/20 text-red-400" :
                    "bg-yellow-500/20 text-yellow-400"
                  }`}>{vendor.isApproved || "Pending"}</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 mt-6">
                <button onClick={() => setSelectedVendor(vendor)} className="bg-blue-500 hover:bg-blue-600 py-2 rounded-lg flex justify-center"><Eye size={18} /></button>
                <button onClick={() => approveVendor(vendor._id)} className="bg-green-500 hover:bg-green-600 py-2 rounded-lg flex justify-center"><CheckCircle size={18} /></button>
                <button onClick={() => rejectVendor(vendor._id)} className="bg-yellow-500 hover:bg-yellow-600 py-2 rounded-lg flex justify-center"><XCircle size={18} /></button>
                <button onClick={() => deleteVendor(vendor._id)} className="bg-red-500 hover:bg-red-600 py-2 rounded-lg flex justify-center"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>

        {selectedVendor && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedVendor(null)}>
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelectedVendor(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl">&times;</button>
              <div className="flex items-center gap-3 mb-6">
                <Store size={32} className="text-blue-500" />
                <div>
                  <h2 className="text-2xl font-bold">{selectedVendor.storeName}</h2>
                  <p className="text-slate-400">Vendor Details</p>
                </div>
              </div>
              <div className="space-y-4">
                <div><p className="text-slate-400 text-sm">Owner</p><p className="font-semibold">{selectedVendor.ownerId?.username || "N/A"}</p></div>
                <div><p className="text-slate-400 text-sm">Email</p><p>{selectedVendor.ownerId?.email || "—"}</p></div>
                <div><p className="text-slate-400 text-sm">Joined</p><p>{new Date(selectedVendor.createdAt).toLocaleDateString()}</p></div>
                <div>
                  <p className="text-slate-400 text-sm">Status</p>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm ${
                    selectedVendor.isApproved === "Approved" ? "bg-green-500/20 text-green-400" :
                    selectedVendor.isApproved === "Rejected" ? "bg-red-500/20 text-red-400" :
                    "bg-yellow-500/20 text-yellow-400"
                  }`}>{selectedVendor.isApproved || "Pending"}</span>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button onClick={() => setSelectedVendor(null)} className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageVendors;
