import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import UserDashboard from './components/UserDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import ChamaAdminDashboard from './components/ChamaAdminDashboard';
import PasswordResetFlow from './components/PasswordResetFlow';
import './App.css';

// Protected Route component with role-based routing
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, loading, user } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Check role-based access
  if (requiredRole) {
    const userRole = user?.role;
    const hasAccess = 
      requiredRole === 'super_admin' && userRole === 'super_admin' ||
      requiredRole === 'chama_admin' && (userRole === 'chama_admin' || userRole === 'super_admin') ||
      requiredRole === 'member' && (userRole === 'member' || userRole === 'chama_admin' || userRole === 'super_admin');
    
    if (!hasAccess) {
      // Redirect to appropriate dashboard based on role
      if (userRole === 'super_admin') {
        return <Navigate to="/super-admin" />;
      } else if (userRole === 'chama_admin') {
        return <Navigate to="/chama-admin" />;
      } else {
        return <Navigate to="/dashboard" />;
      }
    }
  }
  
  return children;
};

// Public Route component (redirect to appropriate dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === 'super_admin') {
      return <Navigate to="/super-admin" />;
    } else if (user?.role === 'chama_admin') {
      return <Navigate to="/chama-admin" />;
    } else {
      return <Navigate to="/dashboard" />;
    }
  }
  
  return children;
};

// Role-based dashboard selector
const RoleBasedDashboard = () => {
  const { user } = useAuth();
  
  if (user?.role === 'super_admin') {
    return <SuperAdminDashboard />;
  } else if (user?.role === 'chama_admin') {
    return <ChamaAdminDashboard />;
  } else {
    return <UserDashboard />;
  }
};

function AppContent() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <RegistrationForm />
            </PublicRoute>
          } 
        />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginForm />
            </PublicRoute>
          } 
        /> 
              <Route 
              path="/password-reset" 
              element={
         <PublicRoute>
         <PasswordResetFlow />
         </PublicRoute>
               } 
              />
        
        {/* Member Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute requiredRole="member">
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Chama Admin Dashboard */}
        <Route 
          path="/chama-admin" 
          element={
            <ProtectedRoute requiredRole="chama_admin">
              <ChamaAdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Super Admin Dashboard */}
        <Route 
          path="/super-admin" 
          element={
            <ProtectedRoute requiredRole="super_admin">
              <SuperAdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Auto-redirect based on role */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <RoleBasedDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
/*

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import UserDashboard from './components/UserDashboard';
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route component (redirect to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function AppContent() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <RegistrationForm />
            </PublicRoute>
          } 
        />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginForm />
            </PublicRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
*/