import React from 'react';

const VendorDashboard = () => {
  const rawRevenue = 45230;
  
  const stats = [
    { title: "Total Revenue", value: `₹${rawRevenue.toLocaleString('en-IN')}`, change: "+12.5% vs last week", color: "text-emerald-400" },
    { title: "Active Listings", value: "18 Items", change: "In stock and live", color: "text-rose-500" },
    { title: "Pending Orders", value: "4 Orders", change: "Requires dispatch action", color: "text-amber-400" },
  ];

  const pendingActions = [
    { id: "act-01", msg: "Order #ZN-9021 requires confirmation", sub: "Midnight Velvet Sherwani × 2", tag: "Pending", style: "bg-amber-500/10 text-amber-400 border border-amber-500/20" }, // Matched schema status
    { id: "act-02", msg: "Low Inventory Alert", sub: "Crimson Silk Kurta (Stock remaining: 2)", tag: "Low Stock", style: "bg-rose-500/10 text-rose-400 border border-rose-500/20" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Overview Console</h1>
        <p className="text-slate-400 mt-1">Track your marketplace analytics and operational health data metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-2xl hover:border-slate-700 transition-all duration-200">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.title}</h3>
            <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
            <span className="text-xs text-slate-400 mt-1 block">{stat.change}</span>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Immediate Actions Required</h2>
        <div className="divide-y divide-slate-800">
          {pendingActions.map((action) => (
            <div key={action.id} className="py-4 flex justify-between items-center hover:bg-slate-800/10 transition-colors">
              <div>
                <p className="text-sm font-semibold text-slate-200">{action.msg}</p>
                <p className="text-xs text-slate-500 mt-0.5">{action.sub}</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${action.style}`}>
                {action.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;