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
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
             <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
    <ShoppingBag
      size={22}
      className="text-white"
      strokeWidth={2}
    />
     </div>
  
  <h2 className="text-2xl font-bold">
              Shop<span className="text-blue-500">Hub</span>
            </h2>
   
            

            <p className="text-slate-400 mt-4">
              Many Stores, One Hub.
              Your one-stop destination for shopping
              across multiple vendors.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Quick Links
            </h3>

            <ul className="space-y-2 text-slate-400">
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
            <h3 className="text-lg font-semibold mb-4">
              Support
            </h3>

            <ul className="space-y-2 text-slate-400">
              <li>Help Center</li>
              <li>FAQs</li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Contact Us
            </h3>

            <p className="text-slate-400">
              support@shophub.com
            </p>

            <p className="text-slate-400 mt-2">
              +91 98765 43210
            </p>

            <div className="flex gap-4 mt-4">
              <FaFacebook
                className="text-slate-400 hover:text-blue-500 cursor-pointer"
                size={22}
              />

              <FaInstagram
                className="text-slate-400 hover:text-blue-500 cursor-pointer"
                size={22}
              />

              <FaTwitter
                className="text-slate-400 hover:text-blue-500 cursor-pointer"
                size={22}
              />

              <FaLinkedin
                className="text-slate-400 hover:text-blue-500 cursor-pointer"
                size={22}
              />
            </div>
          </div>

        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-800 mt-10 pt-6 text-center text-slate-500">
          © 2026 ShopHub. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;