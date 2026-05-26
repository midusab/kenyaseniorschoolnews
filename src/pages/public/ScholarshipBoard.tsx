import React, { useState, useEffect } from 'react';
import { schoolService } from '../../services/schoolService';
import { Scholarship } from '../../types';
import { Award, ShieldCheck, ClipboardCheck, ArrowUpRight, CheckCircle, Goal, Zap, AlertCircle } from 'lucide-react';

export default function ScholarshipBoard() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [candidateScore, setCandidateScore] = useState<number>(70);
  const [selectedSch, setSelectedSch] = useState<string>('wings2fly');
  const [isVulnerable, setIsVulnerable] = useState<boolean>(true);
  const [hasSubCountyForm, setHasSubCountyForm] = useState<boolean>(true);

  useEffect(() => {
    schoolService.getScholarships().then((data) => {
      setScholarships(data);
    });
  }, []);

  const selectedSchData = scholarships.find(s => s.id === selectedSch);

  const calculateEligibilityScore = () => {
    let score = 50;
    if (isVulnerable) score += 30;
    if (hasSubCountyForm) score += 10;
    if (candidateScore >= 75) score += 10;
    return Math.min(100, score);
  };

  const eligibility = calculateEligibilityScore();

  return (
    <div className="space-y-6 animate-fade-in" id="scholarship-board-section">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="font-display text-lg font-bold text-gray-900">National Senior Registry Scholarships</h2>
        <p className="text-xs text-gray-500">
          Track official Ministry and NGO-sponsored fund setups to support disadvantaged student transitions into Grade 10 CBC pathways.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side: Scholarship listings */}
        <div className="lg:col-span-2 space-y-4" id="scholarships-listings">
          {scholarships.map((sch) => {
            const isSelected = selectedSch === sch.id;
            return (
              <div
                key={sch.id}
                onClick={() => setSelectedSch(sch.id)}
                className={`p-5 rounded-xl border transition-all cursor-pointer text-left font-sans ${
                  isSelected
                    ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-500'
                    : 'bg-white border-gray-200 hover:border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    sch.category === 'STEM Specific' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-800'
                  }`}>
                    {sch.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-900 flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 inline text-amber-500 animate-bounce" /> DEADLINE: {sch.deadline}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-base font-bold text-gray-900">{sch.title}</h3>
                <p className="text-xs font-semibold text-gray-500 mt-1">Provider: {sch.provider}</p>

                <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wide block">Scholarship Coverage Value:</span>
                  <p className="text-xs text-slate-800 font-bold mt-0.5">{sch.value}</p>
                </div>

                {isSelected && (
                  <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 animate-fade-in">
                    <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">Core Candidate Requirements:</span>
                    <ul className="space-y-1.5 font-sans">
                      {sch.requirements.map((req, idx) => (
                        <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0 select-none" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-3 flex items-center justify-between">
                      <span className="text-[10px] text-gray-400 italic font-mono">*Applications go directly to school principal desks.</span>
                      <a
                        href={sch.link}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded bg-blue-600 hover:bg-blue-800 px-3 py-1.5 text-xs text-white font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Official Portal</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Side: Suitability simulation calculator */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/20 p-5 font-sans h-fit space-y-5" id="eligibility-advisor-panel">
          <div className="flex items-center space-x-2">
            <ClipboardCheck className="h-5.5 w-5.5 text-blue-700" />
            <h3 className="font-display text-base font-bold text-blue-955 font-semibold">Pre-test suitability Matcher</h3>
          </div>
          <p className="text-xs text-gray-600">
            A quick suitability check simulator for target grants based on eligibility thresholds.
          </p>

          <div className="space-y-4 border-t border-blue-100 pt-4">
            <div className="flex items-start justify-between gap-1.5">
              <div>
                <label className="text-xs font-bold text-blue-950 block">Orphaned / Socio-Economic Vulnerability?</label>
                <span className="text-[10px] text-gray-500">Includes child head houses or poverty reports.</span>
              </div>
              <input
                type="checkbox"
                checked={isVulnerable}
                onChange={(e) => setIsVulnerable(e.target.checked)}
                className="h-4.5 w-4.5 accent-blue-600 shadow-3xs cursor-pointer mt-1"
              />
            </div>

            <div className="flex items-start justify-between gap-1.5">
              <div>
                <label className="text-xs font-bold text-blue-905 block">Signed Sub-county Education Form?</label>
                <span className="text-[10px] text-gray-500">Certified by local educational officer.</span>
              </div>
              <input
                type="checkbox"
                checked={hasSubCountyForm}
                onChange={(e) => setHasSubCountyForm(e.target.checked)}
                className="h-4.5 w-4.5 accent-blue-600 shadow-3xs cursor-pointer mt-1"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-blue-950 flex justify-between">
                <span>Grade 9 Score Trend (%):</span>
                <span className="text-blue-700 font-bold font-mono">{candidateScore}%</span>
              </label>
              <input
                type="range"
                min="40"
                max="100"
                value={candidateScore}
                onChange={(e) => setCandidateScore(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer bg-blue-200 accent-blue-700 rounded-lg appearance-none mt-1"
              />
            </div>

            {/* Assessment display */}
            <div className="rounded-lg bg-white p-4 border border-blue-100 shadow-3xs text-center space-y-2">
              <span className="text-[10px] font-bold text-slate-450 font-mono tracking-widest block uppercase">Eligibility Match Assessment:</span>
              <p className="font-display text-2xl font-bold font-mono text-blue-800">{eligibility}% Matching</p>
              
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    eligibility >= 80 ? 'bg-emerald-600' : eligibility >= 60 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${eligibility}%` }}
                ></div>
              </div>

              <p className="text-[10.5px] text-gray-550 leading-relaxed font-sans mt-2">
                {eligibility >= 80 
                  ? <span className="flex items-center gap-1 justify-center"><Goal className="h-3.5 w-3.5 text-emerald-600" /> Highly Preferred candidate. Recommend collecting certificate documentation immediately.</span>
                  : eligibility >= 60 
                  ? <span className="flex items-center gap-1 justify-center"><Zap className="h-3.5 w-3.5 text-amber-600" /> Moderate probability. Requires highly verified recommendation letters.</span>
                  : <span className="flex items-center gap-1 justify-center"><AlertCircle className="h-3.5 w-3.5 text-red-600" /> Low compliance mismatch based on vulnerability markers of target program.</span>}
              </p>
            </div>
          </div>

          <div className="rounded bg-sky-50 text-[10px] text-sky-850 p-3 italic font-sans flex items-start gap-1">
            <ShieldCheck className="h-4.5 w-4.5 text-sky-700 shrink-0" />
            <span>KSSNN verified scholarships update regularly directly from Elimu and EGF official circular sources.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
