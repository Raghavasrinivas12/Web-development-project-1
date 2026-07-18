import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { ShoppingBag, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <ShoppingBag
                size={24}
                className="text-white"
                strokeWidth={2.3}
              />
            </div>

            <h2 className="text-2xl font-bold mt-4">
              Shop<span className="text-blue-500">Hub</span>
            </h2>

            <p className="text-slate-400 mt-4 leading-7 text-sm">
              Many Stores. One Hub.
              <br />
              Discover products from multiple trusted vendors
              with secure shopping, fast delivery, and the best
              deals—all in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3 text-slate-400">

              <li>
                <Link
                  to="/"
                  className="hover:text-blue-500 transition duration-300"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/products"
                  className="hover:text-blue-500 transition duration-300"
                >
                  Products
                </Link>
              </li>

              <li>
                <Link
                  to="/refund-policy"
                  className="hover:text-blue-500 transition duration-300"
                >
                  Refund Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="hover:text-blue-500 transition duration-300"
                >
                  About Us
                </Link>
              </li>

            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-5">
              Support
            </h3>

            <ul className="space-y-3 text-slate-400">

              <li>
                <Link
                  to="/help-center"
                  className="hover:text-blue-500 transition duration-300"
                >
                  Help Center
                </Link>
              </li>

              <li>
                <Link
                  to="/help-center"
                  className="hover:text-blue-500 transition duration-300"
                >
                  FAQs
                </Link>
              </li>

              <li>
                <Link
                  to="/terms"
                  className="hover:text-blue-500 transition duration-300"
                >
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-blue-500 transition duration-300"
                >
                  Privacy Policy
                </Link>
              </li>

            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-5">
              Contact Us
            </h3>

            <p className="text-slate-400 text-sm">
              support@shophub.com
            </p>

            <p className="text-slate-400 mt-3 text-sm">
              +91 98765 43210
            </p>

            <div className="flex gap-4 mt-6">

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-500 transition duration-300"
              >
                <FaFacebook size={18} />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-500 transition duration-300"
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-500 transition duration-300"
              >
                <FaTwitter size={18} />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-500 transition duration-300"
              >
                <FaLinkedin size={18} />
              </a>

            </div>

          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 mt-12 pt-6">

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">

            <p className="text-slate-500">
              © {new Date().getFullYear()} ShopHub. All Rights Reserved.
            </p>

            <p className="flex items-center gap-2 text-slate-500">
              Built with
              <Heart
                size={15}
                className="text-red-500 fill-red-500"
              />
              for seamless shopping.
            </p>

          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;