import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserLayout from "./Layouts/UserLayout";

import Home from "./pages/user/Home";
import Signin from "./pages/user/Signin";
import Register from "./pages/user/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Signin />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;