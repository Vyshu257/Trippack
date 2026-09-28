import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  Calendar, 
  Sun, 
  Cloud, 
  CloudRain, 
  MoreVertical, 
  Trash2, 
  Plus, 
  Check, 
  Search,
  ExternalLink
} from 'lucide-react';
import { HistoryItem } from '../../types';

interface HistoryScreenProps {
  history: HistoryItem[];
  onSelectTrip: (trip: HistoryItem) => void;
  onDeleteTrip: (id: string) => void;
  onPlanNewTrip: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  history,
  onSelectTrip,
  onDeleteTrip,
  onPlanNewTrip,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPurposeFilter, setSelectedPurposeFilter] = useState('All');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const renderWeatherIcon = (type: 'sun' | 'cloud' | 'rain') => {
    switch (type) {
      case 'sun':
        return <Sun className="w-4 h-4 text-amber-500" />;
      case 'cloud':
        return <Cloud className="w-4 h-4 text-sky-500" />;
      case 'rain':
        return <CloudRain className="w-4 h-4 text-blue-500" />;
    }
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedPurposeFilter === 'All' || item.purpose === selectedPurposeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full bg-white rounded-2xl border border-blue-100/90 shadow-xs p-5 sm:p-7 flex flex-col gap-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#1746A2]">
            <Clock className="w-5 h-5 stroke-[2.5]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Your Travel History
          </h2>
        </div>

        {/* Plan New Trip Button */}
        <button
          onClick={onPlanNewTrip}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1746A2] hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Plan New Trip</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by city or purpose..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'Event', 'Travel', 'Meetup', 'Temple'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedPurposeFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedPurposeFilter === filter
                  ? 'bg-blue-100 text-blue-800 font-semibold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Trip List */}
      <div className="flex flex-col gap-3">
        {filteredHistory.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
            No trips found matching your search.
          </div>
        ) : (
          filteredHistory.map((trip) => (
            <div
              key={trip.id}
              className="group p-4 sm:p-4.5 rounded-2xl border border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50/20 transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:shadow-xs"
            >
              {/* Left Details */}
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1746A2] shrink-0 mt-0.5 sm:mt-0">
                  <MapPin className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">
                      {trip.from} <span className="text-gray-400 font-semibold px-1">➔</span> {trip.to}
                    </h3>
                  </div>

                  {/* Badges row: Date | Days | Purpose */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-500 mt-1">
                    <span className="inline-flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {trip.date}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="font-medium text-gray-600">{trip.days} days</span>
                    <span className="text-gray-300">•</span>
                    <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      {trip.purpose}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Temperature + View Details Button + Menu */}
              <div className="flex items-center justify-between sm:justify-end gap-3.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                {/* Weather */}
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-700 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">
                  {renderWeatherIcon(trip.weatherIcon)}
                  <span>{trip.temperature}</span>
                </div>

                {/* View Details Button */}
                <button
                  type="button"
                  onClick={() => onSelectTrip(trip)}
                  className="px-3.5 py-1.5 bg-blue-50 hover:bg-[#1746A2] text-[#1746A2] hover:text-white rounded-lg text-xs font-semibold border border-blue-200 hover:border-[#1746A2] transition-colors cursor-pointer shadow-2xs"
                >
                  View Details
                </button>

                {/* 3 dots menu */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveMenuId(activeMenuId === trip.id ? null : trip.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 cursor-pointer"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {activeMenuId === trip.id && (
                    <div className="absolute right-0 top-8 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
                      <button
                        onClick={() => {
                          onSelectTrip(trip);
                          setActiveMenuId(null);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                        <span>Open Trip</span>
                      </button>
                      <button
                        onClick={() => {
                          onDeleteTrip(trip.id);
                          setActiveMenuId(null);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
