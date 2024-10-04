import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import ProtectedRoute from "./components/IsAutherised";

// Public pages
import RegisterPage from "../src/pages/Register";
import LoginForm from "./pages/login";
import StoreLoginForm from "./pages/storeLogin";
import StoreRegisterForm from "./pages/storeReg";
import AdminRegister from "./pages/AdminReg";
import AdminLogin from "./pages/AdminLogin";

// Protected pages
import Home from "./pages/Home";
import Products from "./pages/Product";
import Cart from "./components/CartComponent";
import AdminHome from "./pages/AdminHome";
import ShopOwners from "./pages/ShopOwners";
import StoreForm from "./pages/CreateStore";
import AddProductForm from "./pages/AddProduct";

const App = () => {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        {/* Public routes */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/storeLogin" element={<StoreLoginForm />} />
        <Route path="/storeRegister" element={<StoreRegisterForm />} />
        <Route path="/adminRegister" element={<AdminRegister />} />
        <Route path="/adminLogin" element={<AdminLogin />} />

        {/* User routes */}
        <Route path="/home" element={
          <ProtectedRoute requiredRole="user">
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/products" element={
          <ProtectedRoute requiredRole="user">
            <Products />
          </ProtectedRoute>
        } />
        <Route path="/cart" element={
          <ProtectedRoute requiredRole="user">
            <Cart />
          </ProtectedRoute>
        } />

        {/* Admin routes */}
        <Route path="/adminhome" element={
          <ProtectedRoute requiredRole="admin">
            <AdminHome />
          </ProtectedRoute>
        } />

        {/* Store routes */}
        <Route path="/shopowners" element={
          <ProtectedRoute requiredRole="store">
            <ShopOwners />
          </ProtectedRoute>
        } />
        <Route path="/storehome" element={
          <ProtectedRoute requiredRole="store">
            <StoreForm />
          </ProtectedRoute>
        } />
        <Route path="/addproduct" element={
          <ProtectedRoute requiredRole="store">
            <AddProductForm />
          </ProtectedRoute>
        } />

        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
};

export default App;