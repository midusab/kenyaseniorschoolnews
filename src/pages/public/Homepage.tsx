import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleService } from '../../services/articleService';
import { schoolService } from '../../services/schoolService';
import { NewsArticle, School } from '../../types';
import { Search, MapPin, Grid, Compass, BookOpen, Clock, ShieldCheck, ArrowUpRight, HelpCircle, Radio, Sparkles } from 'lucide-react';

interface HomepageProps {
  onNavigate?: (tab: 'home' | 'schools' | 'news' | 'counties' | 'categories' | 'login' | 'admin') => void;
  onSelectArticle?: (id: string) => void;
  onSelectCounty?: (county: string) => void;
  onSelectCategory?: (category: string) => void;
}

export default function Homepage({ onNavigate, onSelectArticle, onSelectCounty, onSelectCategory }: HomepageProps) {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountyFilter, setSelectedCountyFilter] = useState('all');

  useEffect(() => {
    articleService.getArticles().then((data) => setArticles(data));
    schoolService.getSchools().then((data) => setSchools(data));
  }, []);

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
    <div className="space-y-10 animate-fade-in" id="homepage-container">
      {/* 2. Search Bar & Suggestions Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-900 via-slate-900 to-red-950 text-white p-6 sm:p-10 shadow-lg relative overflow-hidden" id="homepage-search-hero">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(220,38,38,0.12),transparent)]"></div>
        <div className="relative max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white font-mono border border-red-500 shadow-sm">
            <Radio className="h-3.5 w-3.5" /> LIVE: OFFICIAL KSSNN FEED
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Find Kenyan Senior School Updates Instantly
          </h2>
          <p className="text-xs sm:text-sm text-blue-200 leading-relaxed max-w-lg">
            Access verified news bulletins, Grade 10 competence pathway audits, and certified county registrations on a single unified portal.
          </p>

          {/* Search container */}
          <form onSubmit={executeSearch} className="relative mt-6" id="homepage-search-input-box">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder='Search by school name, county, news, or category (e.g., "Maranda", "Nairobi", "Sports")'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-blue-800/80 bg-slate-900/90 py-3.5 pl-11 pr-5 text-sm text-white placeholder-slate-400 focus:border-emerald-400 focus:bg-slate-900 focus:ring-1 focus:ring-emerald-400 outline-none shadow-inner"
            />
          </form>

          {/* Suggestions row to answer: What should I click next? */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs" id="quick-searches-list">
            <span className="text-slate-400 font-medium whitespace-nowrap">Try searching:</span>
            {['Alliance', 'Nairobi', 'Sports', 'Scholarship'].map((tag) => (
              <button
                key={tag}
                onClick={() => handleSearchExample(tag)}
                className="rounded-lg bg-blue-900/60 hover:bg-blue-850 px-3 py-1 font-mono text-[11px] text-emerald-300 border border-blue-800/50 hover:border-emerald-500/30 transition-all cursor-pointer"
              >
                "{tag}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Workspace Section: Home Grid Layout */}
      <div className="grid gap-8 lg:grid-cols-3" id="homepage-content-grid">
        {/* Left/Middle Column: News Flow (Featured & Latest) */}
        <div className="lg:col-span-2 space-y-8" id="news-flow-section">
          {/* 3. Featured News Article */}
          {featuredArticle && (
            <div className="space-y-4" id="section-featured-headline">
              <div className="flex items-center justify-between border-b border-gray-150 pb-2">
                <h3 className="font-display text-sm font-bold tracking-wider text-slate-900 uppercase flex items-center gap-1.5/70">
                  <span className="h-2 w-2 rounded-full bg-red-600"></span>
                  FEATURED BULLETIN
                </h3>
                <button
                  onClick={() => onNavigate('news')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  View All News <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs group transition hover:border-blue-200 hover:shadow-md">
                {featuredArticle.image && (
                  <div className="relative h-60 sm:h-80 bg-slate-100 overflow-hidden">
                    <img
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-102"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>
                    <div className="absolute top-4 left-4 flex gap-2">
                      <div className="bg-emerald-600 text-white font-mono font-bold text-[10px] uppercase rounded px-2.5 py-1 tracking-wider flex items-center gap-1 shadow-md">
                         <Sparkles className="h-3 w-3" /> Featured update
                      </div>
                    </div>
                  </div>
                )}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500 font-semibold">
                    <span className="font-bold text-blue-800 uppercase bg-blue-55 rounded px-2 py-0.5">{featuredArticle.category}</span>
                    <span>•</span>
                    <span>{featuredArticle.date}</span>
                    <span>•</span>
                    <span className="text-emerald-700 flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {schools.find(s => s.id === featuredArticle.schoolId)?.county || 'Nairobi HQ'}</span>
                  </div>

                  <h4 className="font-display text-lg sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-blue-800 transition-colors">
                    {featuredArticle.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans line-clamp-3">
                    {featuredArticle.summary}
                  </p>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900 font-mono block tracking-wide">{featuredArticle.schoolName}</p>
                      <p className="text-[10px] text-slate-500">By. {featuredArticle.authorName} ({featuredArticle.authorRole})</p>
                    </div>
                    <button
                      onClick={() => onSelectArticle(featuredArticle.id)}
                      className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Read Article</span>
                      <BookOpen className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. Latest News Feed list */}
          <div className="space-y-4" id="section-latest-stories">
            <h3 className="font-display text-sm font-bold tracking-wider text-slate-900 uppercase">
              LATEST STORIES FLOW ({filteredArticles.length})
            </h3>

            {latestArticles.length === 0 && !featuredArticle ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center" id="homepage-empty-state">
                <HelpCircle className="mx-auto h-12 w-12 text-gray-300" />
                <h4 className="mt-4 text-sm font-bold text-gray-900">No School bulletins match your search</h4>
                <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
                  Try checking other keywords or clear search filter to see accredited school bulletins.
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 rounded-lg bg-blue-55 text-blue-800 text-xs font-bold px-4 py-2 hover:bg-blue-100 transition-all cursor-pointer"
                >
                  Clear Search Filter
                </button>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-1" id="latest-news-stack">
                {latestArticles.map((art) => {
                  const sCounty = schools.find((s) => s.id === art.schoolId)?.county || 'National HQ';
                  return (
                    <div
                      key={art.id}
                      className="rounded-xl border border-slate-150/50 bg-white p-4 flex flex-col sm:flex-row gap-4 hover:shadow-xs transition hover:border-blue-200 group"
                    >
                      {art.image && (
                        <div className="h-28 w-full sm:w-40 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                          <img
                            src={art.image}
                            alt={art.title}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 font-semibold">
                            <span className="text-blue-900 uppercase font-bold">{art.category}</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-semibold">{sCounty}</span>
                            <span>•</span>
                            <span>{art.date}</span>
                          </div>
                          <h5 className="font-display text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1 mt-1">
                            {art.title}
                          </h5>
                          <p className="text-xs text-slate-500 font-sans line-clamp-2 mt-1">
                            {art.summary}
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                          <span className="text-[10px] font-bold text-slate-700 block max-w-xs truncate">{art.schoolName}</span>
                          <button
                            onClick={() => onSelectArticle(art.id)}
                            className="rounded bg-blue-50 group-hover:bg-blue-600 px-3 py-1.5 text-xs font-semibold text-blue-900 group-hover:text-white transition-colors cursor-pointer"
                          >
                            Read Article
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

        {/* Right Side Column: Fast Filters, Pathways and Counties Quick Access */}
        <div className="space-y-8" id="right-fast-widgets">
          {/* 5. School Categories / CBE Pathways */}
          <div className="rounded-2xl border border-slate-150/60 bg-white p-5 shadow-2xs space-y-4" id="section-cbe-categories">
            <h3 className="font-display text-xs font-bold tracking-widest text-slate-500 uppercase flex items-center gap-1.5">
              <Compass className="h-4.5 w-4.5 text-blue-600" />
              ACCELERATED PATHWAYS
            </h3>
            <p className="text-[11.5px] text-slate-550 leading-relaxed font-sans">
              Choose an educational career pathway to explore specialized subjects, track requirements, and search affiliated institutions.
            </p>

            <div className="grid gap-3" id="cbe-pathways-brief-list">
              {[
                {
                  id: 'STEM',
                  label: 'Science & Technology (STEM)',
                  desc: 'Includes robotics, chemistry, aviation math and computer design matrices.',
                  color: 'hover:border-blue-500 hover:bg-blue-50/20 text-blue-900',
                  badge: 'Pure & Applied Science'
                },
                {
                  id: 'Social Sciences',
                  label: 'Social Sciences & Humanities',
                  desc: 'Designed for legal theory, policies, journalism, and modern business structures.',
                  color: 'hover:border-emerald-500 hover:bg-emerald-50/20 text-emerald-900',
                  badge: 'Languages & Laws'
                },
                {
                  id: 'Arts & Sports Science',
                  label: 'Arts & Sports Science',
                  desc: 'Unlocking theatrical fine arts, sports medicine diagnostics, and football analytics.',
                  color: 'hover:border-red-500 hover:bg-red-50/20 text-red-900',
                  badge: 'Creative & Athletics'
                }
              ].map((path) => (
                <div
                  key={path.id}
                  onClick={() => onSelectCategory(path.id)}
                  className={`p-4 rounded-xl border border-slate-100 bg-slate-50/50 cursor-pointer transition-all hover:-translate-y-0.5 ${path.color}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">{path.badge}</span>
                    <ArrowUpRight className="h-4 w-4 text-slate-400" />
                  </div>
                  <h4 className="text-sm font-bold mt-1 font-display">
                    {path.label}
                  </h4>
                  <p className="text-[11px] text-slate-550 line-clamp-2 mt-1 leading-relaxed">
                    {path.desc}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => onNavigate('categories')}
              className="w-full text-center py-2 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer block border-t border-slate-50 pt-3"
            >
              Configure Pathway Planner
            </button>
          </div>

          {/* 6. County Filter & Stat Index */}
          <div className="rounded-2xl border border-slate-150/60 bg-white p-5 shadow-2xs space-y-4" id="section-county-filters">
            <h3 className="font-display text-xs font-bold tracking-widest text-slate-500 uppercase flex items-center gap-1.5">
              <MapPin className="h-4.5 w-4.5 text-emerald-600" />
              COUNTY DIRECTORIES
            </h3>
            <p className="text-[11.5px] text-slate-550 leading-relaxed">
              Quickly filter school listings and educational statistics across the highlighted Kenyan digital counties.
            </p>

            <div className="flex flex-col gap-2" id="county-quick-filters">
              {['all', ...activeCounties].map((ct) => {
                const countOfSchools = ct === 'all' ? schools.length : schools.filter(s => s.county.toLowerCase() === ct.toLowerCase()).length;
                const isSelected = selectedCountyFilter === ct;
                return (
                  <button
                    key={ct}
                    onClick={() => {
                      setSelectedCountyFilter(ct);
                      onSelectCounty(ct);
                    }}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                        : 'bg-slate-50/75 border-slate-100 text-slate-700 hover:border-slate-350 hover:bg-slate-100'
                    }`}
                  >
                    <span className="capitalize">{ct === 'all' ? 'All Counties (Total)' : `${ct} County`}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                      {countOfSchools} {countOfSchools === 1 ? 'School' : 'Schools'}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => onNavigate('counties')}
              className="w-full text-center py-2 text-xs font-bold text-emerald-600 hover:text-emerald-800 transition-colors cursor-pointer block border-t border-slate-50 pt-3"
            >
              View County Analytical Boards
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
