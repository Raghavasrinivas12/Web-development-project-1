import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Search, Eye, Trash2, Ban, CheckCircle, Users, Mail, Phone, CalendarDays, ArrowLeft,
} from "lucide-react";

const ManageUsers = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const api = (url, data) =>
    axios({ method: data ? "put" : "delete", url, data, headers: { Authorization: `Bearer ${token}` } });

  const fetchUsers = () => {
    axios
      .get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data.users))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers() }, []);

  const toggleStatus = (id) => {
    api(`http://localhost:5000/api/admin/users/${id}/toggle-status`).then(fetchUsers);
  };

  const deleteUser = (id) => {
    if (confirm("Delete this user?"))
      api(`http://localhost:5000/api/admin/users/${id}`).then(fetchUsers);
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
      (filter === "All" || (filter === "Active" ? u.isActive !== false : u.isActive === false));
  });

  if (loading)
    return <div className="text-center text-slate-400 py-20">Loading users...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate("/admindashboard")} className="p-2 rounded-lg hover:bg-slate-800 transition">
          <ArrowLeft size={24} />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <Users className="text-blue-500" />
            <h1 className="text-3xl font-bold">Manage Users</h1>
          </div>
          <p className="text-slate-400 mt-2">View, search and manage all registered users.</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-4 text-slate-400" />
            <input
              type="text" placeholder="Search by name or email..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-11 pr-4 py-3 outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={filter} onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
          >
            <option>All</option>
            <option>Active</option>
            <option>Blocked</option>
          </select>
        </div>
      </div>

      <div className="hidden lg:block bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr className="text-left">
              <th className="p-4">User</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-t border-slate-800 hover:bg-slate-800">
                <td className="p-4 font-medium">{user.username}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4 capitalize">{user.role}</td>
                <td className="p-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.isActive !== false ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  }`}>
                    {user.isActive !== false ? "Active" : "Blocked"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => setSelectedUser(user)} className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg">
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => toggleStatus(user._id)}
                      className={`p-2 rounded-lg ${user.isActive !== false ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"}`}
                    >
                      {user.isActive !== false ? <Ban size={18} /> : <CheckCircle size={18} />}
                    </button>
                    <button onClick={() => deleteUser(user._id)} className="bg-red-500 hover:bg-red-600 p-2 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr><td colSpan={6} className="py-8 text-center text-slate-500">No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden space-y-5">
        {filteredUsers.map((user) => (
          <div key={user._id} className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <h2 className="text-xl font-semibold mb-4">{user.username}</h2>
            <div className="space-y-3 text-slate-300">
              <div className="flex items-center gap-2"><Mail size={18} className="text-blue-500" />{user.email}</div>
              <div className="flex items-center gap-2"><Users size={18} className="text-blue-500" />{user.role}</div>
              <div className="flex items-center gap-2"><CalendarDays size={18} className="text-blue-500" />{new Date(user.createdAt).toLocaleDateString()}</div>
              <div>
                <span className={`px-3 py-1 rounded-full text-sm ${user.isActive !== false ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                  {user.isActive !== false ? "Active" : "Blocked"}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-6">
              <button onClick={() => setSelectedUser(user)} className="bg-blue-500 hover:bg-blue-600 py-2 rounded-lg flex justify-center"><Eye size={18} /></button>
              <button onClick={() => toggleStatus(user._id)} className={`py-2 rounded-lg flex justify-center ${user.isActive !== false ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"}`}>
                {user.isActive !== false ? <Ban size={18} /> : <CheckCircle size={18} />}
              </button>
              <button onClick={() => deleteUser(user._id)} className="bg-red-500 hover:bg-red-600 py-2 rounded-lg flex justify-center"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 w-full max-w-2xl rounded-xl border border-slate-700 p-6 relative">
            <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 text-2xl text-slate-400 hover:text-white">&times;</button>
            <h2 className="text-3xl font-bold text-blue-500 mb-6">User Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div><p className="text-slate-400 text-sm">Full Name</p><p className="font-semibold text-lg">{selectedUser.username}</p></div>
              <div><p className="text-slate-400 text-sm">Status</p>
                <span className={`px-3 py-1 rounded-full text-sm ${selectedUser.isActive !== false ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                  {selectedUser.isActive !== false ? "Active" : "Blocked"}
                </span>
              </div>
              <div><p className="text-slate-400 text-sm">Email</p><p>{selectedUser.email}</p></div>
              <div><p className="text-slate-400 text-sm">Role</p><p className="capitalize">{selectedUser.role}</p></div>
              <div><p className="text-slate-400 text-sm">Phone</p><p>{selectedUser.phone || "—"}</p></div>
              <div><p className="text-slate-400 text-sm">Joined</p><p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p></div>
            </div>
            <div className="flex justify-end mt-8">
              <button onClick={() => setSelectedUser(null)} className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
