import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

// Public Pages
import Homepage from '../pages/public/Homepage';
import SchoolDirectory from '../pages/public/SchoolDirectory';
import SchoolProfile from '../pages/public/SchoolProfile';
import NewsFeed from '../pages/public/NewsFeed';
import ArticlePage from '../pages/public/ArticlePage';
import CategoryPage from '../pages/public/CategoryPage';
import SearchResults from '../pages/public/SearchResults';
import AboutPage from '../pages/public/AboutPage';
import ContactPage from '../pages/public/ContactPage';

// Auth Pages
import RoleSelectionPage from '../pages/auth/RoleSelectionPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';

// Dashboard Pages
import SchoolDashboard from '../pages/dashboard/SchoolDashboard';
import AdminPanel from '../components/forms/AdminPanel';

export default function AppRoutes() {
  const { currentRole, isAdmin } = useAuth();
  const location = useLocation();

  const isAuthorizedToArticlePost = isAdmin || currentRole === 'student_reporter';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.15 }}
        className="w-full text-left"
        id="routes-animated-content"
      >
        <Routes location={location}>
          {/* Public Routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/schools" element={<SchoolDirectory />} />
          <Route path="/schools/:slug" element={<SchoolProfile />} />
          <Route path="/news" element={<NewsFeed />} />
          <Route path="/news/:slug" element={<ArticlePage />} />
          <Route path="/categories/:category" element={<CategoryPage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<RoleSelectionPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<SchoolDashboard />} />
          <Route path="/dashboard/articles" element={<SchoolDashboard activeTab="articles" />} />
          <Route 
            path="/dashboard/articles/create" 
            element={
              isAuthorizedToArticlePost ? (
                <div className="max-w-4xl mx-auto">
                  <AdminPanel 
                    onPublishArticle={() => {}} 
                    onSuccessRedirect={() => {}} 
                  />
                </div>
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          <Route path="/dashboard/articles/edit/:id" element={<SchoolDashboard activeTab="articles" />} />
          <Route path="/dashboard/school-profile" element={<SchoolDashboard activeTab="profile" />} />
          <Route path="/dashboard/users" element={<SchoolDashboard activeTab="users" />} />
          <Route path="/dashboard/submissions" element={<SchoolDashboard activeTab="submissions" />} />
          <Route path="/dashboard/moderation" element={<SchoolDashboard activeTab="moderation" />} />
          <Route path="/dashboard/settings" element={<SchoolDashboard activeTab="settings" />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
