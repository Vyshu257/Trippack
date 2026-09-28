import React, { useState } from 'react';
import {
  Luggage,
  Shirt,
  FileText,
  PlusCircle,
  Headphones,
  Check,
  Plus,
  Minus,
  Sparkles,
  Sparkle,
  Save,
  RotateCcw
} from 'lucide-react';
import {
  MALE_CLOTHES,
  FEMALE_CLOTHES,
  DEFAULT_DOCUMENTS,
  DEFAULT_MEDICINES,
  DEFAULT_ACCESSORIES,
  getRecommendedClothes
} from '../../data/mockData';
import { PurposeType } from '../../types';

interface LuggageScreenProps {
  gender: 'Male' | 'Female';
  healthStatus: 'Healthy' | 'Unhealthy';
  purpose?: PurposeType | '';
  days?: number;
  selectedClothes: Record<string, number>;
  selectedDocuments: string[];
  selectedMedicines: string[];
  selectedAccessories: string[];
  onChangeGender: (gender: 'Male' | 'Female') => void;
  onChangeHealthStatus: (status: 'Healthy' | 'Unhealthy') => void;
  onUpdateClothesCount: (clothId: string, delta: number) => void;
  onResetClothesForPurpose?: (gender: 'Male' | 'Female', purpose: PurposeType | '', days: number) => void;
  onToggleDocument: (doc: string) => void;
  onToggleMedicine: (med: string) => void;
  onToggleAccessory: (acc: string) => void;
  onAutoPack?: () => void;
  onSave?: () => void;
}

export const LuggageScreen: React.FC<LuggageScreenProps> = ({
  gender,
  healthStatus,
  purpose = 'Travel',
  days = 4,
  selectedClothes,
  selectedDocuments,
  selectedMedicines,
  selectedAccessories,
  onChangeGender,
  onChangeHealthStatus,
  onUpdateClothesCount,
  onResetClothesForPurpose,
  onToggleDocument,
  onToggleMedicine,
  onToggleAccessory,
  onAutoPack,
  onSave,
}) => {
  const [customDocInput, setCustomDocInput] = useState('');
  const [customMedInput, setCustomMedInput] = useState('');
  const [customAccInput, setCustomAccInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Clothing items based on selected gender
  const currentClothesList = gender === 'Female' ? FEMALE_CLOTHES : MALE_CLOTHES;

  // Icon mapper for male and female clothes
  const renderClothIcon = (iconName: string) => {
    switch (iconName) {
      // Female Specific Icons
      case 'chuddar':
        return (
          <svg className="w-6 h-6 text-[#1746A2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 3l4 3 4-3v6l-2 12H10L8 9V3z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 5L4 8l2 4 2-1" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 5l4 8-2 4-2-1" />
          </svg>
        );
      case 'saree':
        return (
          <svg className="w-6 h-6 text-[#1746A2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 3c3 0 5 4 8 4s4-2 4-4v18c-3 0-5-3-8-3s-4 3-4 3V3z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 8c3 0 5 4 8 4s4-2 4-4" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 14c3 0 5 4 8 4s4-2 4-4" />
          </svg>
        );
      case 'female_top':
        return (
          <svg className="w-6 h-6 text-[#1746A2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 3a3 3 0 006 0l4 3-2 4-2-1v11H9V9L7 10 5 6l4-3z" />
          </svg>
        );
      case 'female_jeans':
        return (
          <svg className="w-6 h-6 text-[#1746A2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 4h10l1 16-4.5 1-1.5-12-1.5 12L6 20 7 4z" />
            <line x1="7" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        );
      case 'dupatta':
        return (
          <svg className="w-6 h-6 text-[#1746A2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 6c3-2 8-2 14 0v12c-6-2-11-2-14 0V6z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" strokeDasharray="2,2" d="M5 12c3-1 8-1 14 0" />
          </svg>
        );
      case 'dress':
        return (
          <svg className="w-6 h-6 text-[#1746A2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 3l3 2 3-2 2 5-3 12H7L4 8l5-5z" />
          </svg>
        );
      case 'nightwear':
        return (
          <svg className="w-6 h-6 text-[#1746A2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        );

      // Male Specific Icons
      case 'suit':
        return (
          <svg className="w-6 h-6 text-[#1746A2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 3l6 5 6-5 1 18H5L6 3z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8v13" />
            <polygon points="12,8 10,13 12,14 14,13" fill="#1746A2" />
          </svg>
        );
      case 'tshirt':
        return <Shirt className="w-6 h-6 text-[#1746A2]" />;
      case 'jeans':
        return (
          <svg className="w-6 h-6 text-[#1746A2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 4h10l1 17-4.5-1-1.5-11-1.5 11L6 21 7 4z" />
            <line x1="7" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        );
      case 'formal_shirt':
        return (
          <svg className="w-6 h-6 text-[#1746A2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 3l3 4 3-4 4 3-2 15H7L5 6l4-3z" />
            <line x1="12" y1="7" x2="12" y2="21" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        );
      case 'shorts':
        return (
          <svg className="w-6 h-6 text-[#1746A2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 5h10l1 9-5-1-1-4-1 4-5 1 1-9z" />
          </svg>
        );
      case 'kurta':
        return (
          <svg className="w-6 h-6 text-[#1746A2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 3h6l3 4-2 14H8L6 7l3-4z" />
            <line x1="12" y1="3" x2="12" y2="10" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        );
      case 'jacket':
        return (
          <svg className="w-6 h-6 text-[#1746A2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 4l5 3 5-3 3 6-3 11H7L4 10l3-6z" />
            <line x1="12" y1="7" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeDasharray="3,3" />
          </svg>
        );
      default:
        return <Shirt className="w-6 h-6 text-[#1746A2]" />;
    }
  };

  // Calculate packed counts
  const totalClothes = Object.values(selectedClothes).reduce((a, b) => a + b, 0);
  const totalItems = totalClothes + selectedDocuments.length + selectedMedicines.length + selectedAccessories.length;

  const handleGenderToggle = (newGender: 'Male' | 'Female') => {
    onChangeGender(newGender);
    if (onResetClothesForPurpose) {
      onResetClothesForPurpose(newGender, purpose, days);
    }
  };

  const handleSaveClick = () => {
    if (onSave) {
      onSave();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  // Purpose-specific label and recommendation highlight
  const getPurposeHint = () => {
    switch (purpose) {
      case 'Temple':
        return gender === 'Female'
          ? 'Suggested for Temple: Modest Chudidar / Salwar, Sarees & Dupattas'
          : 'Suggested for Temple: Traditional Kurta Pyjama & comfortable cottons';
      case 'Wedding':
        return gender === 'Female'
          ? 'Suggested for Wedding: Heavy Sarees, Lehengas & designer Chudidar'
          : 'Suggested for Wedding: Traditional Kurta, Suit / Blazer & Formals';
      case 'Event':
      case 'Business':
        return gender === 'Female'
          ? 'Suggested for Business/Event: Formal Blazer, Dresses & Elegant Tops'
          : 'Suggested for Business/Event: Suits, Formal Shirts & Chinos';
      case 'Trekking':
        return 'Suggested for Trekking: Quick-dry tops, trek pants & weather jackets';
      case 'Vacation':
        return 'Suggested for Vacation: Casual breathable tops, shorts/palazzos & loungewear';
      default:
        return `Suggested for ${purpose || 'Travel'}: Balanced casual & comfortable wear for ${days} days`;
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-blue-100/90 shadow-xs p-5 sm:p-7 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#1746A2]">
            <Luggage className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Luggage Suggestion
            </h2>
            <div className="text-xs text-blue-700 font-medium flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>{getPurposeHint()}</span>
            </div>
          </div>
        </div>

        {/* Packed Items Count & Smart Auto Pack */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
            {totalItems} items packed
          </span>
          {onAutoPack && (
            <button
              onClick={onAutoPack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full border border-blue-200 transition-colors cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>AI Auto-Pack</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Modular Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* ================= CARD 1: CLOTHES ================= */}
        <div className="p-4 sm:p-5 rounded-2xl border border-blue-100/90 bg-white shadow-2xs flex flex-col gap-4">
          {/* Card Title & Gender Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#1746A2]">
                <Shirt className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Clothes ({gender})
              </h3>
            </div>

            {/* Quick Reset to Purpose Preset */}
            {onResetClothesForPurpose && (
              <button
                type="button"
                onClick={() => onResetClothesForPurpose(gender, purpose, days)}
                title="Recalculate for purpose and duration"
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Auto-Adjust</span>
              </button>
            )}
          </div>

          {/* Gender Selector: Gender > [ Male ] [ Female ] */}
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <span className="font-semibold text-gray-700">Gender &gt;</span>
            <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50">
              <button
                type="button"
                onClick={() => handleGenderToggle('Male')}
                className={`px-3.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${gender === 'Male'
                  ? 'bg-[#1746A2] text-white shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => handleGenderToggle('Female')}
                className={`px-3.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${gender === 'Female'
                  ? 'bg-[#1746A2] text-white shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Female
              </button>
            </div>
          </div>

          {/* NOTE: Per user request:
              1. NO "Type: Select clothing type v" dropdown.
              2. Female clothes properly include Chudidar, Sarees, Tops, Palazzos, Dupatta, etc.
              3. Quantities dynamically reflect user purpose (Temple, Event, Trekking, etc.) */}

          {/* Dynamic Clothing Items Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {currentClothesList.map((cloth) => {
              const count = selectedClothes[cloth.id] ?? 0;
              const isSelected = count > 0;

              return (
                <div
                  key={cloth.id}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-between text-center transition-all ${isSelected
                    ? 'border-blue-400 bg-blue-50/50 shadow-2xs'
                    : 'border-gray-200 bg-gray-50/40 opacity-70'
                    }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center mb-1 shadow-2xs">
                    {renderClothIcon(cloth.icon)}
                  </div>
                  <span className="text-[11px] font-semibold text-gray-800 truncate w-full mb-1.5" title={cloth.name}>
                    {cloth.name}
                  </span>

                  {/* Quantity Counter */}
                  <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-md px-1 py-0.5">
                    <button
                      type="button"
                      onClick={() => onUpdateClothesCount(cloth.id, -1)}
                      className="text-gray-500 hover:text-blue-700 p-0.5 cursor-pointer disabled:opacity-30"
                      disabled={count <= 0}
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                    <span className="text-xs font-bold text-gray-900 min-w-[12px]">
                      {count}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateClothesCount(cloth.id, 1)}
                      className="text-gray-500 hover:text-blue-700 p-0.5 cursor-pointer"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= CARD 2: DOCUMENTS ================= */}
        <div className="p-4 sm:p-5 rounded-2xl border border-blue-100/90 bg-white shadow-2xs flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#1746A2]">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Documents</h3>
          </div>

          {/* Checklist */}
          <div className="flex flex-col gap-2.5">
            {[
              ...DEFAULT_DOCUMENTS,
              ...selectedDocuments.filter(
                (doc) => !DEFAULT_DOCUMENTS.includes(doc)
              ),
            ].map((doc) => {
              const isChecked = selectedDocuments.includes(doc);
              return (
                <label
                  key={doc}
                  onClick={() => onToggleDocument(doc)}
                  className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-gray-700 cursor-pointer select-none group"
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${isChecked
                      ? 'bg-[#1746A2] border-[#1746A2] text-white'
                      : 'border-gray-300 bg-white group-hover:border-blue-400'
                      }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className={isChecked ? 'text-gray-900 font-semibold' : 'text-gray-700'}>
                    {doc}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Custom Document Input */}
          <div className="pt-2 flex items-center gap-2">
            <input
              type="text"
              value={customDocInput}
              onChange={(e) => setCustomDocInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customDocInput.trim()) {
                  onToggleDocument(customDocInput.trim());
                  setCustomDocInput('');
                }
              }}
              placeholder="Add other document..."
              className="flex-1 px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
            />
            <button
              type="button"
              onClick={() => {
                if (customDocInput.trim()) {
                  onToggleDocument(customDocInput.trim());
                  setCustomDocInput('');
                }
              }}
              className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ================= CARD 3: MEDICINES ================= */}
        <div className="p-4 sm:p-5 rounded-2xl border border-blue-100/90 bg-white shadow-2xs flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#1746A2]">
              <PlusCircle className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Medicines</h3>
          </div>

          {/* Health Status > [ Healthy ] [ Unhealthy ] */}
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <span className="font-semibold text-gray-700">Health Status &gt;</span>
            <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50">
              <button
                type="button"
                onClick={() => onChangeHealthStatus('Healthy')}
                className={`px-3.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${healthStatus === 'Healthy'
                  ? 'bg-[#1746A2] text-white shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Healthy
              </button>
              <button
                type="button"
                onClick={() => onChangeHealthStatus('Unhealthy')}
                className={`px-3.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${healthStatus === 'Unhealthy'
                  ? 'bg-[#1746A2] text-white shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Unhealthy
              </button>
            </div>
          </div>

          {/* Select Medicines (if any) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Select Medicines (if any)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {[
                ...DEFAULT_MEDICINES,
                ...selectedMedicines.filter(
                  (med) => !DEFAULT_MEDICINES.includes(med)
                ),
              ].map((med) => {
                const isSelected = selectedMedicines.includes(med);
                return (
                  <button
                    key={med}
                    type="button"
                    onClick={() => onToggleMedicine(med)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${isSelected
                      ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-blue-300'
                      }`}
                  >
                    {isSelected && <span className="mr-1">✓</span>}
                    {med}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 italic">
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={customMedInput}
                  onChange={(e) => setCustomMedInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customMedInput.trim()) {
                      onToggleMedicine(customMedInput.trim());
                      setCustomMedInput('');
                    }
                  }}
                  placeholder="Add other medicine..."
                  className="flex-1 px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                />

                <button
                  type="button"
                  onClick={() => {
                    if (customMedInput.trim()) {
                      onToggleMedicine(customMedInput.trim());
                      setCustomMedInput('');
                    }
                  }}
                  className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-blue-500 font-bold">🏷️</span>
              <span>Example: Paracetamol, Allergy, etc.</span>
            </div>
          </div>
        </div>

        {/* ================= CARD 4: ACCESSORIES ================= */}
        <div className="p-4 sm:p-5 rounded-2xl border border-blue-100/90 bg-white shadow-2xs flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#1746A2]">
              <Headphones className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Accessories</h3>
          </div>

          {/* Checklist */}
          <div className="flex flex-col gap-2.5">
            {[
              ...DEFAULT_ACCESSORIES,
              ...selectedAccessories.filter(
                (acc) => !DEFAULT_ACCESSORIES.includes(acc)
              ),
            ].map((acc) => {
              const isChecked = selectedAccessories.includes(acc);
              return (
                <label
                  key={acc}
                  onClick={() => onToggleAccessory(acc)}
                  className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-gray-700 cursor-pointer select-none group"
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${isChecked
                      ? 'bg-[#1746A2] border-[#1746A2] text-white'
                      : 'border-gray-300 bg-white group-hover:border-blue-400'
                      }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className={isChecked ? 'text-gray-900 font-semibold' : 'text-gray-700'}>
                    {acc}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Add Custom Accessory */}
          <div className="pt-2 flex items-center gap-2">
            <input
              type="text"
              value={customAccInput}
              onChange={(e) => setCustomAccInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customAccInput.trim()) {
                  onToggleAccessory(customAccInput.trim());
                  setCustomAccInput('');
                }
              }}
              placeholder="Add other accessories..."
              className="flex-1 px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
            />
            <button
              type="button"
              onClick={() => {
                if (customAccInput.trim()) {
                  onToggleAccessory(customAccInput.trim());
                  setCustomAccInput('');
                }
              }}
              className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Save / Finish Action at Bottom Right */}
      {onSave && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSaveClick}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1746A2] hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold rounded-xl shadow-xs transition-all duration-150 cursor-pointer hover:shadow-md"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Saved to Trip!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 stroke-[2.2]" />
                <span>Save to History</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
