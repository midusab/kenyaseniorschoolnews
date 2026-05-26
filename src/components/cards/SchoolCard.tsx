import React from 'react';
import { Link } from 'react-router-dom';
import { School } from '../../types';
import { MapPin, BadgeCheck, Quote, Medal, ChevronRight } from 'lucide-react';

interface SchoolCardProps {
  school: School;
  key?: React.Key;
}

export default function SchoolCard({ school }: SchoolCardProps) {
  return (
    <Link
      to={`/schools/${school.id}`}
      className="group flex flex-col rounded-xl border border-gray-150 bg-white hover:border-blue-500 hover:shadow-md transition-all p-5 text-left block"
      id={`school-card-${school.id}`}
    >
      {/* Header block logo name */}
      <div className="flex items-center space-x-3">
        <img
          src={school.logo}
          alt={school.name}
          referrerPolicy="no-referrer"
          className="h-12 w-12 rounded-lg object-cover bg-blue-50 border border-blue-100"
        />
        <div>
          <h3 className="font-display text-sm sm:text-base font-bold text-gray-900 group-hover:text-blue-800 transition-colors">
            {school.name}
          </h3>
          <div className="flex items-center space-x-1 mt-0.5">
            <MapPin className="h-3.5 w-3.5 text-gray-400 inline" />
            <span className="text-[10px] text-gray-500 font-semibold">{school.county} County | {school.category}</span>
          </div>
        </div>
      </div>

      {/* Verified school tag */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-1.5">
          <span className="rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 border border-emerald-150 inline-flex items-center gap-1">
            <BadgeCheck className="h-3 w-3 text-emerald-700" /> MINISTRY STAMPED
          </span>
          {school.category === 'National' && (
            <span className="rounded bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 shadow-xs border border-red-700">
              NATIONAL CENTER
            </span>
          )}
        </div>
        <span className="text-[10px] font-mono text-gray-400 font-semibold uppercase">{school.genderType} BOARDING</span>
      </div>

      {/* Principal and Vision Quote */}
      <div className="mt-4 rounded-lg bg-gray-50 p-3.5 border border-gray-100 relative">
        <Quote className="absolute right-3.5 top-3 h-5 w-5 text-gray-200" />
        <p className="text-[11px] font-bold text-gray-500 font-mono">Principal {school.principalName}:</p>
        <p className="text-[11px] text-gray-600 italic mt-1 line-clamp-3 leading-relaxed">
          "{school.principalQuote}"
        </p>
      </div>

      {/* Certified Pathways list */}
      <div className="mt-4 space-y-2">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono block">Certified Placement Pathways:</span>
        <div className="flex flex-wrap gap-1">
          {school.certifiedPathways.map((path, idx) => (
            <span key={idx} className="rounded bg-sky-50 px-2 py-0.5 text-[10px] text-sky-800 font-bold border border-sky-100 flex items-center gap-1">
              <Medal className="h-3 w-3 text-sky-600" /> {path}
            </span>
          ))}
        </div>
      </div>

      {/* Subject combinations specials */}
      <div className="mt-auto pt-4 border-t border-gray-100 space-y-1.5">
        <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider font-mono block">Highlighted Combos:</span>
        <div className="space-y-1">
          {school.specialCombinationList.map((c, idx) => (
            <p key={idx} className="text-[10.5px] text-gray-600 flex items-center gap-1 leading-snug font-sans">
              <ChevronRight className="h-3 w-3 text-emerald-500" /> {c}
            </p>
          ))}
        </div>
      </div>
    </Link>
  );
}
