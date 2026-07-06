import { Link, Outlet, useNavigate } from 'react-router-dom';
import {Settings,Gift,Receipt,Menu,X,ShoppingCart,ChartColumn,User} from "lucide-react";
import {  useAuth} from '../context/AuthContext';
import { useState } from 'react';
const VendorLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen,setSidebarOpen]=useState(false);

  return (
    <div className="flex h-screen bg-slate-950 font-sans relative">
      {/* Mobile Header */}

<div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 flex items-center justify-between px-4 z-50 shadow-lg">

    <button
        onClick={() => setSidebarOpen(true)}
    >
        <Menu size={28} className="text-white hover:text-blue-400" />
    </button>

    <h1 className="text-xl font-bold text-blue-500">
        ZAALIMA
    </h1>

</div>
      {/* Fixed Admin Sidebar */}
      <aside className={`fixed lg:static top-0 left-0 h-full w-64 bg-slate-900 text-white flex flex-col justify-between p-6 shadow-xl z-50 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" :"-translate-x-full"} lg:translate-x-0`}>
        <div>
          <div className="flex justify-end lg:hidden mb-4">

    <button
        onClick={() => setSidebarOpen(false)}
    >
        <X size={28} className='text-white  hover:text-blue-400'/>
    </button>

</div>
          <div className="text-2xl font-bold tracking-wider text-blue-500 mb-8 border-b border-slate-700 pb-4">
            ZAALIMA <span className="text-white text-sm block tracking-normal font-normal opacity-60">Vendor Core</span>
          </div>
          <nav className="space-y-3">
            <Link to="/vendor/dashboard" className="flex items-center gap-2 block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800 hover:text-blue-400">
              <Receipt/>
               Overview Console
            </Link>
            <Link to="/vendor/dashboard/products" className="flex items-center gap-2 block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800 hover:text-blue-400">
              <Gift size={20}/>
               Manage Products
            </Link>
            <Link to="/vendor/dashboard/settings" className="flex items-center gap-2 block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800 hover:text-blue-400">
            
              <Settings size={20}/>
              <span>Store Settings</span>
              
            </Link>
            <Link to="/vendor/dashboard/orders" className="flex items-center gap-2 block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800 hover:text-blue-400">
            
              <ShoppingCart size={20}/>
              <span>Manage Orders</span>
              
            </Link>
             <Link to="/vendor/dashboard/sales" className="flex items-center gap-2 block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800 hover:text-blue-400">
            
              <ChartColumn size={20}/>
              <span>Manage Sales</span>
              
            </Link>
            <Link to="/vendor/dashboard/profile" className="flex items-center gap-2 block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800 hover:text-blue-400">
              <User size={20}/>
              <span>Profile</span>
            </Link>
          </nav>
        </div>
        <button 
          onClick={() => { logout(); navigate('/login'); }} 
          className="w-full bg-blue-600 hover:bg-blue-700 py-2.5 px-4 rounded font-semibold text-sm transition-colors duration-200"
        >
          Exit Dashboard
        </button>
      </aside>

      {/* Dynamic Content Frame */}
      <main className="flex-1 overflow-y-auto p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default VendorLayout;