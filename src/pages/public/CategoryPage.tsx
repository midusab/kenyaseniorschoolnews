import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articleService } from '../../services/articleService';
import { NewsArticle } from '../../types';
import { BookOpen, MapPin, ArrowLeft, ArrowUpRight } from 'lucide-react';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    articleService.getArticles()
      .then((allArticles) => {
        // Filter by category
        const filtered = allArticles.filter(
          (a) => a.category.toLowerCase() === (category || '').toLowerCase() && a.isVerified
        );
        setArticles(filtered);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [category]);

  const getCategoryTitle = (cat?: string) => {
    switch (cat?.toLowerCase()) {
      case 'pathway':
        return 'CBE Curriculum & Careers';
      case 'sports':
        return 'Athletics & Talent Development';
      case 'academics':
        return 'Curriculum, Testing & Exams';
      case 'scholarships':
        return 'Scholarships & Transition Grants';
      case 'clubs':
        return 'Culture, Clubs & Societies';
      case 'events':
        return 'School Calendars & Galas';
      case 'general':
        return 'General Noticeboard Notices';
      default:
        return 'Filtered Category updates';
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 font-mono text-xs">
        Compiling category news board...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" id={`category-page-${category}`}>
      {/* Navigation header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-4">
        <div>
          <Link
            to="/news"
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 font-semibold mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All Bulletins
          </Link>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 capitalize">
            {getCategoryTitle(category)}
          </h1>
          <p className="text-xs text-slate-500 font-sans">
            Verified Ministry approved senior high posts categorised under {category?.toUpperCase()}.
          </p>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500 text-xs">
          No live public updates currently listed in the "{getCategoryTitle(category)}" partition. Ensure you check general announcements for broader coverage.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((art) => (
            <div
              key={art.id}
              className="rounded-xl border border-slate-205 bg-white hover:border-blue-500 transition-all p-4 flex flex-col justify-between shadow-2xs"
            >
              <div className="space-y-1.5 p-0.5">
                <span className="text-[9.5px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase block w-max">
                  {art.category}
                </span>
                <h3 className="font-bold text-slate-905 text-xs line-clamp-1">
                  {art.title}
                </h3>
                <p className="text-[10px] text-slate-505 line-clamp-2 leading-relaxed">
                  {art.summary}
                </p>
                <div className="text-[9.5px] text-slate-400 font-mono">
                  Origin: <span className="font-semibold text-slate-600">{art.schoolName}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between">
                <span className="text-[9.5px] font-mono text-slate-400 font-bold">{art.date}</span>
                <Link
                  to={`/news/${art.id}`}
                  className="rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold px-2.5 py-1 transition-all"
                >
                  View Story
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
