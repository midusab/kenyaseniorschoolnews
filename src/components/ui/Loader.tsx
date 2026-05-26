import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  label?: string;
  className?: string;
  size?: number | string;
}

export default function Loader({ label, className = "", size = 20 }: LoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2.5 p-10 ${className}`}>
      <Loader2 
        className="animate-spin text-blue-600" 
        size={size}
      />
      {label && (
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
}
