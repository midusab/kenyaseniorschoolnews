import React, { useState, useEffect } from 'react';
import { School } from '../../types';
import { schoolService } from '../../services/schoolService';
import SchoolCard from '../../components/cards/SchoolCard';
import { Search, HelpCircle } from 'lucide-react';
import Loader from '../../components/ui/Loader';

export default function SchoolDirectory() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('all');
  const [selectedPathway, setSelectedPathway] = useState('all');
  const [counties, setCounties] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      schoolService.getSchools(),
      schoolService.getCounties()
    ]).then(([schoolsData, countiesData]) => {
      setSchools(schoolsData);
      setCounties(countiesData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loader label="Syncing school registry data..." size={32} className="py-32" />;
  }

  const filteredSchools = schools.filter((sch) => {
    const matchesQuery = 
      sch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.principalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.county.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCounty = selectedCounty === 'all' || sch.county === selectedCounty;
    
    const matchesPathway = selectedPathway === 'all' || sch.certifiedPathways.includes(selectedPathway as any);

    return matchesQuery && matchesCounty && matchesPathway;
  });

  return (
    <div className="space-y-6 animate-fade-in" id="school-directory-section">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="font-display text-lg font-bold text-gray-900">Certified Senior Schools Registry</h2>
        <p className="text-xs text-gray-500">
          Official database of certified senior secondary boarding and day centers offering licensed CBC and CBE pathways in Kenya.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-2xs" id="directory-filter-bar">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search school name or principal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-blue-500 focus:bg-white outline-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold text-gray-400 font-mono uppercase whitespace-nowrap">County:</span>
            <select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-blue-950 focus:border-blue-500 cursor-pointer shadow-3xs"
            >
              <option value="all">All Counties (254)</option>
              {counties.filter(c => c !== 'all').map((c) => (
                <option key={c} value={c}>
                  {c} County
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold text-gray-400 font-mono uppercase whitespace-nowrap">Pathway:</span>
            <select
              value={selectedPathway}
              onChange={(e) => setSelectedPathway(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-blue-950 focus:border-blue-500 cursor-pointer shadow-3xs"
            >
              <option value="all">All Pathways (CBE)</option>
              <option value="STEM">Science & STEM Tech</option>
              <option value="Social Sciences">Social Sciences & Humanities</option>
              <option value="Arts & Sports Science">Arts & Sports Science</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid listing */}
      {filteredSchools.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center" id="directory-empty-state">
          <HelpCircle className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-sm font-bold text-gray-900">No Senior Center Matched</h3>
          <p className="mt-1 text-xs text-gray-500">
            Ensure you choose a different county combination or pathway.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" id="schools-grid">
          {filteredSchools.map((sch) => (
            <SchoolCard key={sch.id} school={sch} />
          ))}
        </div>
      )}
    </div>
  );
}
