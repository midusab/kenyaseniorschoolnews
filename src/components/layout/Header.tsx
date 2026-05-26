import React, { useState, useEffect } from 'react';
import { ShieldCheck, Calendar, Users, Award, Radio } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export default function Header() {
  const { currentRole, setCurrentRole } = useAuth();
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-KE', { timeZone: 'Africa/Nairobi' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const roles = [
    { id: 'public_reader' as UserRole, label: 'Public Reader', desc: 'Discover school news, events & talent' },
    { id: 'student_reporter' as UserRole, label: 'Student Reporter', desc: 'Draft articles and report co-curricular achievements' },
    { id: 'editor' as UserRole, label: 'Editor', desc: 'Review draft posts and curate regional updates' },
    { id: 'school_admin' as UserRole, label: 'School Admin', desc: 'Manage school details, principal profile, and pathways' },
    { id: 'super_admin' as UserRole, label: 'Super Admin', desc: 'Manage platform and register certified institutions' }
  ];

  const tickers = [
    "MoE Alert: Grade 10 Selection opens mid-September. Verify school pathway certifications.",
    "Sports Update: Maseno School rugby team qualifies for National KSSSA finals in Nyeri.",
    "STEM Peak: Kapsabet Boys automated weeding robot wins sub-county Innovation Congress.",
    "Scholarship Climax: Wings to Fly application window officially active. Deadline: Dec 15.",
    "Arts Gala: Kenya High School sweep drama awards with 'The Silent Echoes' play."
  ];

  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const tInterval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickers.length);
    }, 6000);
    return () => clearInterval(tInterval);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-xl shadow-liquid" id="kssnn-header">
      {/* Top Ministry Portal Tape */}
      <div className="glass-liquid-dark px-4 py-2 text-xs text-blue-100 sm:px-6 md:flex md:items-center md:justify-between" id="top-portal-strip">
        <div className="flex items-center space-x-2 font-mono">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
          <span className="text-emerald-300 font-bold tracking-tight">MOE & CBENT CERTIFIED DIGITAL PORTAL</span>
        </div>
        <div className="mt-1 flex items-center justify-between space-x-4 font-mono sm:mt-0 md:justify-end">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3.5 w-3.5 text-blue-200" />
            <span>Nairobi HQ: 2026-05-26 | {timeStr || '9:21 AM'}</span>
          </div>
          <span className="hidden leading-none text-blue-450 md:inline">|</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" /> VERIFIED OUTLET
          </span>
        </div>
      </div>

      {/* Main Branding Header Row */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8" id="header-brand-section">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center space-x-3">
              <div className="liquid-shine flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20">
                <Radio className="h-6 w-6 text-emerald-300" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-black tracking-tighter text-slate-900 sm:text-3xl">
                  KSSNN <span className="text-blue-600 font-medium">Network</span>
                </h1>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">
                  Verified Senior School Broadcast
                </p>
              </div>
            </div>
          </div>

          {/* Role selector dropdown wrapper */}
          <div className="w-full sm:w-auto flex flex-col items-start gap-1.5">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] font-mono flex items-center gap-1.5">
              <Users className="h-3 w-3 text-blue-500" /> Perspective Engine
            </span>
            <div className="relative inline-block w-full sm:w-72">
              <select
                id="role-selector-dropdown"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                className="block w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-xs font-bold text-slate-800 shadow-sm backdrop-blur-md transition-all hover:border-blue-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Ticker Ribbon */}
      <div className="glass-liquid border-y border-blue-100/30 px-4 py-2.5 text-[11px] font-bold text-slate-800" id="announcement-ticker-ribbon">
        <div className="mx-auto max-w-7xl flex items-center space-x-4">
          <span className="flex items-center space-x-1.5 uppercase text-[9px] font-mono tracking-widest font-black bg-blue-600 text-white rounded-full px-3 py-1 whitespace-nowrap shadow-md shadow-blue-600/20">
            <Radio className="h-3 w-3 inline" /> LIVE FEED
          </span>
          <div className="overflow-hidden relative w-full h-5 flex items-center">
            <div className="absolute left-0 w-full transition-all duration-700 ease-in-out">
              <p className="truncate text-slate-600 font-medium tracking-tight italic">
                "{tickers[tickerIndex]}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>

  );
}
