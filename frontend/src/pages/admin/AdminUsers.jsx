import { useState, useEffect } from "react";
import axios from "axios";
import {
  Search, Eye, Trash2, Ban, CheckCircle, Users, Mail, Phone, CalendarDays,
} from "lucide-react";
import API_URL from "../../config";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data.users))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers() }, []);

  const toggleStatus = (id) => {
    const token = localStorage.getItem("token");
    axios
      .put(`${API_URL}/api/admin/users/${id}/toggle-status`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => fetchUsers())
      .catch(console.error);
  };

  const deleteUser = (id) => {
    if (!window.confirm("Delete this user?")) return;
    const token = localStorage.getItem("token");
    axios
      .delete(`${API_URL}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => fetchUsers())
      .catch(console.error);
  };

  const filtered = users.filter((u) => {
    const matchSearch = u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" ||
      (filter === "Active" && u.isActive) ||
      (filter === "Blocked" && !u.isActive);
    return matchSearch && matchFilter;
  });

  if (loading) return <div className="text-center text-slate-400 py-20 text-base">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="text-blue-500" size={28} />
        <div>
          <h1 className="text-3xl font-bold">Manage Users</h1>
          <p className="text-slate-400 mt-1">View, search and manage all registered users.</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
            <input type="text" placeholder="Search by name or email..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-11 pr-4 py-3 text-sm outline-none focus:border-blue-500" />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500">
            <option>All</option><option>Active</option><option>Blocked</option>
          </select>
        </div>
      </div>

      <div className="hidden lg:block bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr className="text-left text-sm">
              <th className="p-4">User</th><th className="p-4">Email</th><th className="p-4">Phone</th>
              <th className="p-4">Joined</th><th className="p-4">Status</th><th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u._id} className="border-t border-slate-800 hover:bg-slate-800 text-sm">
                <td className="p-4 font-medium">{u.username}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4">{u.phone || "-"}</td>
                <td className="p-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    u.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  }`}>{u.isActive ? "Active" : "Blocked"}</span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => setSelectedUser(u)} className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg"><Eye size={18} /></button>
                    <button onClick={() => toggleStatus(u._id)}
                      className={`p-2 rounded-lg ${u.isActive ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"}`}>
                      {u.isActive ? <Ban size={18} /> : <CheckCircle size={18} />}
                    </button>
                    <button onClick={() => deleteUser(u._id)} className="bg-red-500 hover:bg-red-600 p-2 rounded-lg"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden space-y-4">
        {filtered.map((u) => (
          <div key={u._id} className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <h2 className="text-xl font-semibold mb-4">{u.username}</h2>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-2"><Mail size={18} className="text-blue-500" />{u.email}</div>
              <div className="flex items-center gap-2"><Phone size={18} className="text-blue-500" />{u.phone || "-"}</div>
              <div className="flex items-center gap-2"><CalendarDays size={18} className="text-blue-500" />{new Date(u.createdAt).toLocaleDateString()}</div>
              <div><span className={`px-3 py-1 rounded-full text-sm ${u.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{u.isActive ? "Active" : "Blocked"}</span></div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-6">
              <button onClick={() => setSelectedUser(u)} className="bg-blue-500 hover:bg-blue-600 py-2 rounded-lg flex justify-center"><Eye size={18} /></button>
              <button onClick={() => toggleStatus(u._id)} className={`py-2 rounded-lg flex justify-center ${u.isActive ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"}`}>
                {u.isActive ? <Ban size={18} /> : <CheckCircle size={18} />}
              </button>
              <button onClick={() => deleteUser(u._id)} className="bg-red-500 hover:bg-red-600 py-2 rounded-lg flex justify-center"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedUser(null)}>
          <div className="bg-slate-900 w-full max-w-lg rounded-xl border border-slate-700 p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 text-2xl text-slate-400 hover:text-white">&times;</button>
            <h2 className="text-2xl font-bold text-blue-500 mb-6">User Details</h2>
            <div className="grid md:grid-cols-2 gap-5 text-sm">
              <div><p className="text-slate-400 text-sm">Name</p><p className="font-semibold text-lg">{selectedUser.username}</p></div>
              <div><p className="text-slate-400 text-sm">Email</p><p>{selectedUser.email}</p></div>
              <div><p className="text-slate-400 text-sm">Phone</p><p>{selectedUser.phone || "-"}</p></div>
              <div><p className="text-slate-400 text-sm">Role</p><p className="capitalize">{selectedUser.role}</p></div>
              <div><p className="text-slate-400 text-sm">Status</p>
                <span className={`px-3 py-1 rounded-full text-sm ${selectedUser.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                  {selectedUser.isActive ? "Active" : "Blocked"}
                </span>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => setSelectedUser(null)} className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
