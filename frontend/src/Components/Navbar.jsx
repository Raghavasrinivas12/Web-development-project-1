import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  ShoppingBag,
  User,
  Heart,
  Menu,
  Search,
  X,
  House,
  Grid3X3,
  Package,
  LogIn,
  UserPlus,
  ChevronDown,
  ChevronUp,
  Laptop,
  Shirt,
  BookOpen,
  ShoppingBasket,
  Watch,
  LogOut,
  Settings,
  Receipt,
  Bell,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import API_URL from "../config";
import axios from "axios";

const categories = [
  { name: "Electronics", icon: <Laptop size={16} /> },
  { name: "Fashion", icon: <Shirt size={16} /> },
  { name: "Books", icon: <BookOpen size={16} /> },
  { name: "Grocery", icon: <ShoppingBasket size={16} /> },
  { name: "Accessories", icon: <Watch size={16} /> },
];

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    axios.get(`${API_URL}/api/notifications`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setNotifCount(res.data.unreadCount)).catch(() => {});
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-slate-900 text-white shadow-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <ShoppingBag size={20} className="text-white" strokeWidth={2} />
            </div>
            <span>
              Shop<span className="text-blue-500">Hub</span>
            </span>
          </Link>

         <button
  onClick={() => navigate("/search")}
  className="hidden md:flex items-center gap-2 hover:text-blue-500 transition"
>
  <Search size={22} />
  <span>Search Products</span>
</button>
           
            
          

          <div className="hidden md:flex items-center gap-5 font-medium text-sm">
            <Link to="/" className="hover:text-blue-500 transition">Home</Link>

            <div className="relative group">
              <button className="hover:text-blue-500 transition">Categories ▼</button>
              <div className="absolute left-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    to={`/products?category=${category.name.toLowerCase()}`}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-800 hover:text-blue-500 text-sm"
                  >
                    {category.icon}
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

             <Link to="/myorders" className="hover:text-blue-500 transition">My Orders</Link>

            <Link to="/products" className="hover:text-blue-500 transition">Products</Link>

            <Link to="/cart" className="relative hover:text-blue-500 transition">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-xs px-1.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link to="/wishlist" className="relative hover:text-blue-500 transition">
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-xs px-1.5 rounded-full">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {isAuthenticated && (
              <Link to="/notifications" className="relative hover:text-blue-500 transition">
                <Bell size={20} />
                {notifCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-500 text-xs px-1.5 rounded-full">
                    {notifCount}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 hover:text-blue-500 transition"
                >
                    {user?.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover border border-slate-600"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">
                        {user?.username?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                  <ChevronDown size={14} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl shadow-black/40 py-2">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-white font-medium text-sm truncate">
                        {user?.username}
                      </p>
                      <p className="text-slate-400 text-xs truncate">
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition"
                    >
                      <User size={16} />
                      My Profile
                    </Link>
                    {user?.role === "superadmin" && (
                      <Link
                        to="/admindashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition"
                      >
                        <LayoutDashboard size={16} />
                        Admin Dashboard
                      </Link>
                    )}
                    {user?.role === "vendor" && (
                      <Link
                        to="/vendor/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition"
                      >
                        <LayoutDashboard size={16} />
                        Vendor Dashboard
                      </Link>
                    )}
                    <div className="border-t border-slate-800 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-blue-400 hover:text-blue-300 hover:bg-slate-800 transition w-full text-left"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-500 transition">Login</Link>
                <Link
                  to="/register"
                  className="bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-lg transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

         <div className="flex items-center gap-3 md:hidden">
  <button
    onClick={() => navigate("/search")}
    className="hover:text-blue-500 transition"
  >
    <Search size={22} />
  </button>

  <button className="md:hidden hover:text-blue-400" onClick={() => setIsOpen(true)}>
    <Menu size={24} />
  </button>
</div>
</div>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
      )}

     <div
  className={`fixed top-0 left-0 h-screen w-64 bg-slate-900 text-white z-50 transition-transform duration-300 flex flex-col ${
    isOpen ? "translate-x-0" : "-translate-x-full"
  }`}
>
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h2 className="text-xl font-bold">
            Shop<span className="text-blue-500">Hub</span>
          </h2>
          <button onClick={() => setIsOpen(false)}><X size={22} className="hover:text-blue-500" /></button>
        </div>

        {isAuthenticated && (
  <div className="flex items-center gap-4 px-5 py-5 border-b border-slate-800">
    {user?.profilePic ? (
      <img
        src={user.profilePic}
        alt="Profile"
        className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-lg"
      />
    ) : (
      <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-2xl font-bold text-white border-2 border-blue-500 shadow-lg">
        {user?.username?.charAt(0)?.toUpperCase() || "U"}
      </div>
    )}

    <div className="flex-1 min-w-0">
      <h3 className="text-lg font-semibold text-white truncate">
        {user?.username}
      </h3>

      
    </div>
  </div>
)}

        

        <div className="flex-1 overflow-y-auto p-4 space-y-2 text-sm pb-10">
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-blue-500 transition-all duration-200">
            <House size={18} /> Home
          </Link>

          <div>
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-blue-500 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <Grid3X3 size={18} /> Categories
              </div>
              {showCategories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {showCategories && (
              <div className="mt-3 ml-8 flex flex-col gap-2">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    to={`/products?category=${category.name.toLowerCase()}`}
                    onClick={() => { setIsOpen(false); setShowCategories(false); }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-blue-500 transition-all duration-200"
                  >
                    {category.icon}
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/myorders" onClick={() => setIsOpen(false)} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-blue-500 transition-all duration-200">
            <Receipt size={18} /> My Orders
          </Link>

          <Link to="/products" onClick={() => setIsOpen(false)} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-blue-500 transition-all duration-200">
            <Package size={18} /> Products
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-blue-500 transition-all duration-200">
                <User size={18} /> My Profile
              </Link>
              <Link to="/notifications" onClick={() => setIsOpen(false)} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-blue-500 transition-all duration-200">
                <Bell size={18} /> Notifications
              </Link>
              {user?.role === "superadmin" && (
                <Link to="/admindashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-blue-500 transition-all duration-200">
                  <LayoutDashboard size={18} /> Admin Dashboard
                </Link>
              )}
              {user?.role === "vendor" && (
                <Link to="/vendor/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-blue-500 transition-all duration-200">
                  <LayoutDashboard size={18} /> Vendor Dashboard
                </Link>
              )}
              <button
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-blue-500 transition-all duration-200"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-3 hover:text-blue-500">
                <LogIn size={18} /> Login
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="flex items-center gap-3 hover:text-blue-500">
                <UserPlus size={18} /> Register
              </Link>
            </>
          )}

          <Link to="/cart" onClick={() => setIsOpen(false)} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-blue-500 transition-all duration-200">
            <ShoppingCart size={18} /> Cart
          </Link>

          <Link to="/cart" onClick={() => setIsOpen(false)} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-blue-500 transition-all duration-200">
            <Heart size={18} /> Wishlist
          </Link>
        </div>
      </div>
      
    </>
  );
};

export default Navbar;
