import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const location = useLocation();
  const { pathname } = location;
  
  // Get authentication states from Redux store
  const userAuth = useSelector((state) => state.user.autherised);
  const storeAuth = useSelector((state) => state.store.authorized);
  const adminAuth = useSelector((state) => state.admin.authorized);
  
  // Define paths and their required roles
  const pathConfig = {
    '/home': 'user',
    '/cart': 'user',
    '/products': 'user',
    '/adminhome': 'admin',
    '/shopowners': 'admin',
    '/storehome': 'store',
    '/addproduct': 'store'
  };
  
  // Login paths for each role
  const loginPaths = {
    user: '/login',
    store: '/storeLogin',
    admin: '/adminLogin'
  };
  
  // Check if current path is any type of login or register page
  const isLoginOrRegister = Object.values(loginPaths).some(path => 
    pathname.includes(path) || pathname.includes(path.replace('login', 'register'))
  );
  
  // Determine required auth type based on path or requiredRole
  const getRequiredAuthType = () => {
    if (requiredRole) return requiredRole;
    
    // Find the matching path configuration
    const matchingPath = Object.keys(pathConfig).find(path => pathname.startsWith(path));
    if (matchingPath) return pathConfig[matchingPath];
    
    // Default to user if no specific path is matched
    return 'user';
  };
  
  const authType = getRequiredAuthType();
  
  // Check if user is authenticated for the required type
  const isAuthenticated = {
    user: userAuth,
    store: storeAuth,
    admin: adminAuth
  }[authType];
  
  // Handle routing logic
  if (!isAuthenticated && !isLoginOrRegister) {
    // Not authenticated and trying to access protected route
    return <Navigate to={loginPaths[authType]} state={{ from: pathname }} replace />;
  }
  
  if (isAuthenticated && isLoginOrRegister) {
    // Authenticated but trying to access login/register page
    const homePaths = {
      user: '/home',
      store: '/storehome',
      admin: '/adminhome'
    };
    return <Navigate to={homePaths[authType]} replace />;
  }
  
  return children;
};

export default ProtectedRoute;