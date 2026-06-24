import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

// Layout Containers
import UserLayout from "./Layouts/UserLayout";
import VendorLayout from "./Layouts/VendorLayout";

// Access Restriction Tool
import ProtectedRoute from "./Components/ProtectedRoute";

// Public Marketplace Views
import Home from "./pages/public/Home";
import Signin from "./pages/public/Signin";
import Register from "./pages/public/Register";
import Products from "./pages/public/Products";
import Wishlist from "./pages/public/Wishlist";

// Customer Restricted Views
import Profile from "./pages/customer/Profile";
import Cart from "./pages/customer/Cart";

// Vendor Tenant Dashboards (Create dummy UI components for these files to test)
import VendorDashboard from "./pages/vendor/VendorDashboard";
import ManageProducts from "./pages/vendor/ManageProducts";
import StoreSettings from "./pages/vendor/StoreSettings";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Routes>
              
              {/* =========================================================
                  1. GLOBAL PUBLIC ROUTING CHANNEL (Retail Layout)
                 ========================================================= */}
              <Route element={<UserLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Signin />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<Products />} />
                <Route path="/wishlist" element={<Wishlist />} />
              </Route>

              {/* =========================================================
                  2. PROTECTED CUSTOMER PATHS (Requires login + 'customer' role)
                 ========================================================= */}
              <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
                <Route element={<UserLayout />}>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/cart" element={<Cart />} />
                </Route>
              </Route>

              {/* =========================================================
                  3. PROTECTED MULTI-TENANT VENDOR WORKSPACE (Dashboard Layout)
                 ========================================================= */}
              <Route element={<ProtectedRoute allowedRoles={["vendor"]} />}>
                <Route path="/vendor/dashboard" element={<VendorLayout />}>
                  <Route index element={<VendorDashboard />} />
                  <Route path="products" element={<ManageProducts />} />
                  <Route path="settings" element={<StoreSettings />} />
                </Route>
              </Route>

            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;