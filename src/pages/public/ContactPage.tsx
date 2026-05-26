import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
    setName('');
    setEmail('');
    setSchool('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in" id="contact-portal-page">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
          Reach Out to KSSNN Liaison Offices
        </h1>
        <p className="text-xs text-slate-500 font-sans mt-0.5">
          Submit accredited press card requests, flag bugs, or propose institution registration profiles.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Liaison details info */}
        <div className="md:col-span-1 space-y-5">
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
            <h3 className="font-display text-xs font-extrabold uppercase text-slate-400 font-mono tracking-wider">
              Central Desk
            </h3>

            <div className="space-y-3 text-xs text-slate-650 font-sans leading-relaxed">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4.5 w-4.5 text-blue-650" />
                <span>support@kssnn.ke</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4.5 w-4.5 text-blue-650" />
                <span>+254 (0) 20 221199</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4.5 w-4.5 text-blue-650" />
                <span>Jogoo House B, Harambee Avenue, Nairobi</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-3 text-xs text-slate-500 leading-relaxed font-sans">
            <p className="font-bold text-slate-700 font-mono">Student Reporters Note:</p>
            <p>
              To claim specialized writing keys, please register via your school's Editor, who possesses the administrative token.
            </p>
          </div>
        </div>

        {/* Form contact */}
        <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4">
          <h2 className="font-display text-sm sm:text-base font-bold text-slate-950">
            Submit an Inquiry / Request
          </h2>

          {submitted && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-emerald-900 text-xs flex items-center gap-2.5 animate-fade-in">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <strong>Message Dispatched Successfully!</strong> Our Central Desk or County Liaison manager will audit details back shortly.
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Full Name:</label>
                <input
                  type="text"
                  placeholder="e.g. June Wekesa"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded border border-slate-200 p-2.5 text-xs focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Official Email Address:</label>
                <input
                  type="email"
                  placeholder="e.g. wekesa@school.ke"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded border border-slate-200 p-2.5 text-xs focus:border-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Affiliated School (Optional):</label>
              <input
                type="text"
                placeholder="e.g. Kisumu Girls High School"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="rounded border border-slate-200 p-2.5 text-xs focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Your Statement message:</label>
              <textarea
                rows={4}
                placeholder="Give details about your query here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="rounded border border-slate-200 p-2.5 text-xs focus:border-blue-500 outline-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-5 cursor-pointer shadow-3xs flex items-center justify-center gap-1.5 transition-all text-center"
            >
              <Send className="h-4 w-4" />
              <span>Send Inquiry</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
