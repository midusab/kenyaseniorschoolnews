import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleService } from '../../services/articleService';
import { schoolService } from '../../services/schoolService';
import { NewsArticle, School } from '../../types';
import { Search, MapPin, Grid, Compass, BookOpen, Clock, ShieldCheck, ArrowUpRight, HelpCircle, Radio, Sparkles } from 'lucide-react';
import Loader from '../../components/ui/Loader';

interface HomepageProps {
  // Navigation props replaced by local navigate hook for React Router compatibility
}

export default function Homepage({}: HomepageProps) {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountyFilter, setSelectedCountyFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      articleService.getArticles(),
      schoolService.getSchools()
    ]).then(([articlesData, schoolsData]) => {
      setArticles(articlesData);
      setSchools(schoolsData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loader label="Retrieving latest portal broadcast..." size={32} className="py-32" />;
  }

  // Helper and data mapping
  const activeCounties = ['Nairobi', 'Kiambu', 'Kisumu', 'Nandi', 'Bungoma'];

  // Search by school name, county, news title, category
  const filteredArticles = articles.filter((art) => {
    // Look up school county
    const schoolCounty = schools.find((s) => s.id === art.schoolId)?.county || 'National HQ';
    const matchesSearch =
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schoolCounty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCounty = selectedCountyFilter === 'all' || schoolCounty.toLowerCase() === selectedCountyFilter.toLowerCase();

    return matchesSearch && matchesCounty;
  });

  // Featured and latest definitions
  const featuredArticle = filteredArticles.find((art) => art.isVerified && art.image) || filteredArticles[0];
  const latestArticles = filteredArticles.filter((art) => art.id !== featuredArticle?.id).slice(0, 3);

  const handleSearchExample = (query: string) => {
    setSearchTerm(query);
  };

  const executeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in relative px-1 lg:px-4" id="homepage-container">
      {/* Background radial accent for depth */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-100/30 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute top-1/2 -right-32 w-80 h-80 bg-emerald-100/20 rounded-full blur-[100px] -z-10"></div>

      {/* 2. Search Bar & Suggestions Banner - Liquid Glass Style */}
      <div className="rounded-[2.5rem] glass-liquid p-8 sm:p-12 shadow-liquid relative overflow-hidden group" id="homepage-search-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-red-600/5"></div>
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl group-hover:bg-blue-300/30 transition-colors duration-1000"></div>
        
        <div className="relative max-w-2xl space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full glass-liquid-dark px-4 py-1.5 text-[10px] font-black text-white font-mono border-white/20 shadow-lg tracking-widest">
            <Radio className="h-3.5 w-3.5 text-emerald-400" /> SYSTEM STATUS: BROADCASTING
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tighter leading-[0.95] text-slate-900">
            Intelligent <span className="text-blue-600">School News</span> Network for 2026.
          </h2>
          <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-lg">
            A fluid, real-time portal for verified school updates, Grade 10 CBC pathway certificates, and certified institution registrations.
          </p>

          {/* Search container */}
          <form onSubmit={executeSearch} className="relative mt-8" id="homepage-search-input-box">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder='Search ecosystem: "Maseno School", "STEM Pathway", "Kitale"...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-white/40 bg-white/60 backdrop-blur-md py-4.5 pl-12 pr-6 text-sm font-bold text-slate-900 placeholder-slate-400 focus:border-blue-500/50 focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none shadow-liquid transition-all"
            />
          </form>

          {/* Suggestions row */}
          <div className="flex flex-wrap items-center gap-3 pt-3 text-[10px]" id="quick-searches-list">
            <span className="text-slate-400 font-extrabold uppercase tracking-widest">Trending Hubs:</span>
            {['Alliance', 'STEM', 'Maseno', 'Innovation'].map((tag) => (
              <button
                key={tag}
                onClick={() => handleSearchExample(tag)}
                className="rounded-full glass-liquid px-4 py-1.5 font-bold text-slate-700 hover:text-blue-700 hover:border-blue-400 transition-all cursor-pointer shadow-sm"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Workspace Section: Home Grid Layout */}
      <div className="grid gap-8 lg:grid-cols-12" id="homepage-content-grid">
        {/* Left/Middle Column: News Flow (Featured & Latest) */}
        <div className="lg:col-span-8 space-y-10" id="news-flow-section">
          {/* 3. Featured News Article */}
          {featuredArticle && (
            <div className="space-y-6" id="section-featured-headline">
              <div className="flex items-center justify-between border-b border-slate-100/50 pb-3">
                <h3 className="font-display text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]"></span>
                  GLOBAL BROADCAST SELECTION
                </h3>
                <button
                  onClick={() => navigate('/news')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-all hover:gap-2"
                >
                  Explore Bulletin <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 backdrop-blur-md shadow-liquid group transition-all duration-500 hover:shadow-shadow-liquid-hover">
                {featuredArticle.image && (
                  <div className="relative h-64 sm:h-96 bg-slate-100 overflow-hidden">
                    <img
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                    <div className="absolute top-6 left-6 flex gap-2">
                      <div className="glass-liquid py-1.5 px-4 text-white font-mono font-black text-[9px] uppercase rounded-full tracking-[0.1em] flex items-center gap-2 shadow-xl border-white/30">
                         <Sparkles className="h-3 w-3 text-emerald-300" /> FEATURED SELECTION
                      </div>
                    </div>
                  </div>
                )}
                <div className="p-8 space-y-5">
                  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    <span className="bg-blue-600 text-white rounded-full px-4 py-1 shadow-lg shadow-blue-500/20">{featuredArticle.category}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                    <span>{featuredArticle.date}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                    <span className="text-emerald-600 flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {schools.find(s => s.id === featuredArticle.schoolId)?.county || 'Nairobi'}</span>
                  </div>

                  <h4 className="font-display text-2xl sm:text-4xl font-black tracking-tighter text-slate-900 leading-[1.1] group-hover:text-blue-700 transition-colors">
                    {featuredArticle.title}
                  </h4>
                  <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-medium line-clamp-3">
                    {featuredArticle.summary}
                  </p>

                  <div className="pt-6 border-t border-slate-100/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-400">
                        {featuredArticle.authorName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{featuredArticle.schoolName}</p>
                        <p className="text-[10px] font-bold text-slate-400">Broadcaster: {featuredArticle.authorName}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/news/${featuredArticle.id}`)}
                      className="liquid-shine rounded-2xl bg-slate-950 hover:bg-black text-white font-bold text-xs px-8 py-4 shadow-xl transition-all cursor-pointer flex items-center gap-2 group/btn active:scale-95"
                    >
                      <span>Read Bulletin</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. Latest News Feed list */}
          <div className="space-y-6" id="section-latest-stories">
            <h3 className="font-display text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
              RECENT BROADCASTS SELECTION ({filteredArticles.length})
            </h3>

            {latestArticles.length === 0 && !featuredArticle ? (
              <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white/40 backdrop-blur-sm p-12 text-center" id="homepage-empty-state">
                <HelpCircle className="mx-auto h-12 w-12 text-slate-300" />
                <h4 className="mt-4 text-sm font-bold text-slate-900">No School bulletins match your search</h4>
                <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                  Try checking other keywords or clear search filter to see accredited school bulletins.
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 rounded-xl bg-blue-50 text-blue-800 text-xs font-bold px-6 py-3 hover:bg-blue-100 transition-all cursor-pointer"
                >
                  Clear Search Filter
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-1" id="latest-news-stack">
                {latestArticles.map((art) => {
                  const sCounty = schools.find((s) => s.id === art.schoolId)?.county || 'National HQ';
                  return (
                    <div
                      key={art.id}
                      className="rounded-[1.5rem] border border-white/60 bg-white/40 backdrop-blur-md p-5 flex flex-col sm:flex-row gap-5 hover:shadow-liquid transition-all duration-300 hover:-translate-y-1 group"
                    >
                      {art.image && (
                        <div className="h-32 w-full sm:w-48 bg-slate-100 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                          <img
                            src={art.image}
                            alt={art.title}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center gap-2.5 text-[9px] font-black font-mono text-slate-400 tracking-widest uppercase">
                            <span className="text-blue-600">{art.category}</span>
                            <span className="h-1 w-1 rounded-full bg-slate-200"></span>
                            <span className="text-emerald-600">{sCounty}</span>
                            <span className="h-1 w-1 rounded-full bg-slate-200"></span>
                            <span>{art.date}</span>
                          </div>
                          <h5 className="font-display text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1 mt-1 tracking-tight">
                            {art.title}
                          </h5>
                          <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1 leading-relaxed">
                            {art.summary}
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100/40">
                          <span className="text-[10px] font-black text-slate-800 uppercase tracking-tighter block max-w-xs truncate">{art.schoolName}</span>
                          <button
                            onClick={() => navigate(`/news/${art.id}`)}
                            className="rounded-full bg-slate-100 group-hover:bg-blue-600 px-4 py-2 text-[10px] font-black text-slate-900 group-hover:text-white transition-all cursor-pointer uppercase tracking-widest shadow-sm"
                          >
                            Read More
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side Column: Fast Widgets */}
        <div className="lg:col-span-4 space-y-10" id="right-fast-widgets">
          {/* 5. School Categories / CBE Pathways */}
          <div className="rounded-[2rem] border border-white/60 bg-white/40 backdrop-blur-md p-6 shadow-liquid space-y-5" id="section-cbe-categories">
            <h3 className="font-display text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase flex items-center gap-2">
              <Compass className="h-4.5 w-4.5 text-blue-600" />
              PATHWAY AUDITORS
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Explore specialized subjects, track Grade 10 requirements, and search affiliated institutions.
            </p>

            <div className="grid gap-4" id="cbe-pathways-brief-list">
              {[
                {
                  id: 'STEM',
                  label: 'Science & Technology',
                  color: 'hover:border-blue-500 hover:bg-blue-50/40 text-blue-900',
                  badge: 'Pure Science'
                },
                {
                  id: 'Social Sciences',
                  label: 'Social Sciences',
                  color: 'hover:border-emerald-500 hover:bg-emerald-50/40 text-emerald-900',
                  badge: 'Law & Ethics'
                },
                {
                  id: 'Arts & Sports Science',
                  label: 'Arts & Sports',
                  color: 'hover:border-red-500 hover:bg-red-50/40 text-red-900',
                  badge: 'Creative'
                }
              ].map((path) => (
                <div
                  key={path.id}
                  onClick={() => navigate(`/categories/${path.id}`)}
                  className={`p-5 rounded-2xl border border-slate-100/50 bg-white/50 cursor-pointer transition-all hover:scale-[1.02] active:scale-98 ${path.color} group shadow-sm`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 font-mono">{path.badge}</span>
                    <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-current transition-colors" />
                  </div>
                  <h4 className="text-sm font-black font-display tracking-tight">
                    {path.label}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          {/* 6. County Filter & Stat Index */}
          <div className="rounded-[2rem] border border-white/60 bg-white/40 backdrop-blur-md p-6 shadow-liquid space-y-5" id="section-county-filters">
            <h3 className="font-display text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase flex items-center gap-2">
              <MapPin className="h-4.5 w-4.5 text-emerald-600" />
              COUNTY EXPLORER
            </h3>
            
            <div className="flex flex-col gap-3" id="county-quick-filters">
              {['all', ...activeCounties].map((ct) => {
                const countOfSchools = ct === 'all' ? schools.length : schools.filter(s => s.county.toLowerCase() === ct.toLowerCase()).length;
                const isSelected = selectedCountyFilter === ct;
                return (
                  <button
                    key={ct}
                    onClick={() => {
                      setSelectedCountyFilter(ct);
                      navigate(`/search?q=${ct}`);
                    }}
                    className={`px-4 py-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                        : 'bg-white/50 border-slate-100 text-slate-800 hover:border-blue-200 hover:bg-white shadow-sm'
                    }`}
                  >
                    <span className="capitalize">{ct === 'all' ? 'All Counties' : `${ct} HQ`}</span>
                    <span className={`px-2 py-0.5 text-[9px] font-black rounded-full font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {countOfSchools}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

