import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import {
  ShoppingBag,
}from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          {/* Brand */}
          <div>
             <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
    <ShoppingBag
      size={20}
      className="text-white"
      strokeWidth={2}
    />
     </div>
  
  <h2 className="text-xl font-bold mt-2">
              Shop<span className="text-blue-500">Hub</span>
            </h2>
    

            <p className="text-slate-400 mt-3 text-sm">
              Many Stores, One Hub.
              Your one-stop destination for shopping
              across multiple vendors.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold mb-3">
              Quick Links
            </h3>

            <ul className="space-y-1.5 text-slate-400 text-sm">
              <li>
                <a href="/" className="hover:text-blue-500">
                  Home
                </a>
              </li>

              <li>
                <a href="/products" className="hover:text-blue-500">
                  Products
                </a>
              </li>

              <li>
                <a href="/login" className="hover:text-blue-500">
                  Login
                </a>
              </li>

              <li>
                <a href="/register" className="hover:text-blue-500">
                  Register
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-base font-semibold mb-3">
              Support
            </h3>

            <ul className="space-y-1.5 text-slate-400 text-sm">
              <li>Help Center</li>
              <li>FAQs</li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-semibold mb-3">
              Contact Us
            </h3>

            <p className="text-slate-400 text-sm">
              support@shophub.com
            </p>

            <p className="text-slate-400 mt-2 text-sm">
              +91 98765 43210
            </p>

            <div className="flex gap-3 mt-3">
              <FaFacebook
                className="text-slate-400 hover:text-blue-500 cursor-pointer"
                size={20}
              />

              <FaInstagram
                className="text-slate-400 hover:text-blue-500 cursor-pointer"
                size={20}
              />

              <FaTwitter
                className="text-slate-400 hover:text-blue-500 cursor-pointer"
                size={20}
              />

              <FaLinkedin
                className="text-slate-400 hover:text-blue-500 cursor-pointer"
                size={20}
              />
            </div>
          </div>

        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-800 mt-8 pt-5 text-center text-slate-500 text-sm">
          © 2026 ShopHub. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
