import React from 'react';
import { DashboardScreen } from './screens/DashboardScreen';
import { DestinationScreen } from './screens/DestinationScreen';
import { DurationScreen } from './screens/DurationScreen';
import { WeatherScreen } from './screens/WeatherScreen';
import { LuggageScreen } from './screens/LuggageScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { Header } from './Header';
import { TripState, HistoryItem, PurposeType } from '../types';

interface DesignBoardViewProps {
  tripState: TripState;
  history: HistoryItem[];
  onOpenGemini: () => void;
  onOpenHistory: () => void;
  onChangeFrom: (from: string) => void;
  onChangeTo: (to: string) => void;
  onChangePurpose: (p: PurposeType) => void;
  onChangeMonths: (m: number) => void;
  onChangeWeeks: (w: number) => void;
  onChangeDays: (d: number) => void;
  onChangeGender: (g: 'Male' | 'Female') => void;
  onChangeHealthStatus: (s: 'Healthy' | 'Unhealthy') => void;
  onUpdateClothesCount: (clothId: string, delta: number) => void;
  onResetClothesForPurpose?: (gender: 'Male' | 'Female', purpose: PurposeType | '', days: number) => void;
  onToggleDocument: (doc: string) => void;
  onToggleMedicine: (med: string) => void;
  onToggleAccessory: (acc: string) => void;
  onSelectTrip: (trip: HistoryItem) => void;
  onDeleteTrip: (id: string) => void;
  onPlanNewTrip: () => void;
  onSaveTrip: () => void;
  onNavigateToScreen: (screen: 'dashboard' | 'destination' | 'duration' | 'weather' | 'luggage' | 'history') => void;
}

export const DesignBoardView: React.FC<DesignBoardViewProps> = (props) => {
  return (
    <div className="w-full flex flex-col gap-8 pb-16">
      {/* Design Board Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-block px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-xs font-semibold mb-1">
            Clean Design Assets Specification
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Trippack 6-Screen Responsive Design Board
          </h2>
          <p className="text-xs sm:text-sm text-blue-200/80 mt-0.5">
            Cleaned version without plain-text annotations on Destination page & without option type dropdown on Luggage page.
          </p>
        </div>
      </div>

      {/* Grid of the 6 panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 items-start">
        {/* PANEL 1: Home Page / Dashboard */}
        <div className="flex flex-col gap-2 bg-[#F6F9FD] p-3 sm:p-4 rounded-3xl border-2 border-blue-200/80 shadow-sm">
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-xs sm:text-sm font-black text-[#1746A2] uppercase tracking-wide">
              1. Home Page / Dashboard
            </span>
            <button
              onClick={() => props.onNavigateToScreen('dashboard')}
              className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Open Full Screen ↗
            </button>
          </div>
          <div className="rounded-2xl overflow-hidden border border-blue-100 bg-white">
            <Header
              onOpenGemini={props.onOpenGemini}
              onOpenHistory={props.onOpenHistory}
            />
            <div className="p-3 sm:p-4">
              <DashboardScreen
                tripState={props.tripState}
                onNavigate={(s) => props.onNavigateToScreen(s)}
                onApply={() => props.onNavigateToScreen('luggage')}
              />
            </div>
          </div>
        </div>

        {/* PANEL 2: Destination Page */}
        <div className="flex flex-col gap-2 bg-[#F6F9FD] p-3 sm:p-4 rounded-3xl border-2 border-blue-200/80 shadow-sm">
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-xs sm:text-sm font-black text-[#1746A2] uppercase tracking-wide">
              2. Destination Page (Cleaned)
            </span>
            <button
              onClick={() => props.onNavigateToScreen('destination')}
              className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Open Full Screen ↗
            </button>
          </div>
          <div className="rounded-2xl overflow-hidden border border-blue-100 bg-white">
            <Header
              onOpenGemini={props.onOpenGemini}
              onOpenHistory={props.onOpenHistory}
            />
            <div className="p-3 sm:p-4">
              <DestinationScreen
                from={props.tripState.from}
                to={props.tripState.to}
                purpose={props.tripState.purpose}
                onChangeFrom={props.onChangeFrom}
                onChangeTo={props.onChangeTo}
                onChangePurpose={props.onChangePurpose}
                onSave={props.onSaveTrip}
                onSaveAndNext={() => props.onNavigateToScreen('duration')}
              />
            </div>
          </div>
        </div>

        {/* PANEL 3: Duration Page */}
        <div className="flex flex-col gap-2 bg-[#F6F9FD] p-3 sm:p-4 rounded-3xl border-2 border-blue-200/80 shadow-sm">
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-xs sm:text-sm font-black text-[#1746A2] uppercase tracking-wide">
              3. Duration Page
            </span>
            <button
              onClick={() => props.onNavigateToScreen('duration')}
              className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Open Full Screen ↗
            </button>
          </div>
          <div className="rounded-2xl overflow-hidden border border-blue-100 bg-white">
            <Header
              onOpenGemini={props.onOpenGemini}
              onOpenHistory={props.onOpenHistory}
            />
            <div className="p-3 sm:p-4">
              <DurationScreen
                months={props.tripState.durationMonths}
                weeks={props.tripState.durationWeeks}
                days={props.tripState.durationDays}
                purpose={props.tripState.purpose}
                onChangeMonths={props.onChangeMonths}
                onChangeWeeks={props.onChangeWeeks}
                onChangeDays={props.onChangeDays}
                onChangePurpose={props.onChangePurpose}
                onSave={props.onSaveTrip}
                onSaveAndNext={() => props.onNavigateToScreen('weather')}
              />
            </div>
          </div>
        </div>

        {/* PANEL 4: Weather Report Page */}
        <div className="flex flex-col gap-2 bg-[#F6F9FD] p-3 sm:p-4 rounded-3xl border-2 border-blue-200/80 shadow-sm">
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-xs sm:text-sm font-black text-[#1746A2] uppercase tracking-wide">
              4. Weather Report Page
            </span>
            <button
              onClick={() => props.onNavigateToScreen('weather')}
              className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Open Full Screen ↗
            </button>
          </div>
          <div className="rounded-2xl overflow-hidden border border-blue-100 bg-white">
            <Header
              onOpenGemini={props.onOpenGemini}
              onOpenHistory={props.onOpenHistory}
            />
            <div className="p-3 sm:p-4">
              <WeatherScreen
                fromLocation={props.tripState.from}
                toLocation={props.tripState.to}
                onNext={() => props.onNavigateToScreen('luggage')}
              />
            </div>
          </div>
        </div>

        {/* PANEL 5: Luggage Suggestion Page */}
        <div className="flex flex-col gap-2 bg-[#F6F9FD] p-3 sm:p-4 rounded-3xl border-2 border-blue-200/80 shadow-sm">
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-xs sm:text-sm font-black text-[#1746A2] uppercase tracking-wide">
              5. Luggage Suggestion Page (Cleaned)
            </span>
            <button
              onClick={() => props.onNavigateToScreen('luggage')}
              className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Open Full Screen ↗
            </button>
          </div>
          <div className="rounded-2xl overflow-hidden border border-blue-100 bg-white">
            <Header
              onOpenGemini={props.onOpenGemini}
              onOpenHistory={props.onOpenHistory}
            />
            <div className="p-3 sm:p-4">
              <LuggageScreen
                gender={props.tripState.gender}
                healthStatus={props.tripState.healthStatus}
                purpose={props.tripState.purpose}
                days={props.tripState.durationDays || 4}
                selectedClothes={props.tripState.selectedClothes}
                selectedDocuments={props.tripState.selectedDocuments}
                selectedMedicines={props.tripState.selectedMedicines}
                selectedAccessories={props.tripState.selectedAccessories}
                onChangeGender={props.onChangeGender}
                onChangeHealthStatus={props.onChangeHealthStatus}
                onUpdateClothesCount={props.onUpdateClothesCount}
                onResetClothesForPurpose={props.onResetClothesForPurpose}
                onToggleDocument={props.onToggleDocument}
                onToggleMedicine={props.onToggleMedicine}
                onToggleAccessory={props.onToggleAccessory}
                onAutoPack={props.onOpenGemini}
                onSave={props.onSaveTrip}
              />
            </div>
          </div>
        </div>

        {/* PANEL 6: History Page */}
        <div className="flex flex-col gap-2 bg-[#F6F9FD] p-3 sm:p-4 rounded-3xl border-2 border-blue-200/80 shadow-sm">
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-xs sm:text-sm font-black text-[#1746A2] uppercase tracking-wide">
              6. History Page
            </span>
            <button
              onClick={() => props.onNavigateToScreen('history')}
              className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Open Full Screen ↗
            </button>
          </div>
          <div className="rounded-2xl overflow-hidden border border-blue-100 bg-white">
            <Header
              onOpenGemini={props.onOpenGemini}
              onOpenHistory={props.onOpenHistory}
            />
            <div className="p-3 sm:p-4">
              <HistoryScreen
                history={props.history}
                onSelectTrip={(t) => {
                  props.onSelectTrip(t);
                  props.onNavigateToScreen('dashboard');
                }}
                onDeleteTrip={props.onDeleteTrip}
                onPlanNewTrip={props.onPlanNewTrip}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
