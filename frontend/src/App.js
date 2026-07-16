import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { WatchlistProvider } from './context/WatchlistContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import BottomTabBar from './components/BottomTabBar';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AssetDetailPage from './pages/AssetDetailPage';
import WatchlistPage from './pages/WatchlistPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import LearnPage from './pages/LearnPage';

const AppLayout = ({ children }) => (
  <div className="min-h-screen bg-surface-0 pb-16 md:pb-0 pt-0 md:pt-16">
    <Navbar />
    <main className="w-full">{children}</main>
    <BottomTabBar />
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <WatchlistProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<AppLayout><AboutPage /></AppLayout>} />
                <Route path="/learn" element={<AppLayout><LearnPage /></AppLayout>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Routes inside AppLayout */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
                  <Route path="/asset/:symbol" element={<AppLayout><AssetDetailPage /></AppLayout>} />
                  <Route path="/watchlist" element={<AppLayout><WatchlistPage /></AppLayout>} />
                  <Route path="/profile" element={<AppLayout><ProfilePage /></AppLayout>} />
                </Route>
              </Routes>
            </Router>
          </WatchlistProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
