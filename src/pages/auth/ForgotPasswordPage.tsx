import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail('');
  };

  return (
    <div className="max-w-md mx-auto my-16 animate-fade-in" id="forgot-password-page">
      <div className="rounded-2xl border border-slate-205 bg-white p-6 sm:p-8 shadow-xs space-y-5">
        <div className="text-center space-y-1">
          <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900">
            Reset Security PIN
          </h2>
          <p className="text-xs text-slate-500 font-sans">
            Enter your official school email to request a PIN decryption hash.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-6 text-center space-y-3">
            <Mail className="h-10 w-10 text-blue-600 mx-auto animate-pulse" />
            <h4 className="font-bold text-blue-950 text-sm">Decryption Hash Sent</h4>
            <p className="text-xs text-blue-800 leading-relaxed font-sans">
              We have dispatched a security PIN bypass signature to your official school mailbox. Please check your spam folder if it doesn't arrive within 2 minutes.
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-bold"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Your Account Email:</label>
              <input
                type="email"
                placeholder="e.g. david@school.ke"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-blue-500 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs py-3"
            >
              Dispatch Security Decryption Token
            </button>
          </form>
        )}

        {!submitted && (
          <div className="pt-4 border-t border-slate-100 text-center">
            <Link to="/login" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-bold">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Login Switcher
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
