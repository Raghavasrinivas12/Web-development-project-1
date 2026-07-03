import { Link, Outlet, useNavigate } from 'react-router-dom';
import {Settings,Gift,Receipt} from "lucide-react";
import {  useAuth} from '../context/AuthContext';

const VendorLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Fixed Admin Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-6 shadow-xl">
        <div>
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