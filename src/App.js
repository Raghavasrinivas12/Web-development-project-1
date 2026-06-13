import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PrivateRoute from './routes/PrivateRoute';
import RoleRoute from './routes/RoleRoute';

const AdminDashboard = () => <div className="p-8 text-2xl">Admin Dashboard 🛠️</div>;
const VendorDashboard = () => <div className="p-8 text-2xl">Vendor Dashboard 🏪</div>;
const CustomerShop = () => <div className="p-8 text-2xl">Customer Shop 🛒</div>;
const Unauthorized = () => <div className="p-8 text-2xl">Unauthorized ❌</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/admin/*" element={
          <RoleRoute allowedRoles={['superadmin']}>
            <AdminDashboard />
          </RoleRoute>
        } />
        <Route path="/vendor/*" element={
          <RoleRoute allowedRoles={['vendor']}>
            <VendorDashboard />
          </RoleRoute>
        } />
        <Route path="/shop/*" element={
          <PrivateRoute>
            <CustomerShop />
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;