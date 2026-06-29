import { useState } from "react";
import {
  Search,
  Eye,
  Trash2,
  Ban,
  CheckCircle,
  Users,
  Mail,
  Phone,
  CalendarDays,
} from "lucide-react";

const ManageUsers = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedUser,setSelectedUser]=useState(null);
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      phone: "+91 9876543210",
      joined: "20 Jun 2026",
      status: "Active",
    },
    {
      id: 2,
      name: "Priya Reddy",
      email: "priya@gmail.com",
      phone: "+91 9876543211",
      joined: "18 Jun 2026",
      status: "Blocked",
    },
    {
      id: 3,
      name: "Arjun Kumar",
      email: "arjun@gmail.com",
      phone: "+91 9876543212",
      joined: "15 Jun 2026",
      status: "Active",
    },
    {
      id: 4,
      name: "Sneha Patel",
      email: "sneha@gmail.com",
      phone: "+91 9876543213",
      joined: "12 Jun 2026",
      status: "Active",
    },
    {
      id: 5,
      name: "Kiran Rao",
      email: "kiran@gmail.com",
      phone: "+91 9876543214",
      joined: "08 Jun 2026",
      status: "Blocked",
    },
  ]);

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              status:
                user.status === "Active"
                  ? "Blocked"
                  : "Active",
            }
          : user
      )
    );
  };

  const deleteUser = (id) => {
    setUsers((prev) =>
      prev.filter((user) => user.id !== id)
    );
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || user.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

        <div>

          <div className="flex items-center gap-3">

            <Users className="text-blue-500" />

            <h1 className="text-3xl font-bold">
              Manage Users
            </h1>

          </div>

          <p className="text-slate-400 mt-2">
            View, search and manage all registered users.
          </p>

        </div>

      </div>

      {/* Search & Filter */}

      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 mb-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-4 top-4 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search by name or email..."
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
            <option>Active</option>
            <option>Blocked</option>
          </select>

        </div>

      </div>

      {/* Desktop Table */}

      <div className="hidden lg:block bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-800">

            <tr className="text-left">

              <th className="p-4">User</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredUsers.map((user) => (

              <tr
                key={user.id}
                className="border-t border-slate-800 hover:bg-slate-800"
              >

                <td className="p-4 font-medium">
                  {user.name}
                </td>

                <td className="p-4">
                  {user.email}
                </td>

                <td className="p-4">
                  {user.phone}
                </td>

                <td className="p-4">
                  {user.joined}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.status === "Active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {user.status}
                  </span>

                </td>

                <td className="p-4">

                  <div className="flex justify-center gap-2">

                    <button onClick={()=>setSelectedUser(user)} className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg">
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => toggleStatus(user.id)}
                      className={`p-2 rounded-lg ${
                        user.status === "Active"
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {user.status === "Active" ? (
                        <Ban size={18} />
                      ) : (
                        <CheckCircle size={18} />
                      )}
                    </button>

                    <button
                      onClick={() => deleteUser(user.id)}
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

        {filteredUsers.map((user) => (

          <div
            key={user.id}
            className="bg-slate-900 rounded-xl p-5 border border-slate-800"
          >

            <h2 className="text-xl font-semibold mb-4">
              {user.name}
            </h2>

            <div className="space-y-3 text-slate-300">

              <div className="flex items-center gap-2">
                <Mail size={18} className="text-blue-500" />
                {user.email}
              </div>

              <div className="flex items-center gap-2">
                <Phone size={18} className="text-blue-500" />
                {user.phone}
              </div>

              <div className="flex items-center gap-2">
                <CalendarDays size={18} className="text-blue-500" />
                {user.joined}
              </div>

              <div>

                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    user.status === "Active"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {user.status}
                </span>

              </div>

            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">

              <button onClick={()=>setSelectedUser(user)} className="bg-blue-500 hover:bg-blue-600 py-2 rounded-lg flex justify-center">
                <Eye size={18} />
              </button>

              <button
                onClick={() => toggleStatus(user.id)}
                className={`py-2 rounded-lg flex justify-center ${
                  user.status === "Active"
                    ? "bg-slate-200 hover:bg-slate-200 text-slate-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {user.status === "Active" ? (
                  <Ban size={18} />
                ) : (
                  <CheckCircle size={18} />
                )}
              </button>

              <button
                onClick={() => deleteUser(user.id)}
                className="bg-slate-500 hover:bg-slate-600 py-2 rounded-lg flex justify-center"
              >
                <Trash2 size={18} />
              </button>

            </div>

          </div>

        ))}

      </div>
      {/* User Details Modal */}

{selectedUser && (

<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">

<div className="bg-slate-900 w-full max-w-2xl rounded-xl border border-slate-700 p-6 relative">

<button
onClick={() => setSelectedUser(null)}
className="absolute top-4 right-4 text-2xl text-slate-400 hover:text-white"
>
×
</button>

<h2 className="text-3xl font-bold text-blue-500 mb-6">
User Details
</h2>

<div className="grid md:grid-cols-2 gap-6">

<div>
<p className="text-slate-400 text-sm">
Full Name
</p>

<p className="font-semibold text-lg">
{selectedUser.name}
</p>
</div>

<div>
<p className="text-slate-400 text-sm">
Status
</p>

<span
className={`px-3 py-1 rounded-full text-sm ${
selectedUser.status === "Active"
? "bg-green-500/20 text-green-400"
: "bg-red-500/20 text-red-400"
}`}
>
{selectedUser.status}
</span>

</div>
<div>
<p className="text-slate-400 text-sm">
Wishlist Items
</p>

<p>
8 Items
</p>
</div>

<div>
<p className="text-slate-400 text-sm">
Cart Items
</p>

<p>
2 Items
</p>
</div>

</div>

<div className="flex justify-end mt-8">

<button
onClick={() => setSelectedUser(null)}
className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg"
>
Close
</button>

</div>

</div>

</div>

)}

    </div>
  );
};

export default ManageUsers;