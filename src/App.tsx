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
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-6" id="view-tabs-hub">
          {/* Main Visual Sub-Tabs - Mobile first grid layout with at least 44px tap targets */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-3 w-full lg:w-auto" id="main-view-tabs">
            {[
              { to: "/", end: true, icon: Home, label: "Home Hub" },
              { to: "/schools", icon: Landmark, label: "Institutions" },
              { to: "/news", icon: Newspaper, label: "Bulletin" },
              { to: "/dashboard", icon: MapPin, label: "Dashboard" },
              { to: "/categories/pathway", icon: Compass, label: "Pathways" },
              { to: "/login", icon: UserCheck2, label: "Account" }
            ].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => `rounded-2xl px-5 py-3 text-[11px] font-black tracking-widest transition-all flex items-center justify-center lg:justify-start space-x-2 border cursor-pointer min-h-[44px] uppercase ${
                  isActive
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/10'
                    : 'glass-liquid border-white/60 text-slate-500 hover:border-blue-400 hover:text-blue-700 hover:bg-white/80 shadow-sm'
                }`}
              >
                {({ isActive }) => {
                  const Icon = link.icon;
                  return (
                    <>
                      <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                      <span>{link.label}</span>
                    </>
                  );
                }}
              </NavLink>
            ))}
          </div>

          {/* Quick administrator launcher */}
          <div className="flex items-center gap-3 font-sans shrink-0 w-full lg:w-auto" id="role-specific-actions-hub">
            {isAdmin ? (
              <NavLink
                to="/dashboard/articles/create"
                className={({ isActive }) => `rounded-2xl px-6 py-3.5 text-[11px] font-black uppercase tracking-widest transition-all inline-flex items-center justify-center space-x-2 shadow-xl cursor-pointer w-full lg:w-auto min-h-[44px] ${
                  isActive
                    ? 'bg-red-700 border-red-800 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-700 shadow-blue-500/10'
                }`}
              >
                <Radio className="h-4 w-4 text-white shrink-0" />
                <span>COMPOSE BROADCAST</span>
              </NavLink>
            ) : isReporter ? (
              <NavLink
                to="/dashboard/articles/create"
                className={({ isActive }) => `rounded-2xl px-6 py-3.5 text-[11px] font-black uppercase tracking-widest transition-all inline-flex items-center justify-center space-x-2 shadow-xl cursor-pointer w-full lg:w-auto min-h-[44px] ${
                  isActive
                    ? 'bg-emerald-700 border-emerald-800 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700 shadow-indigo-500/10'
                }`}
              >
                <FilePlus2 className="h-4 w-4 text-white shrink-0" />
                <span>SUBMIT STORY</span>
              </NavLink>
            ) : (
              <div className="rounded-2xl glass-liquid border-white/60 px-5 py-3 text-[10px] text-slate-500 font-bold leading-relaxed w-full lg:w-auto flex items-center justify-center lg:justify-start gap-2 shadow-sm">
                <Sparkles className="h-4 w-4 text-emerald-500 animate-pulse shrink-0" />
                <span>Accredited? Request <Link to="/register" className="text-blue-600 hover:underline">Draft Keys</Link></span>
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
