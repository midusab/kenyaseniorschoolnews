import React, { useState } from 'react';
import { BrowserRouter, NavLink, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/layout/Header';
import AppRoutes from './routes/AppRoutes';
import { 
  Home, Landmark, Newspaper, MapPin, Compass, UserCheck2, FilePlus2, Sparkles, Building2, Radio
} from 'lucide-react';

function AppContent() {
  const { currentRole, isAdmin } = useAuth();
  const isReporter = currentRole === 'student_reporter';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" id="kssnn-root-layout">
      {/* Top Header Branding Component - Automatically connected to Auth Context */}
      <Header />

      {/* Main Dashboard Wrapper */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex-1 w-full space-y-6" id="kssnn-main-content">
        
        {/* View Switcher Controls Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-gray-200 pb-4" id="view-tabs-hub">
          {/* Main Visual Sub-Tabs - Mobile first grid layout with at least 44px tap targets */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap gap-2 w-full lg:w-auto" id="main-view-tabs">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `rounded-xl px-4 py-3.5 text-xs font-bold transition-all flex items-center justify-center lg:justify-start space-x-2 border cursor-pointer min-h-[44px] ${
                isActive
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                  : 'bg-white border-gray-200 text-slate-755 hover:border-blue-300 hover:text-blue-700 hover:bg-slate-50'
              }`}
            >
              {({ isActive }) => (
                <>
                  <Home className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                  <span>Home Hub</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/schools"
              className={({ isActive }) => `rounded-xl px-4 py-3.5 text-xs font-bold transition-all flex items-center justify-center lg:justify-start space-x-2 border cursor-pointer min-h-[44px] ${
                isActive
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                  : 'bg-white border-gray-200 text-slate-755 hover:border-blue-300 hover:text-blue-700 hover:bg-slate-50'
              }`}
            >
              {({ isActive }) => (
                <>
                  <Landmark className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                  <span>Schools</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/news"
              className={({ isActive }) => `rounded-xl px-4 py-3.5 text-xs font-bold transition-all flex items-center justify-center lg:justify-start space-x-2 border cursor-pointer min-h-[44px] ${
                isActive
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                  : 'bg-white border-gray-200 text-slate-755 hover:border-blue-300 hover:text-blue-700 hover:bg-slate-50'
              }`}
            >
              {({ isActive }) => (
                <>
                  <Newspaper className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                  <span>News Bulletin</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/dashboard"
              className={({ isActive }) => `rounded-xl px-4 py-3.5 text-xs font-bold transition-all flex items-center justify-center lg:justify-start space-x-2 border cursor-pointer min-h-[44px] ${
                isActive
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                  : 'bg-white border-gray-200 text-slate-755 hover:border-blue-300 hover:text-blue-700 hover:bg-slate-50'
              }`}
            >
              {({ isActive }) => (
                <>
                  <MapPin className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                  <span>My Dashboard</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/categories/pathway"
              className={({ isActive }) => `rounded-xl px-4 py-3.5 text-xs font-bold transition-all flex items-center justify-center lg:justify-start space-x-2 border cursor-pointer min-h-[44px] ${
                isActive
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                  : 'bg-white border-gray-200 text-slate-755 hover:border-blue-300 hover:text-blue-700 hover:bg-slate-50'
              }`}
            >
              {({ isActive }) => (
                <>
                  <Compass className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                  <span>Categories</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/login"
              className={({ isActive }) => `rounded-xl px-4 py-3.5 text-xs font-bold transition-all flex items-center justify-center lg:justify-start space-x-2 border cursor-pointer min-h-[44px] ${
                isActive
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                  : 'bg-white border-gray-200 text-slate-755 hover:border-blue-300 hover:text-blue-700 hover:bg-slate-50'
              }`}
            >
              {({ isActive }) => (
                <>
                  <UserCheck2 className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                  <span>Account</span>
                </>
              )}
            </NavLink>
          </div>

          {/* Quick administrator launcher */}
          <div className="flex items-center gap-2 font-sans shrink-0 w-full lg:w-auto" id="role-specific-actions-hub">
            {isAdmin ? (
              <NavLink
                to="/dashboard/articles/create"
                className={({ isActive }) => `rounded-xl px-5 py-3.5 text-xs font-bold transition-all inline-flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer w-full lg:w-auto min-h-[44px] ${
                  isActive
                    ? 'bg-red-700 hover:bg-red-800 border border-red-900 text-white'
                    : 'bg-blue-700 hover:bg-blue-805 text-white border border-blue-800'
                }`}
              >
                <div className="inline-block h-2.5 w-2.5 rounded-full bg-white shrink-0"></div>
                <Radio className="h-4 w-4 text-white shrink-0" />
                <span>Compose Official Update</span>
              </NavLink>
            ) : isReporter ? (
              <NavLink
                to="/dashboard/articles/create"
                className={({ isActive }) => `rounded-xl px-5 py-3.5 text-xs font-bold transition-all inline-flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer w-full lg:w-auto min-h-[44px] ${
                  isActive
                    ? 'bg-amber-600 hover:bg-amber-700 border border-amber-705 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-700'
                }`}
              >
                <FilePlus2 className="h-4 w-4 text-white shrink-0" />
                <span>Submit News Draft</span>
              </NavLink>
            ) : (
              <div className="rounded-xl bg-slate-100 border border-gray-150 px-3.5 py-2.5 text-[10.5px] text-slate-650 font-medium leading-relaxed w-full text-center lg:text-left flex items-center justify-center lg:justify-start gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                <span>Accredited Student? Go to <Link to="/register" className="font-bold underline cursor-pointer text-blue-600 hover:text-blue-800">Register</Link> to request drafting keys.</span>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Inner Tab Router */}
        <AppRoutes />

      </main>

      {/* Footer Branding */}
      <footer className="border-t border-red-900/20 bg-slate-950 py-10 px-4 text-center mt-auto font-mono text-[10.5px] text-white/50" id="kssnn-footer">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 bg-red-700 rounded flex items-center justify-center text-white font-bold">K</div>
             <p className="text-left leading-relaxed">© 2026 Kenya Senior School News Network (KSSNN).<br/>Certified Ministry of Education Portal Outlet.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            <span className="hover:text-red-400 cursor-pointer transition-colors">CBE Placement Charter</span>
            <span className="text-slate-800">•</span>
            <span className="hover:text-red-400 cursor-pointer transition-colors">MoE Security Terms</span>
            <span className="text-slate-800">•</span>
            <span className="hover:text-red-400 cursor-pointer transition-colors">Sub-county Linkages</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
