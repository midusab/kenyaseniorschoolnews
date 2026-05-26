import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { ShieldCheck, UserCheck2, Compass, Lock, Globe, Circle } from 'lucide-react';

export default function RoleSelectionPage() {
  const { currentRole, setCurrentRole } = useAuth();
  const roles = authService.availableRoles();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in" id="role-selection-view">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="font-display text-lg font-bold text-gray-900">Portal View & Access Controller</h2>
        <p className="text-xs text-gray-500">
          Switch matching perspectives to customize recommendations, check eligible scholarships, or author verified school statements.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((r) => {
          const isSelected = currentRole === r.id;
          return (
            <div
              key={r.id}
              onClick={() => setCurrentRole(r.id)}
              className={`p-5 rounded-xl border transition-all cursor-pointer text-left flex flex-col justify-between h-44 ${
                isSelected
                  ? 'bg-blue-50/55 border-blue-500 shadow-md ring-1 ring-blue-500'
                  : 'bg-white border-gray-150 hover:border-blue-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    {r.id !== 'public_reader' ? <><Lock className="h-3 w-3" /> SECURE</> : <><Globe className="h-3 w-3" /> CITIZEN</>}
                  </span>
                  {isSelected && <UserCheck2 className="h-5 w-5 text-blue-600 animate-pulse" />}
                </div>
                <h3 className="font-display font-semibold text-sm sm:text-base text-gray-900 mt-2">
                  {r.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed font-sans line-clamp-2">
                  {r.desc}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                <span className="text-[10.5px] font-bold text-blue-800 flex items-center gap-1">
                  {isSelected ? <><Circle className="h-2 w-2 fill-current" /> View Active</> : 'Switch Perspective'}
                </span>
                <span className="text-[10px] text-gray-450">
                  {r.id !== 'public_reader' ? 'Verify Permits' : 'Read-Only'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-start space-x-3 text-slate-800 font-sans leading-relaxed text-xs">
        <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-slate-900">National CBC Placement Compliance</h4>
          <p className="text-slate-655 mt-0.5">
            This workspace implements KSSNN guidelines to enable students and counselors to align co-curricular achievements with government allocations across the 47 counties of Kenya. Secure role assertions help verify authenticity.
          </p>
        </div>
      </div>
    </div>
  );
}
