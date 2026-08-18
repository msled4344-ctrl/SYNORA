import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Taskbar } from './components/Taskbar';
import { Footer } from './components/Footer';
import { EmergencyBanner } from './components/EmergencyBanner';

import { Home } from './pages/Home';
import { AiHealth } from './pages/AiHealth';
import { BabyCare } from './pages/BabyCare';
import { Medicine } from './pages/Medicine';
import { HealthScore } from './pages/HealthScore';
import { Profile } from './pages/Profile';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Admin } from './pages/Admin';
import { AdminRoute } from './components/AdminRoute';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Terms } from './pages/Terms';

// Scroll to top helper on route navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App = () => {
  return (
    <div className="app-container">
      <ScrollToTop />
      <EmergencyBanner />
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ai-health" element={<AiHealth />} />
          <Route path="/baby-care" element={<BabyCare />} />
          <Route path="/medicine" element={<Medicine />} />
          <Route path="/health-score" element={<HealthScore />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Taskbar />
      <Footer />
    </div>
  );
};
