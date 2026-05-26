import React from 'react';
import { Info, Award, Heart, ShieldAlert, GraduationCap, School } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in" id="about-platform-page">
      {/* Hero Header */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-900 to-slate-900 p-8 sm:p-12 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <GraduationCap className="h-10 w-10 text-emerald-400" />
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">
            About Kenya Senior School News Network (KSSNN)
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 font-sans leading-relaxed max-w-xl">
            Empowering academic stakeholders, senior institutions, and talented learners to report competency-based pathway choices, sports development triumphs, and certified administrative bulletins.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1 */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
          <div className="h-10 w-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
            <School className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Official MoE Outlets</h3>
          <p className="text-xs text-slate-500 font-sans leading-relaxed">
            Every senior school registered in this database is cross-checked against county stamps to ensure only authenticated information is posted under registered principal signatures.
          </p>
        </div>

        {/* Card 2 */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
            <Award className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Competency Pathway Focus</h3>
          <p className="text-xs text-slate-500 font-sans leading-relaxed">
            Tracks STEM (Science/Tech/Engineering/Math), Social Sciences, and Creative Arts/Sports pathways to guide Grade 10 students through career selections.
          </p>
        </div>

        {/* Card 3 */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
          <div className="h-10 w-10 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-700">
            <Heart className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Peer-to-Peer Reporting</h3>
          <p className="text-xs text-slate-500 font-sans leading-relaxed">
            Nurtures accredited Student Reporters from Alliance, Kenya High, Mang'u and more to practice digital journalism in local athletic meets and scientific congresses.
          </p>
        </div>
      </div>

      {/* Main text block */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4">
        <h2 className="font-display text-base font-bold text-slate-950 flex items-center gap-1.5">
          <Info className="h-4.5 w-4.5 text-blue-600" />
          <span>Our Vision for CBENT (Competency-Based Educational Network)</span>
        </h2>
        <div className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed space-y-4">
          <p>
            Under the direction of Kenya's educational modernization reforms, secondary learning is transforming into specialized tracks of talent, intellect, and career competency. KSSNN bridges the gap between these classrooms and the public citizen.
          </p>
          <p>
            By establishing digital signatures for principal offices and local student editing teams, each school forms an independent bulletin desk. Whether it's showing off a new aviation lab at Alliance or tracking volleyball division games under sub-county athletic frameworks, this portal is the singular hub.
          </p>
        </div>

        <div className="mt-6 flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 font-medium">
          <ShieldAlert className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Disavowal Notice:</strong> This is a simulation model representing Ministry of Education CBC guidelines. Core institution descriptors, pathways, and sports bulletins are curated here for digital verification workflow training.
          </p>
        </div>
      </div>
    </div>
  );
}
