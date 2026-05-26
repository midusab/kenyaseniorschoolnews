import React, { useState, useEffect } from 'react';
import { NewsArticle } from '../../types';
import { MOCK_SCHOOLS } from '../../data/mockData';
import { articleService } from '../../services/articleService';
import { useAuth } from '../../context/AuthContext';
import ArticleCard from '../../components/cards/ArticleCard';
import { 
  Search, ShieldCheck, Heart, Eye, MessageSquare, 
  HelpCircle, ArrowUpRight 
} from 'lucide-react';

interface NewsFeedProps {
  initialArticleId?: string | null;
  onClearInitialId?: () => void;
  filterCounty?: string;
  filterCategory?: string;
}

export default function NewsFeed({
  initialArticleId,
  onClearInitialId,
  filterCounty = 'all',
  filterCategory = 'all'
}: NewsFeedProps = {}) {
  const { currentRole } = useAuth();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(filterCategory);
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>('all');
  const [selectedCountyFilter, setSelectedCountyFilter] = useState<string>(filterCounty);

  // States for sharing
  const [shareCopied, setShareCopied] = useState(false);

  // Filter and search logic
  const filteredArticles = articles.filter((art) => {
    const sObj = MOCK_SCHOOLS.find(s => s.id === art.schoolId);
    const sCounty = sObj ? sObj.county : 'Nairobi'; // Fallback MoE to Nairobi

    const matchesSearch = 
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sCounty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    
    let matchesSchool = true;
    if (selectedSchoolFilter !== 'all') {
      if (selectedSchoolFilter === 'ministry') {
        matchesSchool = !art.schoolId;
      } else {
        matchesSchool = art.schoolId === selectedSchoolFilter;
      }
    }

    const matchesCounty = selectedCountyFilter === 'all' || sCounty.toLowerCase() === selectedCountyFilter.toLowerCase();

    return matchesSearch && matchesCategory && matchesSchool && matchesCounty;
  });

  const categories = [
    { id: 'all', label: 'All News & Updates' },
    { id: 'pathway', label: 'CBE Pathways' },
    { id: 'sports', label: 'Sports & Talents' },
    { id: 'academics', label: 'Academics & Exams' },
    { id: 'scholarships', label: 'Scholarships & Grants' },
    { id: 'clubs', label: 'Clubs & Culture' }
  ];

  // Load verified articles
  useEffect(() => {
    articleService.getArticles().then((data) => setArticles(data));
  }, []);

  const handleLike = async (id: string) => {
    try {
      await articleService.likeArticle(id);
      const data = await articleService.getArticles();
      setArticles(data);
    } catch (err) {
      console.error('Failed to register article like:', err);
    }
  };

  return (
    <div className="space-y-6" id="news-feed-root">
      {/* Search and Category filters banner */}
      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-xs" id="news-filter-bar">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search announcements, school rugby matches, aviation lessons, scholarships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-bold text-gray-400 font-mono uppercase whitespace-nowrap">County:</span>
              <select
                value={selectedCountyFilter}
                onChange={(e) => setSelectedCountyFilter(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-blue-905 focus:border-blue-500 cursor-pointer shadow-xs"
              >
                <option value="all">All Counties</option>
                <option value="Nairobi">Nairobi</option>
                <option value="Kiambu">Kiambu</option>
                <option value="Kisumu">Kisumu</option>
                <option value="Nandi">Nandi</option>
                <option value="Bungoma">Bungoma</option>
              </select>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-bold text-gray-400 font-mono uppercase whitespace-nowrap">School:</span>
              <select
                value={selectedSchoolFilter}
                onChange={(e) => setSelectedSchoolFilter(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-blue-900 focus:border-blue-500 cursor-pointer shadow-xs"
              >
                <option value="all">All Senior Institutions</option>
                <option value="ministry">Ministry of Education National</option>
                {MOCK_SCHOOLS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Categories list */}
        <div className="mt-4 flex flex-wrap gap-2 overflow-x-auto pb-1 no-scrollbar" id="category-pills">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid rendering */}
      {filteredArticles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center" id="news-empty-state">
          <HelpCircle className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-sm font-bold text-gray-900">No Verified Updates Found</h3>
          <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
            Try adjusting your search terms or selecting a different senior school filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2" id="news-articles-grid">
          {filteredArticles.map((art) => (
            <ArticleCard
              key={art.id}
              article={art}
              currentRole={currentRole}
              onLike={handleLike}
              onOpenDetail={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}
