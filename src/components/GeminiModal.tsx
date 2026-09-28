import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, Check, ArrowRight, Loader2, Lightbulb, Shirt, MapPin } from 'lucide-react';
import { TripState } from '../types';

interface GeminiModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripState: TripState;
  onApplyPackingSuggestions?: (suggestions: any) => void;
}

export const GeminiModal: React.FC<GeminiModalProps> = ({
  isOpen,
  onClose,
  tripState,
  onApplyPackingSuggestions,
}) => {
  const [loading, setLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [adviceData, setAdviceData] = useState<{
    overview?: string;
    packingTips?: string[];
    destinationTips?: string[];
  } | null>(null);
  const [appliedNotice, setAppliedNotice] = useState(false);

  if (!isOpen) return null;

  const totalDays = (tripState.durationMonths * 30) + (tripState.durationWeeks * 7) + tripState.durationDays || 4;

  const fetchAdvice = async (customQ?: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/travel-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: tripState.from || 'Hyderabad',
          to: tripState.to || 'Bangalore',
          days: totalDays,
          purpose: tripState.purpose || 'Travel',
          temperature: '26°C - 32°C',
          clothesGender: tripState.gender,
          query: customQ,
        }),
      });

      const data = await res.json();
      setAdviceData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSmartPacking = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/packing-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: tripState.from || 'Hyderabad',
          to: tripState.to || 'Bangalore',
          days: totalDays,
          purpose: tripState.purpose || 'Event',
          gender: tripState.gender,
          healthStatus: tripState.healthStatus,
        }),
      });

      const data = await res.json();
      if (data.suggestedItems && onApplyPackingSuggestions) {
        onApplyPackingSuggestions(data.suggestedItems);
        setAppliedNotice(true);
        setTimeout(() => setAppliedNotice(false), 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-blue-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-xs">
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Gemini Travel & Packing AI</h3>
              <p className="text-xs text-blue-100">Smart contextual recommendations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Trip Context Strip */}
        <div className="bg-blue-50/70 border-b border-blue-100/80 px-6 py-3 flex items-center justify-between text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>
              <strong>{tripState.from || 'Hyderabad'}</strong> ➔ <strong>{tripState.to || 'Bangalore'}</strong>
            </span>
            <span className="text-blue-400">•</span>
            <span>{totalDays} days</span>
            {tripState.purpose && (
              <>
                <span className="text-blue-400">•</span>
                <span className="font-semibold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                  {tripState.purpose}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-5">
          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={() => fetchAdvice()}
              disabled={loading}
              className="p-3 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 active:bg-blue-200 text-left transition-colors cursor-pointer flex items-center gap-2.5 group"
            >
              <Lightbulb className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-xs font-bold text-blue-950">Get Travel Insights</div>
                <div className="text-[11px] text-gray-500">Route & weather advice</div>
              </div>
            </button>

            <button
              onClick={fetchSmartPacking}
              disabled={loading}
              className="p-3 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/60 active:bg-indigo-200 text-left transition-colors cursor-pointer flex items-center gap-2.5 group"
            >
              <Shirt className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-xs font-bold text-indigo-950">Auto-Pack with AI</div>
                <div className="text-[11px] text-gray-500">Populates optimal luggage</div>
              </div>
            </button>
          </div>

          {/* Applied Notice */}
          {appliedNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Smart luggage suggestion applied to your packing checklist!</span>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="py-8 flex flex-col items-center justify-center gap-2 text-blue-600">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs font-semibold text-gray-600">
                Consulting Gemini AI for {tripState.to || 'your destination'}...
              </span>
            </div>
          )}

          {/* Advice Output */}
          {adviceData && !loading && (
            <div className="flex flex-col gap-4 text-xs sm:text-sm">
              {adviceData.overview && (
                <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 text-blue-900 leading-relaxed font-medium">
                  {adviceData.overview}
                </div>
              )}

              {adviceData.packingTips && adviceData.packingTips.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Shirt className="w-3.5 h-3.5 text-blue-600" />
                    Recommended Packing
                  </h4>
                  <ul className="space-y-1.5">
                    {adviceData.packingTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100">
                        <span className="text-blue-500 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {adviceData.destinationTips && adviceData.destinationTips.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    Local Destination Tips
                  </h4>
                  <ul className="space-y-1.5">
                    {adviceData.destinationTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Custom Prompt Input */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && customPrompt.trim()) {
                fetchAdvice(customPrompt.trim());
                setCustomPrompt('');
              }
            }}
            placeholder="Ask Gemini: e.g. What snacks should I pack?"
            className="flex-1 px-4 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => {
              if (customPrompt.trim()) {
                fetchAdvice(customPrompt.trim());
                setCustomPrompt('');
              }
            }}
            disabled={loading || !customPrompt.trim()}
            className="p-2.5 bg-[#1746A2] hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
