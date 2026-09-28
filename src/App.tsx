/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { DestinationScreen } from './components/screens/DestinationScreen';
import { DurationScreen } from './components/screens/DurationScreen';
import { WeatherScreen } from './components/screens/WeatherScreen';
import { LuggageScreen } from './components/screens/LuggageScreen';
import { HistoryScreen } from './components/screens/HistoryScreen';
import { DesignBoardView } from './components/DesignBoardView';
import { GeminiModal } from './components/GeminiModal';
import { TripState, HistoryItem, PurposeType } from './types';
import { INITIAL_HISTORY, getRecommendedClothes } from './data/mockData';
import { LayoutGrid, Smartphone, Check } from 'lucide-react';

type ScreenType = 'dashboard' | 'destination' | 'duration' | 'weather' | 'luggage' | 'history';

export default function App() {
  // Active Screen
  const [activeScreen, setActiveScreen] = useState<ScreenType>('dashboard');
  
  // View mode: 'app' (interactive page-by-page) or 'board' (6-screen design mockup view)
  const [viewMode, setViewMode] = useState<'app' | 'board'>('app');

  // Gemini AI Modal
  const [isGeminiOpen, setIsGeminiOpen] = useState(false);

  // Global Trip State
  const [tripState, setTripState] = useState<TripState>(() => {
    const initialClothes = getRecommendedClothes('Male', 'Event', 6);
    return {
      from: 'Hyderabad',
      to: 'Bangalore',
      durationMonths: 0,
      durationWeeks: 0,
      durationDays: 6,
      purpose: 'Event',
      gender: 'Male',
      healthStatus: 'Healthy',
      selectedClothes: initialClothes,
      selectedDocuments: [
        'ID Proof (Aadhar / Passport)',
        'Tickets / Bookings',
        'Travel Insurance',
      ],
      selectedMedicines: ['Paracetamol'],
      selectedAccessories: [
        'Chargers & Power Bank',
        'Toiletries',
        'Sunglasses / Cap',
      ],
    };
  });

  // History State
  const [history, setHistory] = useState<HistoryItem[]>(INITIAL_HISTORY);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  // Synchronize purpose change with automatic clothing adaptations
  const handlePurposeChange = (newPurpose: PurposeType) => {
    setTripState((prev) => {
      const totalDays = (prev.durationMonths * 30) + (prev.durationWeeks * 7) + prev.durationDays || 3;
      const updatedClothes = getRecommendedClothes(prev.gender, newPurpose, totalDays);
      return {
        ...prev,
        purpose: newPurpose,
        selectedClothes: updatedClothes,
      };
    });
    showToast(`Updated luggage list for ${newPurpose} trip`);
  };

  // Synchronize gender change with female / male clothing presets
  const handleGenderChange = (newGender: 'Male' | 'Female') => {
    setTripState((prev) => {
      const totalDays = (prev.durationMonths * 30) + (prev.durationWeeks * 7) + prev.durationDays || 3;
      const updatedClothes = getRecommendedClothes(newGender, prev.purpose, totalDays);
      return {
        ...prev,
        gender: newGender,
        selectedClothes: updatedClothes,
      };
    });
    showToast(`Switched wardrobe to ${newGender} items`);
  };

  // Synchronize duration change with clothing quantity scaling
  const handleMonthsChange = (m: number) => {
    setTripState((prev) => {
      const totalDays = (m * 30) + (prev.durationWeeks * 7) + prev.durationDays || 1;
      const updatedClothes = getRecommendedClothes(prev.gender, prev.purpose, totalDays);
      return { ...prev, durationMonths: m, selectedClothes: updatedClothes };
    });
  };

  const handleWeeksChange = (w: number) => {
    setTripState((prev) => {
      const totalDays = (prev.durationMonths * 30) + (w * 7) + prev.durationDays || 1;
      const updatedClothes = getRecommendedClothes(prev.gender, prev.purpose, totalDays);
      return { ...prev, durationWeeks: w, selectedClothes: updatedClothes };
    });
  };

  const handleDaysChange = (d: number) => {
    setTripState((prev) => {
      const totalDays = (prev.durationMonths * 30) + (prev.durationWeeks * 7) + d || 1;
      const updatedClothes = getRecommendedClothes(prev.gender, prev.purpose, totalDays);
      return { ...prev, durationDays: d, selectedClothes: updatedClothes };
    });
  };

  // Reset clothes for purpose manually if user wants to refresh
  const handleResetClothesForPurpose = (gender: 'Male' | 'Female', purpose: PurposeType | '', days: number) => {
    const updated = getRecommendedClothes(gender, purpose, days);
    setTripState((prev) => ({
      ...prev,
      selectedClothes: updated,
    }));
    showToast(`Refreshed clothing recommendations for ${purpose || 'Travel'}`);
  };

  // State update handlers
  const handleUpdateClothesCount = (clothId: string, delta: number) => {
    setTripState((prev) => {
      const current = prev.selectedClothes[clothId] ?? 0;
      const next = Math.max(0, current + delta);
      return {
        ...prev,
        selectedClothes: {
          ...prev.selectedClothes,
          [clothId]: next,
        },
      };
    });
  };

  const handleToggleDocument = (doc: string) => {
    setTripState((prev) => {
      const exists = prev.selectedDocuments.includes(doc);
      return {
        ...prev,
        selectedDocuments: exists
          ? prev.selectedDocuments.filter((d) => d !== doc)
          : [...prev.selectedDocuments, doc],
      };
    });
  };

  const handleToggleMedicine = (med: string) => {
    setTripState((prev) => {
      const exists = prev.selectedMedicines.includes(med);
      return {
        ...prev,
        selectedMedicines: exists
          ? prev.selectedMedicines.filter((m) => m !== med)
          : [...prev.selectedMedicines, med],
      };
    });
  };

  const handleToggleAccessory = (acc: string) => {
    setTripState((prev) => {
      const exists = prev.selectedAccessories.includes(acc);
      return {
        ...prev,
        selectedAccessories: exists
          ? prev.selectedAccessories.filter((a) => a !== acc)
          : [...prev.selectedAccessories, acc],
      };
    });
  };

  // Save current trip to history
  const handleSaveTrip = () => {
    const totalDays = (tripState.durationMonths * 30) + (tripState.durationWeeks * 7) + tripState.durationDays || 3;
    const newHistoryItem: HistoryItem = {
      id: `trip-${Date.now()}`,
      from: tripState.from || 'Origin',
      to: tripState.to || 'Destination',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      days: totalDays,
      purpose: (tripState.purpose as PurposeType) || 'Travel',
      temperature: '28°C',
      weatherIcon: 'sun',
      savedTripState: { ...tripState },
    };

    setHistory((prev) => [newHistoryItem, ...prev]);
    showToast(`Trip ${tripState.from} ➔ ${tripState.to} saved successfully!`);
  };

  // Load a trip from history
  const handleSelectTrip = (trip: HistoryItem) => {
    if (trip.savedTripState) {
      setTripState({
        ...tripState,
        ...trip.savedTripState,
      });
    } else {
      setTripState((prev) => ({
        ...prev,
        from: trip.from,
        to: trip.to,
        durationDays: trip.days,
        purpose: trip.purpose,
      }));
    }
    setActiveScreen('dashboard');
    showToast(`Loaded details for ${trip.from} ➔ ${trip.to}`);
  };

  // Delete trip
  const handleDeleteTrip = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    showToast('Trip removed from history');
  };

  // Plan New Trip
  const handlePlanNewTrip = () => {
    const freshClothes = getRecommendedClothes('Male', 'Travel', 3);
    setTripState({
      from: '',
      to: '',
      durationMonths: 0,
      durationWeeks: 0,
      durationDays: 3,
      purpose: 'Travel',
      gender: 'Male',
      healthStatus: 'Healthy',
      selectedClothes: freshClothes,
      selectedDocuments: ['ID Proof (Aadhar / Passport)', 'Tickets / Bookings'],
      selectedMedicines: [],
      selectedAccessories: ['Chargers & Power Bank', 'Toiletries'],
    });
    setActiveScreen('destination');
    showToast('Started planning a new trip!');
  };

  // Apply AI Packing suggestions
  const handleApplyPackingSuggestions = (suggestions: any) => {
    if (!suggestions) return;
    setTripState((prev) => {
      const newClothes = { ...prev.selectedClothes };
      if (Array.isArray(suggestions.clothes)) {
        suggestions.clothes.forEach((c: any) => {
          const lowerName = c.name.toLowerCase();
          const matchKey = lowerName.includes('chud') || lowerName.includes('salwar')
            ? 'chuddar'
            : lowerName.includes('saree')
            ? 'saree'
            : lowerName.includes('top') || lowerName.includes('kurti')
            ? 'female_top'
            : lowerName.includes('shirt')
            ? 'tshirt'
            : lowerName.includes('jean') || lowerName.includes('palazzo')
            ? (prev.gender === 'Female' ? 'female_jeans' : 'jeans')
            : lowerName.includes('suit')
            ? 'suit'
            : 'shorts';
          newClothes[matchKey] = c.count || 2;
        });
      }

      return {
        ...prev,
        selectedClothes: newClothes,
        selectedDocuments: suggestions.documents || prev.selectedDocuments,
        selectedMedicines: suggestions.medicines || prev.selectedMedicines,
        selectedAccessories: suggestions.accessories || prev.selectedAccessories,
      };
    });
    showToast('Gemini suggestions applied to your packing list!');
  };

  const totalCalculatedDays = (tripState.durationMonths * 30) + (tripState.durationWeeks * 7) + tripState.durationDays || 4;

  return (
    <div className="min-h-screen bg-[#F4F8FD] text-gray-900 font-sans flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Header Bar with Brand & Quick Actions */}
      <Header
        onOpenGemini={() => setIsGeminiOpen(true)}
        onOpenHistory={() => setActiveScreen('history')}
        activeScreen={activeScreen}
        onNavigateHome={() => setActiveScreen('dashboard')}
      />

      {/* 2. Secondary Navigation & View Switcher Bar */}
      <div className="w-full bg-white/80 backdrop-blur-xs border-b border-blue-100/70 sticky top-[57px] z-20 px-4 py-2.5 shadow-2xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {/* Screens Navigator Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto py-0.5 no-scrollbar">
            {(
              [
                { id: 'dashboard', label: '1. Dashboard' },
                { id: 'destination', label: '2. Destination' },
                { id: 'duration', label: '3. Duration' },
                { id: 'weather', label: '4. Weather' },
                { id: 'luggage', label: '5. Luggage' },
                { id: 'history', label: '6. History' },
              ] as const
            ).map((tab) => {
              const isActive = activeScreen === tab.id && viewMode === 'app';
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setViewMode('app');
                    setActiveScreen(tab.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#1746A2] text-white shadow-2xs'
                      : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50/70'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* View Mode Switcher: Single App View vs 6-Screen Design Asset Board */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto bg-gray-100/90 p-0.5 rounded-xl border border-gray-200">
            <button
              onClick={() => setViewMode('app')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'app'
                  ? 'bg-white text-[#1746A2] shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Interactive App</span>
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'board'
                  ? 'bg-white text-[#1746A2] shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>6-Screen Design Board</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-slate-700">
          <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3. Main Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {viewMode === 'board' ? (
          /* SHOWCASE ALL 6 SCREENS AS CLEAN DESIGN ASSETS (Matching Mockup Layout, but Cleaned!) */
          <DesignBoardView
            tripState={tripState}
            history={history}
            onOpenGemini={() => setIsGeminiOpen(true)}
            onOpenHistory={() => {
              setViewMode('app');
              setActiveScreen('history');
            }}
            onChangeFrom={(val) => setTripState((p) => ({ ...p, from: val }))}
            onChangeTo={(val) => setTripState((p) => ({ ...p, to: val }))}
            onChangePurpose={handlePurposeChange}
            onChangeMonths={handleMonthsChange}
            onChangeWeeks={handleWeeksChange}
            onChangeDays={handleDaysChange}
            onChangeGender={handleGenderChange}
            onChangeHealthStatus={(s) => setTripState((p) => ({ ...p, healthStatus: s }))}
            onUpdateClothesCount={handleUpdateClothesCount}
            onResetClothesForPurpose={handleResetClothesForPurpose}
            onToggleDocument={handleToggleDocument}
            onToggleMedicine={handleToggleMedicine}
            onToggleAccessory={handleToggleAccessory}
            onSelectTrip={handleSelectTrip}
            onDeleteTrip={handleDeleteTrip}
            onPlanNewTrip={handlePlanNewTrip}
            onSaveTrip={handleSaveTrip}
            onNavigateToScreen={(s) => {
              setViewMode('app');
              setActiveScreen(s);
            }}
          />
        ) : (
          /* INTERACTIVE APP WORKFLOW (SINGLE SCREEN AT A TIME WITH FULL STEP-BY-STEP PROGRESSION) */
          <div className="max-w-4xl mx-auto transition-all duration-200">
            {activeScreen === 'dashboard' && (
              <DashboardScreen
                tripState={tripState}
                onNavigate={(s) => setActiveScreen(s)}
                onApply={() => setActiveScreen('destination')}
              />
            )}

            {activeScreen === 'destination' && (
              <DestinationScreen
                from={tripState.from}
                to={tripState.to}
                purpose={tripState.purpose}
                onChangeFrom={(val) => setTripState((p) => ({ ...p, from: val }))}
                onChangeTo={(val) => setTripState((p) => ({ ...p, to: val }))}
                onChangePurpose={handlePurposeChange}
                onSave={handleSaveTrip}
                onSaveAndNext={() => {
                  setActiveScreen('duration');
                  showToast('Destination saved! Now specify trip duration.');
                }}
                onNavigateHome={() => setActiveScreen('dashboard')}
              />
            )}

            {activeScreen === 'duration' && (
              <DurationScreen
                months={tripState.durationMonths}
                weeks={tripState.durationWeeks}
                days={tripState.durationDays}
                purpose={tripState.purpose}
                onChangeMonths={handleMonthsChange}
                onChangeWeeks={handleWeeksChange}
                onChangeDays={handleDaysChange}
                onChangePurpose={handlePurposeChange}
                onSave={handleSaveTrip}
                onSaveAndNext={() => {
                  setActiveScreen('weather');
                  showToast('Duration saved! Checking live weather forecasts.');
                }}
              />
            )}

            {activeScreen === 'weather' && (
              <WeatherScreen
                fromLocation={tripState.from}
                toLocation={tripState.to}
                onNext={() => {
                  setActiveScreen('luggage');
                  showToast('Reviewing tailored luggage recommendations.');
                }}
              />
            )}

            {activeScreen === 'luggage' && (
              <LuggageScreen
                gender={tripState.gender}
                healthStatus={tripState.healthStatus}
                purpose={tripState.purpose}
                days={totalCalculatedDays}
                selectedClothes={tripState.selectedClothes}
                selectedDocuments={tripState.selectedDocuments}
                selectedMedicines={tripState.selectedMedicines}
                selectedAccessories={tripState.selectedAccessories}
                onChangeGender={handleGenderChange}
                onChangeHealthStatus={(s) => setTripState((p) => ({ ...p, healthStatus: s }))}
                onUpdateClothesCount={handleUpdateClothesCount}
                onResetClothesForPurpose={handleResetClothesForPurpose}
                onToggleDocument={handleToggleDocument}
                onToggleMedicine={handleToggleMedicine}
                onToggleAccessory={handleToggleAccessory}
                onAutoPack={() => setIsGeminiOpen(true)}
                onSave={() => {
                  handleSaveTrip();
                  setActiveScreen('history');
                  showToast('Trip & luggage packing checklist saved to History!');
                }}
              />
            )}

            {activeScreen === 'history' && (
              <HistoryScreen
                history={history}
                onSelectTrip={handleSelectTrip}
                onDeleteTrip={handleDeleteTrip}
                onPlanNewTrip={handlePlanNewTrip}
              />
            )}
          </div>
        )}
      </main>

      {/* 4. Gemini AI Travel Assistant Modal */}
      <GeminiModal
        isOpen={isGeminiOpen}
        onClose={() => setIsGeminiOpen(false)}
        tripState={tripState}
        onApplyPackingSuggestions={handleApplyPackingSuggestions}
      />
    </div>
  );
}
