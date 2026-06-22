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
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const categories = [
  { name: "Electronics", icon: <Laptop size={16} /> },
  { name: "Fashion", icon: <Shirt size={16} /> },
  { name: "Books", icon: <BookOpen size={16} /> },
  { name: "Grocery", icon: <ShoppingBasket size={16} /> },
  { name: "Accessories", icon: <Watch size={16} /> },
];

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

          <div className="hidden md:flex items-center bg-slate-950 rounded-lg px-3 py-1.5 w-1/3">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="bg-transparent outline-none px-2 w-full text-white placeholder-slate-400 text-sm"
            />
          </div>

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

            <Link to="/products" className="hover:text-blue-500 transition">Products</Link>

            <Link to="/cart" className="relative hover:text-blue-500 transition">
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-blue-500 text-xs px-1.5 rounded-full">0</span>
            </Link>

            <Link to="/wishlist" className="relative hover:text-blue-500 transition">
              <Heart size={20} />
              <span className="absolute -top-2 -right-2 bg-blue-500 text-xs px-1.5 rounded-full">0</span>
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 hover:text-blue-500 transition"
                >
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">
                      {user?.username?.charAt(0)?.toUpperCase() || "U"}
                    </div>
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
                    <div className="border-t border-slate-800 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-slate-800 transition w-full text-left"
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

          <button className="md:hidden" onClick={() => setIsOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-slate-900 text-white z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h2 className="text-xl font-bold">
            Shop<span className="text-blue-500">Hub</span>
          </h2>
          <button onClick={() => setIsOpen(false)}><X size={22} /></button>
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800">
              <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold text-white">
                {user?.username?.charAt(0)?.toUpperCase() || "U"}
              </div>
            <div className="text-sm">
              <p className="text-white font-medium truncate">{user?.username}</p>
              <p className="text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
        )}

        <div className="p-4">
          <div className="flex items-center bg-slate-950 rounded-lg px-3 py-1.5">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="bg-transparent outline-none px-2 w-full text-white placeholder-slate-400 text-sm"
            />
          </div>
        </div>

        <div className="flex flex-col p-4 gap-4 text-sm">
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 hover:text-blue-500">
            <House size={18} /> Home
          </Link>

          <div>
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="flex items-center justify-between w-full hover:text-blue-500"
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
                    className="flex items-center gap-3 text-slate-300 hover:text-blue-500 text-sm"
                  >
                    {category.icon}
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/products" onClick={() => setIsOpen(false)} className="flex items-center gap-3 hover:text-blue-500">
            <Package size={18} /> Products
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 hover:text-blue-500">
                <User size={18} /> My Profile
              </Link>
              <button
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="flex items-center gap-3 text-red-400 hover:text-red-300 w-full text-left"
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

          <Link to="/cart" onClick={() => setIsOpen(false)} className="flex items-center gap-3 hover:text-blue-500">
            <ShoppingCart size={18} /> Cart
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
