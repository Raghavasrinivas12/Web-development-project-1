import { useState, useEffect } from "react";
import axios from "axios";
import {
  Store, Search, Eye, CheckCircle, XCircle, Trash2, Mail, CalendarDays,
} from "lucide-react";

const ManageVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedVendor, setSelectedVendor] = useState(null);

  const fetchVendors = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/admin/vendors", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setVendors(res.data.vendors))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchVendors() }, []);

  const approveVendor = (id) => {
    const token = localStorage.getItem("token");
    axios.put(`http://localhost:5000/api/admin/vendors/${id}/approve`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => fetchVendors()).catch(console.error);
  };

  const rejectVendor = (id) => {
    const token = localStorage.getItem("token");
    axios.put(`http://localhost:5000/api/admin/vendors/${id}/reject`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => fetchVendors()).catch(console.error);
  };

  const deleteVendor = (id) => {
    if (!window.confirm("Delete this vendor?")) return;
    const token = localStorage.getItem("token");
    axios.delete(`http://localhost:5000/api/admin/vendors/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => fetchVendors()).catch(console.error);
  };

  const filtered = vendors.filter((v) => {
    const s = v.storeName?.toLowerCase().includes(search.toLowerCase()) ||
      v.ownerId?.username?.toLowerCase().includes(search.toLowerCase());
    const f = filter === "All" || v.isApproved === filter;
    return s && f;
  });

  if (loading) return <div className="text-center text-slate-400 py-20 text-base">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Store className="text-blue-500" size={28} />
        <div>
          <h1 className="text-3xl font-bold">Manage Vendors</h1>
          <p className="text-slate-400 mt-1">Approve, reject and manage vendors.</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
            <input type="text" placeholder="Search vendor..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-11 pr-4 py-3 text-sm outline-none focus:border-blue-500" />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500">
            <option>All</option><option>Pending</option><option>Approved</option><option>Rejected</option>
          </select>
        </div>
      </div>

      <div className="hidden lg:block bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr className="text-left text-sm">
              <th className="p-4">Store</th><th className="p-4">Owner</th><th className="p-4">Email</th>
              <th className="p-4">Joined</th><th className="p-4">Status</th><th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr key={v._id} className="border-t border-slate-800 hover:bg-slate-800 text-sm">
                <td className="p-4 font-semibold">{v.storeName}</td>
                <td className="p-4">{v.ownerId?.username || "-"}</td>
                <td className="p-4">{v.ownerId?.email || "-"}</td>
                <td className="p-4">{new Date(v.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    v.isApproved === "Approved" ? "bg-green-500/20 text-green-400" :
                    v.isApproved === "Pending" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-red-500/20 text-red-400"
                  }`}>{v.isApproved}</span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => setSelectedVendor(v)} className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg"><Eye size={18} /></button>
                    <button onClick={() => approveVendor(v._id)} className="bg-green-500 hover:bg-green-600 p-2 rounded-lg"><CheckCircle size={18} /></button>
                    <button onClick={() => rejectVendor(v._id)} className="bg-yellow-500 hover:bg-yellow-600 p-2 rounded-lg"><XCircle size={18} /></button>
                    <button onClick={() => deleteVendor(v._id)} className="bg-red-500 hover:bg-red-600 p-2 rounded-lg"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden space-y-4">
        {filtered.map((v) => (
          <div key={v._id} className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <h2 className="text-xl font-semibold">{v.storeName}</h2>
            <p className="text-slate-400 mt-1 mb-4">Owner: {v.ownerId?.username || "-"}</p>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-2"><Mail size={18} className="text-blue-500" />{v.ownerId?.email || "-"}</div>
              <div className="flex items-center gap-2"><CalendarDays size={18} className="text-blue-500" />{new Date(v.createdAt).toLocaleDateString()}</div>
              <div><span className={`px-3 py-1 rounded-full text-sm ${
                v.isApproved === "Approved" ? "bg-green-500/20 text-green-400" :
                v.isApproved === "Pending" ? "bg-yellow-500/20 text-yellow-400" :
                "bg-red-500/20 text-red-400"
              }`}>{v.isApproved}</span></div>
            </div>
            <div className="grid grid-cols-4 gap-3 mt-6">
              <button onClick={() => setSelectedVendor(v)} className="bg-blue-500 hover:bg-blue-600 py-2 rounded-lg flex justify-center"><Eye size={18} /></button>
              <button onClick={() => approveVendor(v._id)} className="bg-green-500 hover:bg-green-600 py-2 rounded-lg flex justify-center"><CheckCircle size={18} /></button>
              <button onClick={() => rejectVendor(v._id)} className="bg-yellow-500 hover:bg-yellow-600 py-2 rounded-lg flex justify-center"><XCircle size={18} /></button>
              <button onClick={() => deleteVendor(v._id)} className="bg-red-500 hover:bg-red-600 py-2 rounded-lg flex justify-center"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {selectedVendor && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedVendor(null)}>
          <div className="bg-slate-900 w-full max-w-lg rounded-xl border border-slate-700 p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedVendor(null)} className="absolute top-4 right-4 text-2xl text-slate-400 hover:text-white">&times;</button>
            <div className="flex items-center gap-3 mb-5">
              <Store size={32} className="text-blue-500" />
              <div>
                <h2 className="text-2xl font-bold">{selectedVendor.storeName}</h2>
                <p className="text-slate-400 text-sm">Vendor Details</p>
              </div>
            </div>
            <div className="space-y-4 text-sm">
              <div><p className="text-slate-400 text-sm">Owner</p><p className="font-semibold text-lg">{selectedVendor.ownerId?.username || "-"}</p></div>
              <div><p className="text-slate-400 text-sm">Email</p><p>{selectedVendor.ownerId?.email || "-"}</p></div>
              <div><p className="text-slate-400 text-sm">Joined</p><p>{new Date(selectedVendor.createdAt).toLocaleDateString()}</p></div>
              <div><p className="text-slate-400 text-sm">Status</p>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm ${
                  selectedVendor.isApproved === "Approved" ? "bg-green-500/20 text-green-400" :
                  selectedVendor.isApproved === "Pending" ? "bg-yellow-500/20 text-yellow-400" :
                  "bg-red-500/20 text-red-400"
                }`}>{selectedVendor.isApproved}</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelectedVendor(null)} className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageVendors;
