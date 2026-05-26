import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { schoolService } from '../../services/schoolService';
import { articleService } from '../../services/articleService';
import { School, NewsArticle } from '../../types';
import { Search, HelpCircle, School as SchoolIcon, BookOpen, ArrowUpRight } from 'lucide-react';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(query);
  const [schools, setSchools] = useState<School[]>([]);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      schoolService.getSchools(),
      articleService.getArticles()
    ])
      .then(([allSchools, allArticles]) => {
        setSchools(allSchools);
        setArticles(allArticles.filter(a => a.isVerified));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    }
  };

  const filteredSchools = schools.filter((s) => {
    if (!query) return false;
    return (
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.county.toLowerCase().includes(query.toLowerCase()) ||
      s.principalName.toLowerCase().includes(query.toLowerCase())
    );
  });

  const filteredArticles = articles.filter((a) => {
    if (!query) return false;
    return (
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.content.toLowerCase().includes(query.toLowerCase()) ||
      a.schoolName.toLowerCase().includes(query.toLowerCase()) ||
      a.summary.toLowerCase().includes(query.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
    );
  });

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 font-mono text-xs">
        Searching registered systems...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in" id="search-results-page">
      {/* Page Header and search field */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
          Search Portal Bulletins & Databases
        </h1>
        <p className="text-xs text-slate-500 font-sans mt-0.5">
          Live queries matching accredited school records or verified MoE journals.
        </p>

        <form onSubmit={handleSearchSubmit} className="relative mt-4 max-w-xl">
          <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Query keyword (e.g. Alliance, STEM, athletics, principal)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-250 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </form>
      </div>

      {query ? (
        <div className="space-y-8">
          <div>
            <p className="text-xs text-slate-400 font-semibold font-mono">
              SEARCH RESULTS FOR: <span className="text-blue-600 font-bold">"{query}"</span>
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Schools Matches */}
            <div className="space-y-4 lg:col-span-1 border-r border-slate-100 pr-0 lg:pr-6">
              <h3 className="font-display text-xs font-extrabold uppercase text-slate-400 font-mono tracking-wider flex items-center gap-1">
                <SchoolIcon className="h-4 w-4 text-blue-600" /> Matches in High Schools Directory ({filteredSchools.length})
              </h3>
              
              {filteredSchools.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center text-slate-450 text-[11px]">
                  No accredited senior schools matched. Try "Alliance" or "Kenya High" or county names like "Kiambu".
                </div>
              ) : (
                <div className="grid gap-3">
                  {filteredSchools.map((sch) => (
                    <Link
                      key={sch.id}
                      to={`/schools/${sch.id}`}
                      className="rounded-lg border border-slate-200 bg-white p-3.5 hover:border-blue-500 hover:shadow-3xs transition-all flex items-center gap-3"
                    >
                      <img
                        src={sch.logo}
                        alt={sch.name}
                        referrerPolicy="no-referrer"
                        className="h-10 w-10 rounded-md object-cover border border-slate-100 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 text-xs truncate leading-snug">
                          {sch.name}
                        </h4>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">
                          {sch.county} County | {sch.category}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Articles Matches */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-display text-xs font-extrabold uppercase text-slate-400 font-mono tracking-wider flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-blue-600" /> Matches in Bulletin Articles ({filteredArticles.length})
              </h3>

              {filteredArticles.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center text-slate-450 text-xs">
                  No registered blog updates or announcements matching search. Try broad categories like "sports", "CBE" or "testing".
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredArticles.map((art) => (
                    <div
                      key={art.id}
                      className="rounded-xl border border-slate-205 bg-white p-4 space-y-2 hover:border-blue-500 transition-all"
                    >
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                        <span className="font-bold uppercase text-slate-500 bg-slate-100 rounded px-1.5 py-0.5">{art.category}</span>
                        <span>{art.date}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs leading-normal">
                        {art.title}
                      </h4>
                      <p className="text-[10.5px] text-slate-550 line-clamp-2 leading-relaxed">
                        {art.summary}
                      </p>
                      <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-[9px] text-slate-400">Written by {art.authorName} ({art.schoolName})</span>
                        <Link
                          to={`/news/${art.id}`}
                          className="inline-flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-800 font-bold"
                        >
                          <span>Show Full Text</span>
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
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500 text-xs">
          <HelpCircle className="mx-auto h-10 w-10 text-slate-300 mb-2" />
          Please enter a search keyword or look up details above to show matched curriculum tracks/school updates.
        </div>
      )}
    </div>
  );
}
