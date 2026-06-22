import { useState } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";

const categories = [
  {
    name: "Electronics",
    icon: <Laptop size={18} />,
  },
  {
    name: "Fashion",
    icon: <Shirt size={18} />,
  },
  {
    name: "Books",
    icon: <BookOpen size={18} />,
  },
  {
    name: "Grocery",
    icon: <ShoppingBasket size={18} />,
  },
  {
    name: "Accessories",
    icon: <Watch size={18} />,
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-slate-900 text-white shadow-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
    <ShoppingBag
      size={22}
      className="text-white"
      strokeWidth={2}
    />
     </div>
            <span>
              Shop<span className="text-blue-500">Hub</span>
            </span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex items-center bg-slate-950 rounded-lg px-3 py-2 w-1/3">
            <Search
              size={18}
              className="text-slate-400"
            />
            <input
              type="text"
              placeholder="Search products..."
              className="bg-transparent outline-none px-2 w-full text-white placeholder-slate-400"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 font-medium">

            <Link
              to="/"
              className="hover:text-blue-500 transition"
            >
              Home
            </Link>

            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="hover:text-blue-500 transition">
                Categories ▼
              </button>

              <div className="absolute left-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    to={`/category/${category.name.toLowerCase()}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-blue-500"
                  >
                    {category.icon}
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/products"
              className="hover:text-blue-500 transition"
            >
              Products
            </Link>

            <Link
              to="/login"
              className="hover:text-blue-500 transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition"
            >
              Register
            </Link>

            <Link
              to="/cart"
              className="relative hover:text-blue-500 transition"
            >
              <ShoppingCart size={22} />

              <span className="absolute -top-2 -right-2 bg-blue-500 text-xs px-1.5 rounded-full">
                0
              </span>
            </Link>

            <Link
              to="/wishlist"
              className="relative hover:text-blue-500 transition"
            >
              <User size={22}/>

              <span className="absolute -top-2 -right-2 bg-blue-500 text-xs px-1.5 rounded-full">
              
              </span>
            </Link>

            <Link
              to="/profile"
              className="relative hover:text-blue-500 transition"
            >
              <Heart size={22} />

              <span className="absolute -top-2 -right-2 bg-blue-500 text-xs px-1.5 rounded-full">
                0
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Offcanvas */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-slate-900 text-white z-50 transition-transform duration-300 ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h2 className="text-2xl font-bold">
            Shop<span className="text-blue-500">Hub</span>
          </h2>

          <button
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="p-4">
          <div className="flex items-center bg-slate-950 rounded-lg px-3 py-2">
            <Search
              size={18}
              className="text-slate-400"
            />
            <input
              type="text"
              placeholder="Search products..."
              className="bg-transparent outline-none px-2 w-full text-white placeholder-slate-400"
            />
          </div>
        </div>

        {/* Mobile Links */}
        <div className="flex flex-col p-5 gap-5">

          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 hover:text-blue-500"
          >
            <House size={20} />
            Home
          </Link>

          {/* Categories */}
          <div>
            <button
              onClick={() =>
                setShowCategories(!showCategories)
              }
              className="flex items-center justify-between w-full hover:text-blue-500"
            >
              <div className="flex items-center gap-3">
                <Grid3X3 size={20} />
                Categories
              </div>

              {showCategories ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>

            {showCategories && (
              <div className="mt-4 ml-8 flex flex-col gap-3">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    to={`/category/${category.name.toLowerCase()}`}
                    onClick={() => {
                      setIsOpen(false);
                      setShowCategories(false);
                    }}
                    className="flex items-center gap-3 text-slate-300 hover:text-blue-500"
                  >
                    {category.icon}
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/products"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 hover:text-blue-500"
          >
            <Package size={20} />
            Products
          </Link>

          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 hover:text-blue-500"
          >
            <LogIn size={20} />
            Login
          </Link>

          <Link
            to="/register"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 hover:text-blue-500"
          >
            <UserPlus size={20} />
            Register
          </Link>

          <Link
            to="/cart"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 hover:text-blue-500"
          >
            <ShoppingCart size={20} />
            Cart
          </Link>

        </div>
      </div>
    </>
  );
};

export default Navbar;