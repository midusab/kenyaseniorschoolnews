import React from 'react';
import { Link } from 'react-router-dom';
import { NewsArticle, UserRole } from '../../types';
import { ShieldCheck, Heart, Eye, MessageSquare, ArrowUpRight, Sparkles, AlertTriangle, Lock, Flame } from 'lucide-react';

interface ArticleCardProps {
  article: NewsArticle;
  currentRole: UserRole;
  onLike: (id: string) => void;
  onOpenDetail: (id: string) => void;
  key?: React.Key;
}

export default function ArticleCard({
  article,
  currentRole,
  onLike,
  onOpenDetail
}: ArticleCardProps) {
  
  // Helper mapping category values to visual badges
  const getCategoryBadgeStyles = (cat: string) => {
    switch (cat) {
      case 'pathway':
        return 'bg-blue-50 text-blue-800 border-blue-105';
      case 'sports':
        return 'bg-emerald-50 text-emerald-800 border-emerald-100';
      case 'academics':
        return 'bg-blue-50 text-blue-900 border-blue-200';
      case 'scholarships':
        return 'bg-emerald-50 text-emerald-900 border-emerald-200';
      case 'clubs':
        return 'bg-red-50 text-red-700 border-red-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Dynamic advice tag for specific user roles
  const getRoleSpecificPill = (art: NewsArticle) => {
    if (currentRole === 'student_reporter' && ['sports', 'clubs', 'pathway'].includes(art.category)) {
      return (
        <span className="inline-flex items-center gap-1 rounded bg-blue-950 px-2 py-0.5 text-[10px] font-bold text-blue-300 font-mono">
          <Sparkles className="h-3 w-3" /> SUGGESTED FOR REPORTERS
        </span>
      );
    }
    if (currentRole === 'editor' && !art.isVerified) {
      return (
        <span className="inline-flex items-center gap-1 rounded bg-amber-950 px-2 py-0.5 text-[10px] font-semibold text-amber-300 font-mono border border-amber-800">
          <AlertTriangle className="h-3 w-3" /> UNVERIFIED STUDENT DRAFT
        </span>
      );
    }
    if (currentRole === 'school_admin' && ['academics', 'pathway'].includes(art.category)) {
      return (
        <span className="inline-flex items-center gap-1 rounded bg-slate-950 px-2 py-0.5 text-[10px] font-bold text-slate-300 font-mono border border-slate-800">
          <Lock className="h-3 w-3" /> SCHOOL MANAGEMENT HIGHLIGHT
        </span>
      );
    }
    return null;
  };

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white transition hover:border-blue-200 hover:shadow-md"
      id={`article-card-${article.id}`}
    >
      {/* Image banner */}
      {article.image && (
        <Link to={`/news/${article.id}`} className="relative h-48 w-full overflow-hidden bg-slate-100 block">
          <img
            src={article.image}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
          />
          <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 animate-fade-in">
            {article.views > 100 && (
              <span className="rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm flex items-center gap-1 font-mono">
                <Flame className="h-3 w-3" /> TRENDING
              </span>
            )}
            <span className="rounded bg-blue-900/95 px-2.5 py-1 text-[10px] font-bold text-emerald-300 backdrop-blur-sm flex items-center gap-1 shadow-sm font-mono border border-blue-700">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 inline" /> VERIFIED STAMP
            </span>
            {getRoleSpecificPill(article)}
          </div>
        </Link>
      )}

      {/* Card Content Wrapper */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${getCategoryBadgeStyles(article.category)}`}>
            {article.category}
          </span>
          <span className="text-[11px] font-mono text-gray-400 font-semibold">{article.date}</span>
        </div>

        <div className="mt-2.5">
          <Link to={`/news/${article.id}`}>
            <h3 className="font-display text-base font-bold text-gray-900 group-hover:text-blue-800 transition-colors line-clamp-2">
              {article.title}
            </h3>
          </Link>
          <p className="mt-2 text-xs text-gray-500 leading-relaxed line-clamp-3">
            {article.summary}
          </p>
        </div>

        {/* Sender Info / Action Button */}
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-900 font-mono tracking-wide block uppercase">
              {article.schoolName}
            </span>
            <span className="text-[10px] text-slate-500">
              By: {article.authorName}
            </span>
          </div>
          <Link
            to={`/news/${article.id}`}
            className="rounded bg-blue-50 group-hover:bg-blue-600 px-3 py-1.5 text-xs font-medium text-blue-800 group-hover:text-white transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Read Full</span> 
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Reactions Counter Row */}
        <div className="mt-3 flex items-center space-x-3 text-[10px] text-gray-400 font-mono font-medium pt-3 border-t border-gray-50">
          <button 
            onClick={() => onLike(article.id)}
            className="flex items-center gap-1 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-50" />
            <span className="text-gray-500 hover:text-rose-600 font-bold">{article.likes}</span>
          </button>
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5 text-gray-450" />
            <span>{article.views}</span>
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5 text-gray-450" />
            <span>{article.comments.length} Comments</span>
          </span>
        </div>
      </div>
    </article>
  );
}
