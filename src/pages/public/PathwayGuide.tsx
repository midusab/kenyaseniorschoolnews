import React, { useState } from 'react';
import { MOCK_PATHWAYS, MOCK_SCHOOLS } from '../../data/mockData';
import { Compass, GraduationCap, CheckCircle2, ChevronRight, BookOpen, Trophy, Target, Building } from 'lucide-react';

export default function PathwayGuide() {
  const [selectedPathway, setSelectedPathway] = useState<'STEM' | 'Social Sciences' | 'Arts & Sports Science'>('STEM');

  // State for Interactive Pathway Predictor
  const [studentInterests, setStudentInterests] = useState<string[]>([]);
  const [careerGoal, setCareerGoal] = useState('');
  const [grade9ScienceScore, setGrade9ScienceScore] = useState<number>(75);
  const [predictedResult, setPredictedResult] = useState<{
    pathwayId: 'STEM' | 'Social Sciences' | 'Arts & Sports Science';
    matchPercent: number;
    explanation: string;
    suggestedCombo: string;
    compatibleSchools: string[];
  } | null>(null);

  const interestOptions = [
    { value: 'coding', label: 'Coding, Electronics & AI' },
    { value: 'agric', label: 'Agribusiness & Farm Tech' },
    { value: 'aviation', label: 'Aerodynamics & Flight Mechanics' },
    { value: 'debate', label: 'Public Speaking, Law & Debate' },
    { value: 'writing', label: 'Literature, Languages & Journalism' },
    { value: 'theater', label: 'Drama, Music & Theater' },
    { value: 'athletics', label: 'Track Running, Rugby & Anatomy' },
    { value: 'arts', label: 'Sculpting, Drawing & Visual Arts' }
  ];

  const handleToggleInterest = (interest: string) => {
    if (studentInterests.includes(interest)) {
      setStudentInterests(studentInterests.filter((i) => i !== interest));
    } else {
      setStudentInterests([...studentInterests, interest]);
    }
  };

  const handlePredictPathway = (e: React.FormEvent) => {
    e.preventDefault();

    let stemScore = 0;
    let socialScore = 0;
    let artsScore = 0;

    studentInterests.forEach(interest => {
      if (['coding', 'agric', 'aviation'].includes(interest)) stemScore += 30;
      if (['debate', 'writing'].includes(interest)) socialScore += 30;
      if (['theater', 'athletics', 'arts'].includes(interest)) artsScore += 35;
    });

    const lowerGoal = careerGoal.toLowerCase();
    if (lowerGoal.includes('eng') || lowerGoal.includes('doctor') || lowerGoal.includes('doc') || lowerGoal.includes('sci') || lowerGoal.includes('tech') || lowerGoal.includes('code') || lowerGoal.includes('pilot')) {
      stemScore += 40;
    } else if (lowerGoal.includes('law') || lowerGoal.includes('judge') || lowerGoal.includes('write') || lowerGoal.includes('polit') || lowerGoal.includes('news') || lowerGoal.includes('history')) {
      socialScore += 40;
    } else if (lowerGoal.includes('sport') || lowerGoal.includes('coach') || lowerGoal.includes('act') || lowerGoal.includes('sing') || lowerGoal.includes('art') || lowerGoal.includes('film') || lowerGoal.includes('run')) {
      artsScore += 40;
    }

    if (grade9ScienceScore >= 70) {
      stemScore += 20;
    } else {
      socialScore += 10;
      artsScore += 10;
    }

    if (stemScore === 0 && socialScore === 0 && artsScore === 0) {
      stemScore = 50;
    }

    let finalPathwayId: 'STEM' | 'Social Sciences' | 'Arts & Sports Science' = 'STEM';
    let highestScore = stemScore;

    if (socialScore > highestScore) {
      highestScore = socialScore;
      finalPathwayId = 'Social Sciences';
    }
    if (artsScore > highestScore) {
      highestScore = artsScore;
      finalPathwayId = 'Arts & Sports Science';
    }

    const calculatedMatch = Math.min(99, Math.max(60, highestScore + (grade9ScienceScore / 4)));

    let suggestedCombo = '';
    let explanation = '';
    
    if (finalPathwayId === 'STEM') {
      if (studentInterests.includes('aviation')) {
        suggestedCombo = 'Aviation Technology & Pure Sciences (Physics, Chemistry, Maths, Aviation Tech)';
        explanation = 'Your love for aviation and aerodynamics matches perfectly with the STEM Aviation specialty offered at certified centers like Mang\'u.';
      } else if (studentInterests.includes('agric')) {
        suggestedCombo = 'Agribusiness Science & Applied Chemistry (Biology, Agriculture, Chemistry, Business)';
        explanation = 'You are set to ride the modern agricultural wave in Kenya, using scientific methods to transform environmental conservation.';
      } else {
        suggestedCombo = 'Pure Engineering Specialty (Advanced Mathematics, Physics, Chemistry, Computer Science)';
        explanation = 'Excellent analytical traits. This STEM combination qualifies you for architectural, cyber security, and software tech routes.';
      }
    } else if (finalPathwayId === 'Social Sciences') {
      if (studentInterests.includes('writing')) {
        suggestedCombo = 'Global legal & Foreign Languages (History, Literature, French/German, Geography)';
        explanation = 'Recommended for global diplomats, policy authors, and legal minds. Your focus will be on rhetoric, constitutional citizenship, and language structures.';
      } else {
        suggestedCombo = 'Business, Economics & Digital Media (Business Studies, Geography, History, Mathematics)';
        explanation = 'Perfect match for startup innovators, corporate strategists, and financial analysts in the East African Community market.';
      }
    } else {
      if (studentInterests.includes('athletics')) {
        suggestedCombo = 'Sports Management & Athletics (Anatomy, Physics, PE, Biology)';
        explanation = 'This pathway combines biology theory with physical kinesiology. Perfect to prepare for professional coaching and international sports management.';
      } else {
        suggestedCombo = 'Performing Arts & Content Tech (Drama, Music, Literature, French)';
        explanation = 'Harnessing the lucrative digital creative economy. You study visual design, film storytelling, and dramatic composition as certified subjects.';
      }
    }

    const compatibleSchools = MOCK_SCHOOLS
      .filter((s) => s.certifiedPathways.includes(finalPathwayId))
      .map((s) => s.name);

    setPredictedResult({
      pathwayId: finalPathwayId,
      matchPercent: Math.round(calculatedMatch),
      explanation,
      suggestedCombo,
      compatibleSchools
    });
  };

  const currentPathwayData = MOCK_PATHWAYS.find((p) => p.id === selectedPathway)!;

  return (
    <div className="space-y-8 animate-fade-in" id="cbe-pathway-guide-section">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 to-blue-800 p-6 text-white shadow-md sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-900/60 px-3 py-1 text-xs font-semibold text-emerald-300">
            <Compass className="h-3.5 w-3.5" /> GRADE 10 SELECTION PORTAL
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Riding the CBC Senior School Wave
          </h2>
          <p className="mt-2 text-sm text-blue-105/90 leading-relaxed">
            The traditional secondary model has transformed. Students now choose certified pathways that match their strengths, preparing directly for university degrees and the regional creative/technical job markets.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-12 translate-y-12 select-none">
          <Compass className="h-64 w-64" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3" id="pathway-cards-grid">
        {MOCK_PATHWAYS.map((path) => {
          const isActive = selectedPathway === path.id;
          return (
            <button
              key={path.id}
              onClick={() => setSelectedPathway(path.id)}
              className={`text-left rounded-xl p-5 transition-all outline-none border cursor-pointer ${
                isActive
                  ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-500'
                  : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className={`inline-flex rounded-lg p-2.5 text-xs font-bold leading-none ${
                  path.id === 'STEM' ? 'bg-blue-50 text-blue-700' :
                  path.id === 'Social Sciences' ? 'bg-red-50 text-red-955' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {path.id}
                </span>
                {isActive && <CheckCircle2 className="h-5 w-5 text-blue-600" />}
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-gray-900">{path.name}</h3>
              <p className="mt-2 line-clamp-2 text-xs text-gray-500 leading-relaxed">{path.description}</p>
              <div className="mt-4 flex items-center text-xs font-semibold text-blue-600">
                <span>View Certified Curriculums</span>
                <ChevronRight className="ml-1 h-3 w-3" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-xs" id="selected-pathway-detail-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-gray-100 pb-5">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest font-mono">Certified Syllabus Overview</span>
            <h3 className="font-display text-xl font-bold text-gray-900">{currentPathwayData.name}</h3>
          </div>
          <div className="rounded-lg bg-emerald-50 px-3.5 py-1.5 text-xs text-emerald-800 italic border border-emerald-150">
            "{currentPathwayData.ministryQuote}"
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h4 className="flex items-center gap-1.5 text-sm font-bold text-gray-800">
                <BookOpen className="h-4 w-4 text-blue-600" /> Core Assessed Subjects
              </h4>
              <ul className="mt-2 space-y-1.5">
                {currentPathwayData.coreSubjects.map((sub, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    <span>{sub}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="flex items-center gap-1.5 text-sm font-bold text-gray-800">
                <Compass className="h-4 w-4 text-blue-600" /> Pathway Specializations
              </h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {currentPathwayData.trackSpecializations.map((spec, i) => (
                  <span key={i} className="rounded bg-sky-50 px-2 py-1 text-[11px] font-medium text-sky-700 border border-sky-100">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-xl bg-gray-50 p-4 border border-gray-100">
            <div>
              <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider font-mono">Admission Placement Metric</h4>
              <p className="mt-1 text-xs text-gray-650 leading-relaxed font-sans">
                {currentPathwayData.selectionCriteria}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider font-mono">Regional Career Opportunities</h4>
              <div className="mt-2 flex flex-wrap gap-1.5 font-sans">
                {currentPathwayData.careerProspects.map((cp, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <Trophy className="h-3 w-3 text-amber-500 shrink-0" />
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-700 border border-slate-200">
                      {cp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50/20 p-6 md:p-8" id="pathway-predictor-widget">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-blue-700" />
            <h3 className="font-display text-lg font-bold text-blue-950">
              Interactive CBC Pathway Predictor
            </h3>
          </div>
          <p className="mt-1 text-xs text-gray-650">
            For Grade 9 candidates, parents, and counselors. Enter interests, career thoughts, and recent scores to discover matched paths and combination ideas.
          </p>

          <form onSubmit={handlePredictPathway} className="mt-6 space-y-6">
            <div>
              <label className="text-xs font-bold text-blue-900 uppercase">1. What activities and topics do you enjoy most?</label>
              <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {interestOptions.map((opt) => {
                  const selected = studentInterests.includes(opt.value);
                  return (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => handleToggleInterest(opt.value)}
                      className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-left text-xs transition-colors cursor-pointer ${
                        selected
                          ? 'border-blue-600 bg-blue-600 text-white font-medium shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {selected && <CheckCircle2 className="h-4 w-4 text-emerald-300" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-blue-900 uppercase">2. Dream Profession</label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineer, Doctor, Lawyer, Actor..."
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-blue-900 uppercase flex justify-between">
                  <span>3. Grade 9 Assessment Score (%):</span>
                  <span className="text-blue-700 font-mono font-bold">{grade9ScienceScore}%</span>
                </label>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={grade9ScienceScore}
                  onChange={(e) => setGrade9ScienceScore(Number(e.target.value))}
                  className="mt-2.5 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-blue-200 accent-blue-700"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>Below Average (40%)</span>
                  <span>Distinction (100%)</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto rounded-lg bg-blue-600 hover:bg-blue-800 px-5 py-2.5 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Analyze My Best Pathway Layout
            </button>
          </form>

          {predictedResult && (
            <div className="mt-8 rounded-xl border border-red-200 bg-red-50/30 p-5 shadow-xs animate-fade-in text-slate-800" id="advisor-results-panel">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-bold text-red-900 uppercase tracking-wider font-mono border border-red-250">
                <Target className="h-3.5 w-3.5" /> Advisor Analysis
              </span>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="font-display text-base font-bold text-slate-900">
                    Recommended Pathway: <span className="text-blue-800">{predictedResult.pathwayId}</span>
                  </h4>
                  <p className="text-xs text-slate-550">
                    Matching Probability: <span className="text-emerald-700 font-mono font-bold">{predictedResult.matchPercent}% Match</span>
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <p className="text-xs text-slate-700 leading-relaxed font-sans border-l-2 border-blue-500 pl-3">
                  {predictedResult.explanation}
                </p>

                <div className="rounded-lg bg-white p-3.5 border border-red-250">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">Recommended Subject Combo:</span>
                  <p className="text-xs font-medium text-slate-900 mt-1">{predictedResult.suggestedCombo}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">Certified Top Senior Schools for this track:</span>
                  <div className="mt-2 flex flex-wrap gap-1.5 font-sans">
                    {predictedResult.compatibleSchools.map((sch, idx) => (
                      <span key={idx} className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-800 border border-blue-200 font-medium flex items-center gap-1">
                        <Building className="h-3 w-3" /> {sch}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-550 mt-1.5">
                    *Ask your Junior High school counselor to register KSSNN certificates during portal linkage.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
