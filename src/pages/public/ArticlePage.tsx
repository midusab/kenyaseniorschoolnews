import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articleService } from '../../services/articleService';
import { NewsArticle } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { MapPin, ShieldCheck, Heart, MessageSquare, ArrowLeft, Send, Check, ThumbsUp, Lightbulb, GraduationCap, Trophy } from 'lucide-react';
import Loader from '../../components/ui/Loader';

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { currentRole } = useAuth();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  // States for comment composer
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [shareCopied, setShareCopied] = useState(false);

  const loadArticle = () => {
    if (!slug) return;
    setLoading(true);
    articleService.getArticles()
      .then((allArticles) => {
        const found = allArticles.find((a) => a.id === slug);
        setArticle(found || null);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadArticle();
  }, [slug]);

  const handleLike = async () => {
    if (!article) return;
    try {
      await articleService.likeArticle(article.id);
      loadArticle();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReact = async (type: 'applause' | 'insightful' | 'congratulations' | 'cheers') => {
    if (!article) return;
    try {
      await articleService.reactToArticle(article.id, type);
      loadArticle();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article || !commentText.trim()) return;

    const finalName = commentName.trim() || 'Anonymous Reader';
    const finalRole = currentRole === 'public_reader' ? 'MoE Citizen' : currentRole.replace('_', ' ');

    try {
      await articleService.addComment(article.id, commentText.trim(), finalName, finalRole);
      setCommentText('');
      setCommentName('');
      loadArticle();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <Loader label="Opening official news bulletin..." size={32} className="py-24" />;
  }

  if (!article) {
    return (
      <div className="py-16 text-center max-w-md mx-auto space-y-4">
        <h3 className="font-display text-lg font-bold text-slate-900">Article Bulletin Not Found</h3>
        <p className="text-xs text-slate-500 font-sans leading-relaxed">
          The requested senior high co-curricular report or ministry directive has been unlisted or remains in moderation.
        </p>
        <Link
          to="/news"
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to News Feed</span>
        </Link>
      </div>
    );
  }

  const tagColors = [
    'bg-blue-50 text-blue-800 border-blue-150',
    'bg-emerald-50 text-emerald-800 border-emerald-150',
    'bg-sky-50 text-sky-800 border-sky-150',
    'bg-amber-50 text-amber-800 border-amber-150'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in" id={`article-page-${article.id}`}>
      {/* Back button */}
      <div>
        <Link
          to="/news"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 font-semibold"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Bulletins List
        </Link>
      </div>

      {/* Main Card Content */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        {article.image && (
          <div className="relative h-64 sm:h-96 w-full bg-slate-100">
            <img
              src={article.image}
              alt={article.title}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent animate-fade-in"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <span className="rounded bg-white/20 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border border-white/20 inline-block">
                {article.category.toUpperCase()}
              </span>
              <h1 className="font-display text-lg sm:text-3xl font-extrabold tracking-tight leading-tight text-white">
                {article.title}
              </h1>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-6">
          {!article.image && (
            <div className="border-b border-slate-100 pb-4 space-y-2">
              <span className="rounded bg-sky-50 text-sky-800 border border-sky-100 px-2.5 py-0.5 text-[10px] font-bold uppercase inline-block">
                {article.category}
              </span>
              <h1 className="font-display text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                {article.title}
              </h1>
            </div>
          )}

          {/* Author/School Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-15 rounded-lg bg-blue-50 border border-blue-105 flex items-center justify-center text-blue-800 font-bold text-xs uppercase font-mono shadow-3xs">
                {article.schoolName.substring(0, 3)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 font-mono tracking-wider block uppercase leading-none">
                  {article.schoolName}
                </h4>
                <p className="text-[11px] text-gray-500 mt-1">
                  Drafted by {article.authorName} ({article.authorRole})
                </p>
              </div>
            </div>
            
            <div className="sm:text-right text-xs font-mono text-gray-400 font-semibold space-y-1">
              <div>Published {article.date}</div>
              <div className="text-blue-800 flex items-center sm:justify-end gap-1 font-bold">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> MOE STAMPED: #{article.id}
              </div>
            </div>
          </div>

          {/* Article Main Text */}
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans whitespace-pre-wrap space-y-4">
            {article.content.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Curation and Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-4">
              {article.tags.map((tag, i) => (
                <span
                  key={i}
                  className={`rounded px-2 py-0.5 text-[9.5px] font-mono font-bold border ${tagColors[i % tagColors.length]}`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Social reactions interactive row */}
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-4">
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Verify & Engage With This Story</h4>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <button
                  onClick={() => handleReact('applause')}
                  className="rounded-full bg-white hover:bg-amber-50 border border-gray-150 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-amber-300 flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors"
                >
                  <ThumbsUp className="h-3.5 w-3.5 text-amber-500" />
                  <span>Applaud</span>
                  <span className="bg-amber-100 text-amber-950 rounded px-1.5 py-0.5 text-[10px] font-mono font-bold">
                    {article.reactions?.applause || 0}
                  </span>
                </button>

                <button
                  onClick={() => handleReact('insightful')}
                  className="rounded-full bg-white hover:bg-sky-50 border border-gray-150 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-sky-300 flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors"
                >
                  <Lightbulb className="h-3.5 w-3.5 text-sky-500" />
                  <span>Insightful</span>
                  <span className="bg-sky-100 text-sky-950 rounded px-1.5 py-0.5 text-[10px] font-mono font-bold">
                    {article.reactions?.insightful || 0}
                  </span>
                </button>

                <button
                  onClick={() => handleReact('congratulations')}
                  className="rounded-full bg-white hover:bg-purple-50 border border-gray-150 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-purple-300 flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors"
                >
                  <GraduationCap className="h-3.5 w-3.5 text-purple-500" />
                  <span>Congrats</span>
                  <span className="bg-purple-100 text-purple-950 rounded px-1.5 py-0.5 text-[10px] font-mono font-bold">
                    {article.reactions?.congratulations || 0}
                  </span>
                </button>

                <button
                  onClick={() => handleReact('cheers')}
                  className="rounded-full bg-white hover:bg-emerald-50 border border-gray-150 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-emerald-300 flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors"
                >
                  <Trophy className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Cheers</span>
                  <span className="bg-emerald-100 text-emerald-950 rounded px-1.5 py-0.5 text-[10px] font-mono font-bold">
                    {article.reactions?.cheers || 0}
                  </span>
                </button>

                <button
                  onClick={handleLike}
                  className="rounded-full bg-pink-50 hover:bg-pink-100 border border-pink-200 px-3 py-1.5 text-xs font-bold text-pink-700 flex items-center gap-1.5 cursor-pointer shadow-3xs transition-colors ml-auto"
                >
                  <Heart className="h-4 w-4 fill-pink-500 text-pink-500" />
                  <span>Recommend ({article.likes})</span>
                </button>
              </div>
            </div>

            {/* Sharing links */}
            <div className="pt-4 border-t border-slate-205 space-y-2">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Send Cocurricular Link to Network</h5>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setShareCopied(true);
                    setTimeout(() => setShareCopied(false), 3000);
                  }}
                  className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold border border-blue-750 text-[11px] px-4 py-2 cursor-pointer shadow-3xs flex items-center gap-1.5 transition-all"
                >
                  {shareCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-300" />
                      <span>COPIED SUCCESSFULLY</span>
                    </>
                  ) : (
                    <span>Copy Page URL</span>
                  )}
                </button>
                <span className="text-[10px] text-slate-400">Share with teachers, parents, or education administrators for regional score updates.</span>
              </div>
            </div>
          </div>

          {/* Comment Thread */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-1.5">
              <MessageSquare className="h-4.5 w-4.5 text-blue-600" />
              Discussions & Community Feedback ({article.comments?.length || 0})
            </h3>

            <div className="space-y-3">
              {article.comments && article.comments.map((comm) => (
                <div key={comm.id} className="rounded-lg bg-slate-50 p-3.5 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800">
                      {comm.authorName} <span className="font-normal text-gray-400 italic">({comm.authorRole})</span>
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono font-bold">{comm.date}</span>
                  </div>
                  <p className="mt-1.5 text-xs text-gray-650 font-sans leading-relaxed">
                    {comm.text}
                  </p>
                </div>
              ))}
              {(!article.comments || article.comments.length === 0) && (
                <p className="text-xs text-gray-400 italic pt-2">No comments have been posted yet. Start the conversation by providing your view below!</p>
              )}
            </div>

            {/* Comment Composer */}
            <form onSubmit={handleSubmitComment} className="mt-4 rounded-xl border border-slate-200 bg-white p-4 space-y-3">
              <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider font-mono">Join the Discussion</h4>
              
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Your Name (Default: Anonymous)"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="rounded border border-slate-200 p-2 text-xs focus:border-blue-500 outline-none"
                />
                <span className="text-[10px] text-slate-400 flex items-center">
                  Signing as: {commentName.trim() || 'Anonymous Reader'} ({currentRole === 'public_reader' ? 'MoE Citizen' : currentRole.replace('_', ' ')})
                </span>
              </div>
              <div className="relative">
                <textarea
                  rows={3}
                  placeholder="Write your brief respect-stamped feedback here..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full rounded border border-slate-200 p-2.5 text-xs focus:border-blue-500 outline-none"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 cursor-pointer shadow-3xs flex items-center gap-1"
              >
                <Send className="h-3 w-3" />
                <span>Submit Statement</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
