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
import Myorders from "./pages/user/Myorders";
import Checkout from "./pages/user/Checkout";
import ProductDetails from "./pages/user/ProductDetails";
import OrderDetails from "./pages/user/Orderdetails";
import SearchFilter from "./pages/user/SearchFilter";

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
                <Route path="wishlist" element={<Wishlist />} />
                <Route path="myorders" element={<Myorders />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="productdetails" element={<ProductDetails />} />
                <Route path="orderdetails" element={<OrderDetails />} />
                <Route path="search" element={<SearchFilter />} />
              </Route>
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
