import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import UserLayout from "./Layouts/UserLayout";
import Home from "./pages/user/Home";
import Signin from "./pages/user/Signin";
import Register from "./pages/user/Register";
import Profile from "./pages/user/Profile";
import Products from "./pages/user/Products";
import Cart from "./pages/user/Cart";
import Wishlist from "./pages/user/Wishlist";
import Checkout from "./pages/user/Checkout";
import PaymentSuccess from "./pages/user/PaymentSuccess";
import MyOrders from "./pages/user/Myorders";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Routes>
              <Route path="/" element={<UserLayout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Signin />} />
                <Route path="register" element={<Register />} />
                <Route path="profile" element={<Profile />} />
                <Route path="products" element={<Products />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="payment-success" element={<PaymentSuccess />} />
                <Route path="myorders" element={<MyOrders />} />
                <Route path="wishlist" element={<Wishlist />} />
              </Route>
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
