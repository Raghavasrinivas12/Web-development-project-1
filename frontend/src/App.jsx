import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import UserLayout from "./Layouts/UserLayout";
import Home from "./pages/user/Home";
import Signin from "./pages/user/Signin";
import Register from "./pages/user/Register";
import Profile from "./pages/user/Profile";
import Products from "./pages/user/Products";
import Wishlist from "./pages/user/Wishlist";
import Cart from "./pages/user/Cart";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Signin />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="cart" element={<Cart />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
            <Route path="products" element={<Products />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
