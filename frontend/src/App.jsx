import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

import UserLayout from "./Layouts/UserLayout";
import AdminLayout from "./Layouts/AdminLayout";
import VendorLayout from "./Layouts/VendorLayout";
import ProtectedRoute from "./Components/ProtectedRoute";

import Home from "./pages/public/Home";
import Signin from "./pages/public/Signin";
import Register from "./pages/public/Register";
import Products from "./pages/public/Products";
import Wishlist from "./pages/public/Wishlist";

import Profile from "./pages/user/Profile";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/public/Checkout";
import PaymentSuccess from "./pages/public/PaymentSuccess";
import MyOrders from "./pages/public/Myorders";

import VendorDashboard from "./pages/vendor/VendorDashboard";
import ManageProducts from "./pages/vendor/ManageProducts";
import StoreSettings from "./pages/vendor/StoreSettings";


import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers"
import ManageVendors from "./pages/admin/ManageVendors";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import ManageCategories from "./pages/admin/ManageCategories";
import Reports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/AdminSettings"
import AdminProfile from "./pages/admin/AdminProfile";
import VendorOrders from "./pages/vendor/VendorOrders";
import VendorSales from "./pages/vendor/VendorSales";
import VendorProfile from "./pages/vendor/VendorProfile";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Routes>
              <Route element={<UserLayout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Signin />} />
                <Route path="register" element={<Register />} />
                <Route path="products" element={<Products />} />
                <Route path="wishlist" element={<Wishlist />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={["customer", "superadmin", "vendor"]} />}>
                <Route element={<UserLayout />}>
                  <Route path="profile" element={<Profile />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="payment-success" element={<PaymentSuccess />} />
                  <Route path="myorders" element={<MyOrders />} />
                </Route>
              </Route>

              <Route element={<ProtectedRoute allowedRoles={["vendor"]} />}>
                <Route path="/vendor/dashboard" element={<VendorLayout />}>
                  <Route index element={<VendorDashboard />} />
                  <Route path="products" element={<ManageProducts />} />
                  <Route path="settings" element={<StoreSettings />} />
                  <Route path="orders" element={<VendorOrders />} />
                  <Route path="sales" element={<VendorSales />} />
                  <Route path="profile" element={<VendorProfile />} />
                </Route>
              </Route>
              
           <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
              <Route path="/admindashboard" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
              </Route>
              <Route path="/adminusers" element={<AdminLayout />}>
                <Route index element={<AdminUsers />} />
              </Route>
              <Route path="/adminvendors" element={<AdminLayout />}>
                <Route index element={<ManageVendors />} />
              </Route>
              <Route path="/admin/products" element={<AdminLayout />}>
                <Route index element={<AdminProducts />} />
              </Route>
              <Route path="/admin/orders" element={<AdminLayout />}>
                <Route index element={<AdminOrders />} />
              </Route>
              <Route path="/admin/categories" element={<AdminLayout />}>
                <Route index element={<ManageCategories />} />
              </Route>
              <Route path="/admin/reports" element={<AdminLayout />}>
                <Route index element={<Reports />} />
              </Route>
              <Route path="/admin/settings" element={<AdminLayout />}>
                <Route index element={<AdminSettings />} />
              </Route>
              <Route path="/admin/profile" element={<AdminLayout />}>
                <Route index element={<AdminProfile />} />
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
