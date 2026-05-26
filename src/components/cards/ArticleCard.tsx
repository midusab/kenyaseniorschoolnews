import React from 'react';
import { Link } from 'react-router-dom';
import { NewsArticle, UserRole } from '../../types';
import { ShieldCheck, Heart, Eye, MessageSquare, ArrowUpRight, Sparkles, AlertTriangle, Lock, Flame, Clock } from 'lucide-react';

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
      className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/40 backdrop-blur-md transition-all duration-500 hover:border-blue-300 hover:shadow-liquid-hover hover:-translate-y-1"
      id={`article-card-${article.id}`}
    >
      {/* Image banner */}
      {article.image && (
        <Link to={`/news/${article.id}`} className="relative h-52 w-full overflow-hidden bg-slate-100 block liquid-shine">
          <img
            src={article.image}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute top-4 right-4 flex flex-col items-end gap-2 animate-fade-in">
            {article.views > 100 && (
              <span className="rounded-full bg-red-600 px-3 py-1 text-[9px] font-black text-white shadow-lg flex items-center gap-1.5 font-mono uppercase tracking-widest border border-red-500/50">
                <Flame className="h-3 w-3" /> TRENDING
              </span>
            )}
            <span className="rounded-full glass-liquid-dark px-3 py-1 text-[9px] font-black text-emerald-300 backdrop-blur-md flex items-center gap-1.5 shadow-lg font-mono border border-white/20 uppercase tracking-widest">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> VERIFIED
            </span>
          </div>
        </Link>
      )}

      {/* Card Content Wrapper */}
      <div className="flex flex-1 flex-col p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className={`rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-[0.1em] border shadow-xs ${getCategoryBadgeStyles(article.category)}`}>
            {article.category}
          </span>
          <span className="text-[10px] font-bold text-slate-400 font-mono flex items-center gap-1">
            <Clock className="h-3 w-3" /> {article.date}
          </span>
        </div>

        <div className="flex-1">
          <Link to={`/news/${article.id}`}>
            <h3 className="font-display text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 tracking-tight leading-[1.2]">
              {article.title}
            </h3>
          </Link>
          <p className="mt-2 text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
            {article.summary}
          </p>
        </div>

        {/* Sender Info / Action Button */}
        <div className="pt-4 border-t border-slate-100/60 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[9px] font-black text-slate-900 uppercase tracking-tight block truncate">
              {article.schoolName}
            </span>
          </div>
          <Link
            to={`/news/${article.id}`}
            className="rounded-full bg-slate-900 hover:bg-black px-4 py-2 text-[10px] font-black text-white transition-all cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-95 shadow-lg shadow-slate-900/10"
          >
            <span>READ</span> 
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Reactions Counter Row */}
        <div className="mt-2 flex items-center justify-between text-[10px] font-bold font-mono pt-3 border-t border-slate-100/60">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onLike(article.id)}
              className="flex items-center gap-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500/10" />
              <span>{article.likes}</span>
            </button>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Eye className="h-3.5 w-3.5" />
              <span>{article.views}</span>
            </span>
          </div>
          <span className="text-slate-400 uppercase text-[9px] tracking-tight">
            {article.comments.length} Comments
          </span>
        </div>
      </div>
    </article>

  );
}
