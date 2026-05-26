import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { schoolService } from '../../services/schoolService';
import { articleService } from '../../services/articleService';
import { School, NewsArticle } from '../../types';
import { MapPin, Award, BookOpen, Quote, ShieldCheck, ArrowLeft, ArrowUpRight, Medal, ChevronRight } from 'lucide-react';

export default function SchoolProfile() {
  const { slug } = useParams<{ slug: string }>();
  const [school, setSchool] = useState<School | null>(null);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    Promise.all([
      schoolService.getSchools(),
      articleService.getArticles()
    ])
      .then(([allSchools, allArticles]) => {
        // Find by id or sluggified ID
        const matchedSchool = allSchools.find(
          (s) => s.id.toLowerCase() === slug.toLowerCase()
        );
        setSchool(matchedSchool || null);

        if (matchedSchool) {
          const schoolNews = allArticles.filter(
            (art) => art.schoolId === matchedSchool.id && art.isVerified
          );
          setArticles(schoolNews);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 font-mono text-xs">
        Loading senior school profile...
      </div>
    );
  }

  if (!school) {
    return (
      <div className="py-16 text-center max-w-md mx-auto space-y-4">
        <h3 className="font-display text-lg font-bold text-slate-900">High School Profile Not Found</h3>
        <p className="text-xs text-slate-500 font-sans leading-relaxed">
          The requested school center is either pending accreditation approval or uses a different institutional registry key.
        </p>
        <Link
          to="/schools"
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Schools Directory</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in" id={`school-profile-${school.id}`}>
      {/* Back link */}
      <div>
        <Link
          to="/schools"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 font-semibold"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Schools Directory
        </Link>
      </div>

      {/* Hero Banner Grid */}
      <div className="rounded-2xl border border-slate-250 bg-white p-6 sm:p-8 shadow-xs relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <img
            src={school.logo}
            alt={school.name}
            referrerPolicy="no-referrer"
            className="h-20 w-20 rounded-xl object-cover bg-blue-50 border border-slate-200 shadow-3xs"
          />
          <div className="space-y-1.5">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5" /> VERIFIED REGISTRY CENTER
              </span>
              {school.category === 'National' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-bold text-white border border-red-700 shadow-sm animate-pulse">
                   OFFICIAL NATIONAL CENTER
                </span>
              )}
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
              {school.name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-500 text-xs font-semibold">
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span>{school.county} County</span>
              </div>
              <span>•</span>
              <span>{school.category} Category</span>
              <span>•</span>
              <span className="uppercase font-mono text-[10px]">{school.genderType} Boarding</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left Column: Principal Statement & Pathways */}
        <div className="md:col-span-1 space-y-6">
          {/* Principal details */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
            <h3 className="font-display text-xs font-extrabold uppercase text-slate-400 font-mono tracking-wider">
              Administration
            </h3>
            <div className="rounded-lg bg-slate-50 p-4 border border-slate-100 relative">
              <Quote className="absolute right-3.5 top-3.5 h-6 w-6 text-slate-200" />
              <p className="text-xs font-bold text-slate-850 font-mono">Principal {school.principalName}:</p>
              <p className="text-xs text-slate-600 italic mt-2 leading-relaxed">
                "{school.principalQuote}"
              </p>
            </div>
          </div>

          {/* CBE Placement Pathways */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
            <h3 className="font-display text-xs font-extrabold uppercase text-slate-400 font-mono tracking-wider">
              CBE Pathways Certified
            </h3>
            <div className="flex flex-col gap-2">
              {school.certifiedPathways.map((path, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg border border-sky-100 bg-sky-50/50">
                  <Medal className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-sky-950">{path}</h4>
                    <p className="text-[10px] text-sky-800 leading-relaxed font-sans">
                      Licensed curriculum & resources for this Grade 10 module.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special subject combo tracks */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
            <h3 className="font-display text-xs font-extrabold uppercase text-slate-400 font-mono tracking-wider">
              Highlighted Specialty Combos
            </h3>
            <div className="space-y-2">
              {school.specialCombinationList.map((c, idx) => (
                <div key={idx} className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center gap-2 leading-relaxed font-medium">
                  <ChevronRight className="h-3 w-3 text-emerald-500 shrink-0" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Columns: News Feed belonging to the school */}
        <div className="md:col-span-2 space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="h-4.5 w-4.5 text-blue-600" />
              <span>Official Bulletins & News from {school.name}</span>
            </h2>
          </div>

          {articles.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-white py-12 px-4 text-center text-slate-500 text-xs leading-relaxed">
              No public news reports filed under {school.name} yet. Check back soon for co-curricular updates, championship matches, or academic pathway milestones.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {articles.map((art) => (
                <div
                  key={art.id}
                  className="rounded-xl border border-slate-200 bg-white hover:border-blue-500 transition-all p-4 flex flex-col justify-between"
                >
                  <div className="space-y-1.5 p-1">
                    <div className="flex justify-between items-center gap-2">
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[8.5px] font-bold text-slate-600 uppercase">
                        {art.category}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">{art.date}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-xs line-clamp-1">
                      {art.title}
                    </h3>
                    <p className="text-[10px] text-slate-505 line-clamp-2 leading-relaxed">
                      {art.summary}
                    </p>
                    <div className="text-[9px] text-slate-405 font-mono">
                      By: <span className="font-semibold text-slate-600">{art.authorName}</span> ({art.authorRole})
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-slate-400 text-[10px] font-semibold">{art.likes} likes • {art.views} views</span>
                    <Link
                      to={`/news/${art.id}`}
                      className="inline-flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-800 font-bold"
                    >
                      <span>Read Story</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
