import React from 'react';
import { Sparkles, Clock, Compass } from 'lucide-react';

interface HeaderProps {
  onOpenGemini: () => void;
  onOpenHistory: () => void;
  activeScreen?: string;
  onNavigateHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGemini,
  onOpenHistory,
  activeScreen,
  onNavigateHome,
}) => {
  return (
    <header className="w-full bg-white border-b border-blue-100/80 px-4 sm:px-6 py-3 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Left: Connect to Gemini */}
        <button
          onClick={onOpenGemini}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 active:bg-blue-200 border border-blue-200/90 rounded-full transition-all duration-150 cursor-pointer shadow-2xs group"
          title="Connect to Gemini AI for travel insights"
        >
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          <span>Connect to Gemini</span>
        </button>

        {/* Center: Brand Logo */}
        <div
          onClick={onNavigateHome}
          className="flex items-center gap-1.5 cursor-pointer select-none group"
        >
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#1746A2] font-sans group-hover:text-blue-700 transition-colors">
            Trippack
          </h1>
        </div>

        {/* Right: History */}
        <button
          onClick={onOpenHistory}
          className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium border rounded-full transition-all duration-150 cursor-pointer shadow-2xs ${
            activeScreen === 'history'
              ? 'bg-[#1746A2] text-white border-[#1746A2]'
              : 'text-blue-700 bg-white hover:bg-blue-50 border-blue-200/90'
          }`}
          title="View saved trip history"
        >
          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>History</span>
        </button>
      </div>
    </header>
  );
};
