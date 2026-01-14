import React from 'react';
import { Source } from '../types';
import { ExternalLink, BookOpen, ShieldCheck } from 'lucide-react';

interface SourceCardProps {
  source: Source;
  index: number;
}

export const SourceCard: React.FC<SourceCardProps> = ({ source, index }) => {
  return (
    <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-3 my-2 text-sm hover:border-cyan-500/30 transition-colors duration-200 backdrop-blur-sm">
      <div className="flex items-start gap-2 mb-1">
        <ShieldCheck className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
        <span className="font-semibold text-gray-200 text-xs uppercase tracking-wide">
          Regulation: {source.condition}
        </span>
      </div>
      
      <div className="flex items-start gap-2 mb-2 pl-6">
        <BookOpen className="w-3 h-3 text-gray-500 mt-1 shrink-0" />
        <span className="text-gray-400 text-xs italic">
          {source.context}
        </span>
      </div>

      {source.links && source.links.length > 0 && (
        <div className="pl-6 flex flex-wrap gap-2 mt-2">
          {source.links.map((link, idx) => (
            <a
              key={idx}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-gray-800 hover:bg-cyan-900/30 text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded text-xs transition-colors border border-gray-700 hover:border-cyan-500/50"
            >
              <ExternalLink className="w-3 h-3" />
              Reference {idx + 1}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
