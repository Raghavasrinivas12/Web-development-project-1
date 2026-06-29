import {
  Users,
  Store,
  Package,
  ShoppingCart,
  IndianRupee,
  TrendingUp,
  ClipboardList,
  PlusCircle,
  ShieldCheck,
  Activity,
} from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "1,250",
      icon: <Users size={28} />,
      color: "text-blue-500",
    },
    {
      title: "Total Vendors",
      value: "85",
      icon: <Store size={28} />,
      color: "text-green-500",
    },
    {
      title: "Total Products",
      value: "3,450",
      icon: <Package size={28} />,
      color: "text-yellow-500",
    },
    {
      title: "Total Orders",
      value: "890",
      icon: <ShoppingCart size={28} />,
      color: "text-pink-500",
    },
    {
      title: "Revenue",
      value: "₹4,85,000",
      icon: <IndianRupee size={28} />,
      color: "text-emerald-500",
    },
    {
      title: "Monthly Growth",
      value: "+18%",
      icon: <TrendingUp size={28} />,
      color: "text-cyan-500",
    },
  ];

  const quickActions = [
    {
      title: "Add Category",
      icon: <PlusCircle size={22} />,
    },
    {
      title: "Manage Users",
      icon: <Users size={22} />,
    },
    {
      title: "Approve Vendors",
      icon: <ShieldCheck size={22} />,
    },
    {
      title: "View Orders",
      icon: <ClipboardList size={22} />,
    },
  ];

  const activities = [
    "New vendor 'Tech World' registered.",
    "25 new orders received today.",
    "Admin approved 3 vendors.",
    "10 products added today.",
    "Revenue increased by 18% this month.",
  ];

  return (
    <div className="space-y-8">

      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Dashboard
          </h1>

          <p className="text-slate-400 mt-1">
            Welcome back, Admin 👋
          </p>
        </div>

        <button className="bg-blue-500 hover:bg-blue-600 px-5 py-3 rounded-lg font-medium">
          Generate Report
        </button>

      </div>

      {/* Statistics Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

        {stats.map((item, index) => (

          <div
            key={index}
            className="bg-slate-900 rounded-xl p-6 border border-slate-800 hover:border-blue-500 transition"
          >

            <div className="flex justify-between items-center">

              <div>

                <p className="text-slate-400">
                  {item.title}
                </p>

                <h2 className="text-3xl font-bold mt-2 text-white">
                  {item.value}
                </h2>

              </div>

              <div className={item.color}>
                {item.icon}
              </div>

            </div>

          </div>

        ))}

      </div>

      {/* Quick Actions */}

      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">

        <h2 className="text-2xl font-semibold mb-6">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

          {quickActions.map((action, index) => (

            <button
              key={index}
              className="bg-slate-800 hover:bg-blue-500 transition rounded-xl p-5 flex flex-col items-center gap-3"
            >

              {action.icon}

              <span className="text-sm">
                {action.title}
              </span>

            </button>

          ))}

        </div>

      </div>

      {/* Recent Activities */}

      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">

        <div className="flex items-center gap-3 mb-6">

          <Activity className="text-blue-500" />

          <h2 className="text-2xl font-semibold">
            Recent Activities
          </h2>

        </div>

        <div className="space-y-4">

          {activities.map((activity, index) => (

            <div
              key={index}
              className="bg-slate-800 rounded-lg p-4 flex items-center gap-3"
            >

              <div className="w-3 h-3 rounded-full bg-blue-500"></div>

              <p className="text-slate-200">
                {activity}
              </p>

            </div>

          ))}

        </div>

      </div>

     {/* Recent Orders */}

      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">

        <h2 className="text-2xl font-semibold mb-6">
          Recent Orders
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-slate-700 text-left">

                <th className="py-3">Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>

              </tr>

            </thead>

            <tbody>

              <tr className="border-b border-slate-800 hover:bg-slate-800">

                <td className="py-4">#ORD1001</td>
                <td>Rahul</td>
                <td>₹2,499</td>

                <td>

                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                    Delivered
                  </span>

                </td>

              </tr>

              <tr className="border-b border-slate-800 hover:bg-slate-800">

                <td className="py-4">#ORD1002</td>
                <td>Priya</td>
                <td>₹1,299</td>

                <td>

                  <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                    Shipped
                  </span>

                </td>

              </tr>

              <tr className="border-b border-slate-800 hover:bg-slate-800">

                <td className="py-4">#ORD1003</td>
                <td>Arjun</td>
                <td>₹3,999</td>

                <td>

                  <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
                    Processing
                  </span>

                </td>

              </tr>

              <tr className="hover:bg-slate-800">

                <td className="py-4">#ORD1004</td>
                <td>Sneha</td>
                <td>₹899</td>

                <td>

                  <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">
                    Pending
                  </span>

                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>

      {/* Bottom Cards */}

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Top Vendors */}

        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">

          <h2 className="text-2xl font-semibold mb-5">
            Top Vendors
          </h2>

          <div className="space-y-4">

            <div className="bg-slate-800 rounded-lg p-4 flex justify-between">

              <div>

                <h3 className="font-semibold">
                  Tech World
                </h3>

                <p className="text-slate-400 text-sm">
                  120 Products
                </p>

              </div>

              <span className="text-blue-500 font-semibold">
                ₹1,25,000
              </span>

            </div>

            <div className="bg-slate-800 rounded-lg p-4 flex justify-between">

              <div>

                <h3 className="font-semibold">
                  Fashion Hub
                </h3>

                <p className="text-slate-400 text-sm">
                  98 Products
                </p>

              </div>

              <span className="text-blue-500 font-semibold">
                ₹98,500
              </span>

            </div>

            <div className="bg-slate-800 rounded-lg p-4 flex justify-between">

              <div>

                <h3 className="font-semibold">
                  Home Essentials
                </h3>

                <p className="text-slate-400 text-sm">
                  80 Products
                </p>

              </div>

              <span className="text-blue-500 font-semibold">
                ₹82,300
              </span>

            </div>

          </div>

        </div>

        {/* Sales Overview */}

        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">

          <h2 className="text-2xl font-semibold mb-5">
            Sales Overview
          </h2>

          <div className="grid grid-cols-2 gap-4">

            <div className="bg-slate-800 rounded-lg p-5">

              <p className="text-slate-400">
                Today
              </p>

              <h3 className="text-2xl font-bold text-green-400 mt-2">
                ₹15,200
              </h3>

            </div>

            <div className="bg-slate-800 rounded-lg p-5">

              <p className="text-slate-400">
                This Week
              </p>

              <h3 className="text-2xl font-bold text-blue-400 mt-2">
                ₹92,800
              </h3>

            </div>

            <div className="bg-slate-800 rounded-lg p-5">

              <p className="text-slate-400">
                This Month
              </p>

              <h3 className="text-2xl font-bold text-yellow-400 mt-2">
                ₹4,85,000
              </h3>

            </div>

            <div className="bg-slate-800 rounded-lg p-5">

              <p className="text-slate-400">
                Total Revenue
              </p>

              <h3 className="text-2xl font-bold text-cyan-400 mt-2">
                ₹18,25,000
              </h3>

            </div>

          </div>

        </div>

      </div>

      {/* Footer */}

      <div className="text-center text-slate-500 pt-8 border-t border-slate-800">

        © 2026 ShopHub Admin Dashboard. All Rights Reserved.

      </div>

    </div>
  );
};

export default AdminDashboard;