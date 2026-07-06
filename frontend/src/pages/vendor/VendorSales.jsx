import {
    IndianRupee,
    ShoppingCart,
    TrendingUp,
    Wallet,
    Download,

} from "lucide-react";


import{
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    BarChart,
    Bar,
    Legend,
} from "recharts";

const VendorSales = () =>{
    const stats=[
        {
            title:"Total Revenue",
            value:"₹12,45,800",
            icon: IndianRupee,
            color: "text-green-500"
        },
        {
            title:"Total Orders",
            value:"₹1,245",
            icon: ShoppingCart,
            color: "text-blue-500"
        },
        {
            title:"Monthly Sales",
            value:"₹2,18,500",
            icon: TrendingUp,
            color: "text-purple-500"
        },
        {
            title:"Available Balance",
            value:"₹1,245",
            icon: Wallet,
            color: "text-yellow-500"
        },

    ];
    const revenueData=[
        { month:"Jan", revenue:85000 },
        { month:"Feb", revenue:110000 },
        { month:"Mar", revenue:98000 },
        { month:"Apr", revenue:135000 },
        { month:"May", revenue:168000 },
        { month:"Jun", revenue:210000 },
        { month:"Jul", revenue:185000 },
    ]
     const monthlySalesData=[
        { month:"Jan", sales:120 },
        { month:"Feb", sales:150 },
        { month:"Mar", sales:132 },
        { month:"Apr", sales:175 },
        { month:"May", sales:210 },
        { month:"Jun", sales:260 },
        { month:"Jul", sales:225 },
    ]
    const topProducts=[
        {
            id:1,
            name:"Wireless Mouse",
            category:"Accessories",
            sold:245,
            revenue:"₹2,45,000",
            stock:42,
        },
        {
            id:2,
            name:"Gaming keyboard",
            category:"Accessories",
            sold:186,
            revenue:"₹3,72,000",
            stock:18,
        },
        {
            id:3,
            name:"Laptop Stand",
            category:"Office",
            sold:154,
            revenue:"₹1,84,000",
            stock:36,
        },
        {
            id:4,
            name:"USB Hub",
            category:"Electronics",
            sold:132,
            revenue:"₹1,32,000",
            stock:64,
        },
    ]
    const transactions=[
        {
            id:"TXN1001",
            customer:"Rahul Sharma",
            amount:"₹2,500",
            payment:"UPI",
            date:"04 Jul 2026",
        },
         {
            id:"TXN1002",
            customer:"Rahul Sharma",
            amount:"₹2,500",
            payment:"Cash on Delivery",
            date:"01 Jul 2026",
        },
         {
            id:"TXN1003",
            customer:"Priya Singh",
            amount:"₹5,200",
            payment:"Card",
            date:"03 Jul 2026",
        },
         {
            id:"TXN1004",
            customer:"Arjun Patel",
            amount:"₹1,800",
            payment:"Net Banking",
            date:"02 Jul 2026",
        },
    ]
    return(
        <div className="min-h-screen bg-slate-950 text-white p-6">
            
            {/*Header*/}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Sales & Earnings</h1>
                <p className="text-slate-400 mt-2">Monitor your revenue,sales performance and earnings.</p>

            </div>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                {stats.map((item,index)=>{
                    const Icon=item.icon;
                    return(
                        <div key={index} className="bg-slate-900 border border-slate-800 rounded-xl  p-6 hover:border-blue-500 transition">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-slate-400 text-sm">{item.title}</p>
                                    <h2 className="text-3xl font-bold mt-3">{item.value}</h2>
                                </div>
                                <div className="bg-slate-800 p-4 rounded-full">
                                    <Icon className={item.color} size={30}/>
                                </div>
                                </div>
                                </div>

                    );
                })}
            </div>
            {/* Revenue Chart Starts Here */}
            {/*Revenue Trend */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    
                        <div>
                            <h2 className="text-xl font-semibold">Revenue Trend</h2>
                            <p className="text-slate-400 text-sm">Monthly revenue performance</p>
                        </div>
                        <div className="flex gap-3">
                            <select className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2">
                                <option value="">2026</option>
                                <option value="">2025</option>
                            </select>
                            <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg flex-items-center gap-2">
                                <Download size={18} /> Export
                            </button>
                        </div>

                    </div>
                    

                
                <div style={{width:"100%",height:350}}>
                    <ResponsiveContainer>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155"/>
                            <XAxis dataKey="month" stroke="#94a3b8"/>
                            <YAxis stroke="#94a3b8" width={70}/>
                            <Tooltip/>
                            <Line type="monotone" dataKey="revenue" stroke="#3b82f6"/>
                        </LineChart>
                    </ResponsiveContainer>

                </div>
                </div>
                {/*Monthly Sales */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold">Monthly Sales</h2>
                        <p className="text-slate-400 text-sm">Number of orders sold every month</p>

                    </div>
                    <div style={{width:"100%",height:350}}>
                        <ResponsiveContainer>
                            <BarChart data={monthlySalesData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155"/>
                                <XAxis dataKey="month" stroke="#94a3b8"/>
                                <YAxis stroke="#94a3b8" width={70}/>
                                <Tooltip/>
                                <Legend/>
                                <Bar dataKey="sales" fill="#3b82f6" radius={[8,8,0,0]}/>


                            </BarChart>
                        </ResponsiveContainer>

                    </div>
                </div>
                {/*Top Selling Products Starts Here */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-semibold">Top Selling Products</h2>
                            <p>Best performing products this month</p>
                        </div>

                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-800">
                                    <th className="text-left py-4">Product</th>
                                    <th className="text-left py-4">Category</th>
                                    <th className="text-center py-4">Units Sold</th>
                                    <th className="text-center py-4">Revenue</th>
                                    <th className="text-center py-4">Stock Left</th>

                                </tr>
                            </thead>
                            <tbody>
                                {topProducts.map((product)=>(
                                    <tr key={product.id} className="border-b border-slate-800 hover:bg-slate-800 transition">
                                        <td className="py-4 font-medium">{product.name}</td>
                                        <td className="py-4 text-slate-300">{product.category}</td>
                                        <td className="text-center py-4">{product.sold}</td>
                                        <td className="text-center py-4 text-green font-semibold">{product.revenue}</td>
                                        <td className="text-center py-4"><span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">{product.stock}</span></td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>

                    </div>

            </div>

            {/*Recent Transactions */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-semibold mb-6">Recent Transactions</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-800">
                                <th className="text-left py-4">Transaction</th>
                                <th className="text-left py-4">Customer</th>
                                <th className="text-left py-4">Amount</th>
                                <th className="text-left py-4">Payment</th>
                                <th className="text-left py-4">Date</th>
                                 
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((item)=>(
                                <tr key={item.id} className="border-b border-slate-800 hover:bg-slate-800 transition">
                                    <td className="py-4">{item.id}</td>
                                    <td className="py-4">{item.customer}</td>
                                    <td className="py-4 text-green-400 font-semibold">{item.amount}</td>
                                    <td className="py-4">{item.payment}</td>
                                    <td className="py-4">{item.date}</td>

                                </tr>
                            ))}
                        </tbody>

                    </table>

                </div>

            </div>
            {/*Revenue Breakdown*/}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <p className="text-slate-400">Today's Earnings</p>
                    <h2 className="text-3xl font-bold mt-3 text-green-400">₹18,500</h2>

                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <p className="text-slate-400">This week</p>
                    <h2 className="text-3xl font-bold mt-3 text-green-400">₹92,300</h2>

                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <p className="text-slate-400">This Month</p>
                    <h2 className="text-3xl font-bold mt-3 text-green-400">₹2,18,500</h2>

                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <p className="text-slate-400">This Year</p>
                    <h2 className="text-3xl font-bold mt-3 text-green-400">₹12,45,800</h2>

                </div>

            </div>

            </div>

    )
}

export default VendorSales;