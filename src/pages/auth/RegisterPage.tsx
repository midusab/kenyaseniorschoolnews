import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MOCK_SCHOOLS } from '../../data/mockData';
import { ShieldCheck, UserPlus, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const { setCurrentRole } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student_reporter' | 'editor' | 'school_admin' | 'public_reader'>('student_reporter');
  const [schoolId, setSchoolId] = useState('alliance');
  const [success, setSuccess] = useState(false);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    // Simulate registration
    setSuccess(true);
    setTimeout(() => {
      setCurrentRole(role);
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto my-12 animate-fade-in" id="register-page">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="text-center space-y-1">
          <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900">
            Request Registry Access key
          </h2>
          <p className="text-xs text-slate-500 font-sans">
            Register your profile to align academic & co-curricular drafts.
          </p>
        </div>

        {success ? (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-3">
            <CheckCircle className="h-10 w-10 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="font-bold text-emerald-950 text-sm">Credentials Key Dispatched!</h4>
            <p className="text-xs text-emerald-700 leading-relaxed">
              Generating secure KSSNN profile and digital signature. Taking you to the dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Full Name:</label>
              <input
                type="text"
                placeholder="e.g. Alex Waiganjo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-blue-500 outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">School Email:</label>
              <input
                type="email"
                placeholder="e.g. alex@school.ke"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-blue-500 outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Security Pin / Password:</label>
              <input
                type="password"
                placeholder="Choose security PIN code..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-blue-500 outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Requested Role Access:</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="rounded border border-slate-205 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 cursor-pointer"
              >
                <option value="student_reporter">Accredited Student Reporter</option>
                <option value="editor">Sub-county Editor</option>
                <option value="school_admin">Principal / School Admin</option>
                <option value="public_reader">Citizen Reader (Read-Only)</option>
              </select>
            </div>

            {role !== 'public_reader' && (
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Your Base Senior High School:</label>
                <select
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  className="rounded border border-slate-205 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 cursor-pointer"
                >
                  {MOCK_SCHOOLS.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.county})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs py-3 shadow-2xs cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <UserPlus className="h-4 w-4" />
              <span>Generate Profile & Request Access</span>
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-slate-100 flex justify-between text-xs font-sans">
          <Link to="/login" className="text-blue-600 hover:text-blue-800 hover:underline">
            Already possess keys? Login
          </Link>
          <Link to="/forgot-password" className="text-slate-400 hover:text-slate-605">
            Reset PIN
          </Link>
        </div>
      </div>
    </div>
  );
}
