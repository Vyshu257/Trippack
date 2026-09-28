import React from 'react';
import { HeroBanner } from '../HeroBanner';
import { MapPin, Calendar, SunMedium, ArrowRight, Check } from 'lucide-react';
import { TripState } from '../../types';

interface DashboardScreenProps {
  tripState: TripState;
  onNavigate: (screen: 'destination' | 'duration' | 'weather' | 'luggage' | 'history') => void;
  onApply: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  tripState,
  onNavigate,
  onApply,
}) => {
  return (
    <div className="w-full flex flex-col gap-6">
      {/* 1. Hero Scenic Banner */}
      <HeroBanner />

      {/* 2. Three Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Destination */}
        <button
          onClick={() => onNavigate('destination')}
          className="group text-left p-5 sm:p-6 rounded-2xl bg-[#EAF4FF] hover:bg-[#DFEEFD] active:scale-[0.99] border border-[#C5DFFD] transition-all duration-150 flex flex-col items-center justify-center text-center cursor-pointer shadow-xs hover:shadow-md"
        >
          <div className="w-14 h-14 rounded-full bg-white shadow-2xs flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <MapPin className="w-7 h-7 text-[#1746A2]" />
          </div>
          <h3 className="text-lg font-bold text-[#0F2D6B] mb-1">Destination</h3>
          <p className="text-xs text-blue-800/80 mb-3">
            {tripState.from && tripState.to
              ? `${tripState.from} → ${tripState.to}`
              : 'Choose travel route'}
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1746A2] group-hover:text-blue-700">
            <span>Where to?</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Card 2: Duration */}
        <button
          onClick={() => onNavigate('duration')}
          className="group text-left p-5 sm:p-6 rounded-2xl bg-[#EAF8EF] hover:bg-[#DEF5E5] active:scale-[0.99] border border-[#BDE7CB] transition-all duration-150 flex flex-col items-center justify-center text-center cursor-pointer shadow-xs hover:shadow-md"
        >
          <div className="w-14 h-14 rounded-full bg-white shadow-2xs flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Calendar className="w-7 h-7 text-[#059669]" />
          </div>
          <h3 className="text-lg font-bold text-[#064E3B] mb-1">Duration</h3>
          <p className="text-xs text-emerald-800/80 mb-3">
            {tripState.durationDays > 0 || tripState.durationWeeks > 0 || tripState.durationMonths > 0
              ? `${tripState.durationMonths ? tripState.durationMonths + 'm ' : ''}${tripState.durationWeeks ? tripState.durationWeeks + 'w ' : ''}${tripState.durationDays} days`
              : 'Set journey length'}
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#059669] group-hover:text-emerald-700">
            <span>How long?</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Card 3: Weather */}
        <button
          onClick={() => onNavigate('weather')}
          className="group text-left p-5 sm:p-6 rounded-2xl bg-[#FEF6EA] hover:bg-[#FDEED5] active:scale-[0.99] border border-[#FDE0B5] transition-all duration-150 flex flex-col items-center justify-center text-center cursor-pointer shadow-xs hover:shadow-md"
        >
          <div className="w-14 h-14 rounded-full bg-white shadow-2xs flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <SunMedium className="w-7 h-7 text-[#D97706]" />
          </div>
          <h3 className="text-lg font-bold text-[#78350F] mb-1">Weather</h3>
          <p className="text-xs text-amber-800/80 mb-3">
            Check live forecasts & AQI
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#D97706] group-hover:text-amber-700">
            <span>What's the forecast?</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* 3. Bottom Action Bar */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs sm:text-sm text-gray-500 font-medium">
          Ready to review packing & luggage?
        </div>
        <button
          onClick={onApply}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1746A2] hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold rounded-xl shadow-sm transition-all duration-150 cursor-pointer hover:shadow-md"
        >
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>Apply</span>
        </button>
      </div>
    </div>
  );
};
