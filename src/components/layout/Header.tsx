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
    <header className="border-b border-blue-100 bg-white shadow-xs" id="kssnn-header">
      {/* Top Ministry Portal Tape */}
      <div className="bg-blue-900 px-4 py-2 text-xs text-blue-100 sm:px-6 md:flex md:items-center md:justify-between" id="top-portal-strip">
        <div className="flex items-center space-x-2 font-mono">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
          <span className="text-emerald-300">MOE & CBENT CERTIFIED DIGITAL PORTAL</span>
        </div>
        <div className="mt-1 flex items-center justify-between space-x-4 font-mono sm:mt-0 md:justify-end">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3.5 w-3.5 text-blue-200" />
            <span>Nairobi HQ: 2026-05-26 | {timeStr || '9:21 AM'}</span>
          </div>
          <span className="hidden leading-none text-blue-450 md:inline">|</span>
          <span className="text-emerald-450 font-semibold flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> VERIFIED OUTLET
          </span>
        </div>
      </div>

      {/* Main Branding Header Row */}
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8" id="header-brand-section">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                <Radio className="h-5.5 w-5.5 text-emerald-300" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold tracking-tight text-blue-950 sm:text-3xl">
                  KSSNN <span className="text-blue-600 font-normal">News Network</span>
                </h1>
                <p className="text-xs text-gray-500 max-w-md">
                  Kenya Senior School News Network — Official updates, sports, and CBC pathways
                </p>
              </div>
            </div>
          </div>

          {/* Role selector dropdown wrapper */}
          <div className="w-full sm:w-auto flex flex-col items-start gap-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono flex items-center gap-1">
              <Users className="h-3 w-3 text-blue-500" /> Select Your Account View:
            </span>
            <div className="relative inline-block w-full sm:w-64">
              <select
                id="role-selector-dropdown"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-blue-900 shadow-xs outline-hidden transition hover:border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-blue-800 font-medium">
              Mode: {roles.find((r) => r.id === currentRole)?.desc}
            </p>
          </div>
        </div>
      </div>

      {/* Real-time Ticker Ribbon */}
      <div className="bg-red-700 px-4 py-2 border-y border-red-800/20 text-xs font-medium text-white" id="announcement-ticker-ribbon">
        <div className="mx-auto max-w-7xl flex items-center space-x-3">
          <span className="flex items-center space-x-1 uppercase text-[10px] font-mono tracking-wider font-bold bg-white text-red-700 rounded px-2 py-0.5 whitespace-nowrap">
            <Radio className="h-3 w-3 inline" /> BREAKING UPDATES
          </span>
          <div className="overflow-hidden relative w-full h-5">
            <div className="absolute left-0 top-0 w-full transition-all duration-500 ease-in-out">
              <p className="truncate hover:underline cursor-pointer">
                {tickers[tickerIndex]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
