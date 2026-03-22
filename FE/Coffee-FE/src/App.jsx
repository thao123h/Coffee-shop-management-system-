import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './lib/authContext';
import AuthProvider from './lib/AuthProvider';
import { CartProvider } from './lib/cartContext';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Orders from './pages/Orders';
import Products from './pages/Products';
import ProductForm from './pages/ProductForm';
import Categories from './pages/Categories';
import Payments from './pages/Payments';
import Users from './pages/Users';
import Vouchers from './pages/Vouchers';
import Toppings from './pages/Toppings';
import PaymentCancel from './pages/PaymentCancel';
import PaymentSuccess from './pages/PaymentSuccess';
// Protected Route Component
import CategoryForm from './pages/CategoryForm';
import AdminUsers from './pages/AdminUsers';
import SystemTraffic from './pages/SystemTraffic';
import Unauthorized from './pages/Unauthorized';
import { Toaster } from './components/ui/sonner';

// Protected Route - require authentication
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// Public Route - redirect to home if already logged in
function PublicRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return children;
  return <Navigate to={getDefaultPath(user?.role)} />;
}

// Role-based Route Guard
function RoleRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;
  return children;
}

// Get default landing path based on role
function getDefaultPath(role) {
  switch (role) {
    case 'STAFF':   return '/dashboard/pos';
    case 'ADMIN':   return '/dashboard/admin/users';
    case 'MANAGER':
    default:        return '/dashboard';
  }
}

// Smart redirect component (role-aware)
function RoleRedirect() {
  const { user } = useAuth();
  return <Navigate to={getDefaultPath(user?.role)} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
              <Route path="/cancel" element={<PaymentCancel />} />
               <Route path="/success" element={<PaymentSuccess />} />

            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
                <Route path="cancel" element={<PaymentCancel />} />
                <Route path="success" element={<PaymentSuccess />} />
              {/* MANAGER routes */}
              <Route
                index
                element={
                  <RoleRoute allowedRoles={['MANAGER']}>
                    <Dashboard />
                  </RoleRoute>
                }
              />
              <Route
                path="orders"
                element={
                  <RoleRoute allowedRoles={['MANAGER']}>
                    <Orders />
                  </RoleRoute>
                }
              />
              <Route
                path="products"
                element={
                  <RoleRoute allowedRoles={['MANAGER']}>
                    <Products />
                  </RoleRoute>
                }
              />
              <Route
                path="products/new"
                element={
                  <RoleRoute allowedRoles={['MANAGER']}>
                    <ProductForm />
                  </RoleRoute>
                }
              />
              <Route
                path="products/:id/edit"
                element={
                  <RoleRoute allowedRoles={['MANAGER']}>
                    <ProductForm />
                  </RoleRoute>
                }
              />
              <Route
                path="categories"
                element={
                  <RoleRoute allowedRoles={['MANAGER']}>
                    <Categories />
                  </RoleRoute>
                }
              />
              <Route
                path="categories/new"
                element={
                  <RoleRoute allowedRoles={['MANAGER']}>
                    <CategoryForm />
                  </RoleRoute>
                }
              />
              <Route
                path="categories/:id/edit"
                element={
                  <RoleRoute allowedRoles={['MANAGER']}>
                    <CategoryForm />
                  </RoleRoute>
                }
              />
              <Route
                path="payments"
                element={
                  <RoleRoute allowedRoles={['MANAGER']}>
                    <Payments />
                  </RoleRoute>
                }
              />
              <Route
                path="users"
                element={
                  <RoleRoute allowedRoles={['MANAGER']}>
                    <Users />
                  </RoleRoute>
                }
              />
              <Route
                path="vouchers"
                element={
                  <RoleRoute allowedRoles={['MANAGER']}>
                    <Vouchers />
                  </RoleRoute>
                }
              />
              <Route
                path="toppings"
                element={
                  <RoleRoute allowedRoles={['MANAGER']}>
                    <Toppings />
                  </RoleRoute>
                }
              />

              {/* STAFF + MANAGER routes */}
              <Route
                path="pos"
                element={
                  <RoleRoute allowedRoles={['STAFF', 'MANAGER']}>
                    <POS />
                  </RoleRoute>
                }
              />

              {/* ADMIN routes */}
              <Route
                path="admin/users"
                element={
                  <RoleRoute allowedRoles={['ADMIN']}>
                    <AdminUsers />
                  </RoleRoute>
                }
              />
              <Route
                path="admin/traffic"
                element={
                  <RoleRoute allowedRoles={['ADMIN']}>
                    <SystemTraffic />
                  </RoleRoute>
                }
              />

              {/* Catch-all inside dashboard: redirect by role */}
              <Route path="*" element={<RoleRedirect />} />
            </Route>

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
          <Toaster position="top-center" richColors />
        </CartProvider>
   </AuthProvider>
    </BrowserRouter>
  );
}
