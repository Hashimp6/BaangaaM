import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const location = useLocation();
  const { pathname } = location;

  // Get authentication states from localStorage
  const userAuth = localStorage.getItem("autherised") === "true";
  const storeAuth = localStorage.getItem("storeAuthorized") === "true";
  const adminAuth = localStorage.getItem("adminAuthorized") === "true";

  // Define paths and their required roles
  const pathConfig = {
    '/home': 'user',
    '/cart': 'user',
    '/products': 'user',
    '/adminhome': 'admin',
    '/shopowners': 'store',
    '/storehome': 'store',
    '/addproduct': 'store'
  };

  // Login paths for each role
  const loginPaths = {
    user: '/login',
    store: '/storeLogin',
    admin: '/adminLogin'
  };

  // Home paths for each role
  const homePaths = {
    user: '/home',
    store: '/storehome',
    admin: '/adminhome'
  };

  // Check if current path is any type of login or register page
  const isLoginOrRegister = Object.values(loginPaths).some(path => 
    pathname.includes(path) || pathname.includes(path.replace('login', 'register'))
  );

  // Check authentication based on required role
  const isAuthenticated = {
    user: userAuth,
    store: storeAuth,
    admin: adminAuth
  }[requiredRole];

  // If not authenticated and trying to access protected route
  if (!isAuthenticated && !isLoginOrRegister) {
    return <Navigate to={loginPaths[requiredRole]} state={{ from: pathname }} replace />;
  }

  // If authenticated and trying to access login page, redirect to appropriate home
  if (isAuthenticated && isLoginOrRegister) {
    const role = Object.keys(isAuthenticated).find(key => isAuthenticated[key]);
    return <Navigate to={homePaths[role]} replace />;
  }

  return children;
};

export default ProtectedRoute;