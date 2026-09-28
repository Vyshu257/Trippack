import { HistoryItem, DayWeather, PurposeType } from '../types';

export const POPULAR_ROUTES = [
  { from: 'Hyderabad', to: 'Bangalore' },
  { from: 'Bangalore', to: 'Hyderabad' },
  { from: 'Delhi', to: 'Mumbai' },
  { from: 'Mumbai', to: 'Goa' },
  { from: 'Chennai', to: 'Bangalore' },
  { from: 'Kolkata', to: 'Delhi' },
  { from: 'Pune', to: 'Goa' },
  { from: 'Ahmedabad', to: 'Jaipur' },
];

export const PURPOSES: PurposeType[] = [
  'Event',
  'Meetup',
  'Temple',
  'Travel',
  'Business',
  'Vacation',
  'Trekking',
  'Wedding',
];

export const INITIAL_WEATHER_DATA: DayWeather[] = [
  { date: 'Apr 20', tempFrom: 21, tempTo: 27, aqiFrom: 68, aqiTo: 52, humidityFrom: 45, humidityTo: 58, rainFrom: 10, rainTo: 15 },
  { date: 'Apr 21', tempFrom: 24, tempTo: 30, aqiFrom: 72, aqiTo: 55, humidityFrom: 42, humidityTo: 54, rainFrom: 5, rainTo: 10 },
  { date: 'Apr 22', tempFrom: 25, tempTo: 31, aqiFrom: 75, aqiTo: 60, humidityFrom: 40, humidityTo: 50, rainFrom: 0, rainTo: 5 },
  { date: 'Apr 23', tempFrom: 23, tempTo: 30, aqiFrom: 70, aqiTo: 58, humidityFrom: 48, humidityTo: 55, rainFrom: 15, rainTo: 20 },
  { date: 'Apr 24', tempFrom: 22, tempTo: 29, aqiFrom: 65, aqiTo: 54, humidityFrom: 50, humidityTo: 60, rainFrom: 20, rainTo: 25 },
  { date: 'Apr 25', tempFrom: 24, tempTo: 31, aqiFrom: 78, aqiTo: 62, humidityFrom: 44, humidityTo: 52, rainFrom: 10, rainTo: 10 },
  { date: 'Apr 26', tempFrom: 26, tempTo: 32, aqiFrom: 80, aqiTo: 65, humidityFrom: 38, humidityTo: 48, rainFrom: 5, rainTo: 5 },
];

// Male Specific Clothing Items
export const MALE_CLOTHES = [
  { id: 'suit', name: 'Suit / Blazer', icon: 'suit' },
  { id: 'tshirt', name: 'T-Shirt / Polo', icon: 'tshirt' },
  { id: 'jeans', name: 'Jeans / Pants', icon: 'jeans' },
  { id: 'formal_shirt', name: 'Formal Shirt', icon: 'formal_shirt' },
  { id: 'shorts', name: 'Shorts / Casuals', icon: 'shorts' },
  { id: 'kurta', name: 'Kurta Pyjama', icon: 'kurta' },
  { id: 'jacket', name: 'Jacket / Hoodie', icon: 'jacket' },
];

// Female Specific Clothing Items (including Chudidar, Sarees, Kurtis, etc.)
export const FEMALE_CLOTHES = [
  { id: 'chuddar', name: 'Chudidar / Salwar', icon: 'chuddar' },
  { id: 'saree', name: 'Saree / Ethnic Wear', icon: 'saree' },
  { id: 'female_top', name: 'Kurtis / Tops', icon: 'female_top' },
  { id: 'female_jeans', name: 'Jeans / Palazzos', icon: 'female_jeans' },
  { id: 'dupatta', name: 'Dupatta / Stole', icon: 'dupatta' },
  { id: 'dress', name: 'Dress / Formal Blazer', icon: 'dress' },
  { id: 'nightwear', name: 'Nightwear / Loungewear', icon: 'nightwear' },
];

// Calculate dynamic clothing counts based on gender, purpose and trip duration
export function getRecommendedClothes(
  gender: 'Male' | 'Female',
  purpose: PurposeType | '',
  days: number
): Record<string, number> {
  const safeDays = Math.max(1, Math.min(days || 3, 30));
  const counts: Record<string, number> = {};

  if (gender === 'Female') {
    switch (purpose) {
      case 'Temple':
        counts['chuddar'] = Math.min(safeDays, 4);
        counts['saree'] = Math.min(Math.ceil(safeDays / 2), 3);
        counts['female_top'] = 2;
        counts['female_jeans'] = 1;
        counts['dupatta'] = Math.min(safeDays, 3);
        counts['dress'] = 0;
        counts['nightwear'] = Math.min(Math.ceil(safeDays / 2), 3);
        break;

      case 'Wedding':
        counts['chuddar'] = 2;
        counts['saree'] = Math.min(safeDays, 4);
        counts['female_top'] = 2;
        counts['female_jeans'] = 1;
        counts['dupatta'] = 3;
        counts['dress'] = 2;
        counts['nightwear'] = 2;
        break;

      case 'Event':
      case 'Business':
        counts['dress'] = Math.min(safeDays, 3);
        counts['female_top'] = Math.min(safeDays, 4);
        counts['female_jeans'] = Math.min(Math.ceil(safeDays / 2), 3);
        counts['chuddar'] = 1;
        counts['saree'] = purpose === 'Event' ? 1 : 0;
        counts['dupatta'] = 1;
        counts['nightwear'] = Math.min(Math.ceil(safeDays / 2), 2);
        break;

      case 'Trekking':
        counts['female_top'] = Math.min(safeDays + 1, 6);
        counts['female_jeans'] = Math.min(Math.ceil(safeDays / 2), 3);
        counts['chuddar'] = 0;
        counts['saree'] = 0;
        counts['dupatta'] = 1;
        counts['dress'] = 0;
        counts['nightwear'] = 2;
        break;

      case 'Vacation':
      case 'Meetup':
      case 'Travel':
      default:
        counts['female_top'] = Math.min(safeDays, 5);
        counts['female_jeans'] = Math.min(Math.ceil(safeDays / 2), 3);
        counts['chuddar'] = 2;
        counts['saree'] = 0;
        counts['dupatta'] = 2;
        counts['dress'] = 1;
        counts['nightwear'] = Math.min(Math.ceil(safeDays / 2), 3);
        break;
    }
  } else {
    // Male
    switch (purpose) {
      case 'Temple':
        counts['kurta'] = Math.min(safeDays, 4);
        counts['tshirt'] = 2;
        counts['jeans'] = Math.min(Math.ceil(safeDays / 2), 2);
        counts['formal_shirt'] = 1;
        counts['suit'] = 0;
        counts['shorts'] = 1;
        counts['jacket'] = 0;
        break;

      case 'Wedding':
        counts['kurta'] = Math.min(safeDays, 3);
        counts['suit'] = Math.min(Math.ceil(safeDays / 2), 2);
        counts['formal_shirt'] = Math.min(safeDays, 3);
        counts['jeans'] = 2;
        counts['tshirt'] = 2;
        counts['shorts'] = 1;
        counts['jacket'] = 0;
        break;

      case 'Event':
      case 'Business':
        counts['suit'] = Math.min(safeDays, 2);
        counts['formal_shirt'] = Math.min(safeDays + 1, 5);
        counts['jeans'] = Math.min(Math.ceil(safeDays / 2), 3);
        counts['tshirt'] = 2;
        counts['shorts'] = 1;
        counts['kurta'] = 0;
        counts['jacket'] = 1;
        break;

      case 'Trekking':
        counts['tshirt'] = Math.min(safeDays + 1, 6);
        counts['jeans'] = Math.min(Math.ceil(safeDays / 2), 3);
        counts['shorts'] = 2;
        counts['jacket'] = 2;
        counts['suit'] = 0;
        counts['formal_shirt'] = 0;
        counts['kurta'] = 0;
        break;

      case 'Vacation':
      case 'Meetup':
      case 'Travel':
      default:
        counts['tshirt'] = Math.min(safeDays, 5);
        counts['jeans'] = Math.min(Math.ceil(safeDays / 2), 3);
        counts['shorts'] = Math.min(Math.ceil(safeDays / 2), 3);
        counts['formal_shirt'] = 1;
        counts['suit'] = 0;
        counts['kurta'] = 0;
        counts['jacket'] = 1;
        break;
    }
  }

  return counts;
}

export const DEFAULT_DOCUMENTS = [
  'ID Proof (Aadhar / Passport)',
  'Tickets / Bookings',
  'Travel Insurance',
  'Important Docs',
];

export const DEFAULT_MEDICINES = [
  'Paracetamol',
  'Allergy',
  'Antacids',
  'Pain Relief',
  'Motion Sickness',
  'First Aid Kit',
];

export const DEFAULT_ACCESSORIES = [
  'Chargers & Power Bank',
  'Toiletries',
  'Sunglasses / Cap',
  'Travel Adapter',
  'Others',
];

export const INITIAL_HISTORY: HistoryItem[] = [
  {
    id: 'trip-1',
    from: 'Hyderabad',
    to: 'Bangalore',
    date: '12 Apr 2025',
    days: 6,
    purpose: 'Event',
    temperature: '28°C',
    weatherIcon: 'sun',
    savedTripState: {
      from: 'Hyderabad',
      to: 'Bangalore',
      durationMonths: 0,
      durationWeeks: 0,
      durationDays: 6,
      purpose: 'Event',
      gender: 'Male',
      healthStatus: 'Healthy',
      selectedClothes: { suit: 1, tshirt: 5, jeans: 2, formal_shirt: 2, shorts: 2 },
      selectedDocuments: ['ID Proof (Aadhar / Passport)', 'Tickets / Bookings'],
      selectedMedicines: ['Paracetamol'],
      selectedAccessories: ['Chargers & Power Bank', 'Toiletries', 'Sunglasses / Cap'],
    }
  },
  {
    id: 'trip-2',
    from: 'Delhi',
    to: 'Mumbai',
    date: '20 Mar 2025',
    days: 3,
    purpose: 'Travel',
    temperature: '22°C',
    weatherIcon: 'cloud',
    savedTripState: {
      from: 'Delhi',
      to: 'Mumbai',
      durationMonths: 0,
      durationWeeks: 0,
      durationDays: 3,
      purpose: 'Travel',
      gender: 'Male',
      healthStatus: 'Healthy',
      selectedClothes: { tshirt: 3, jeans: 2, shorts: 1 },
      selectedDocuments: ['ID Proof (Aadhar / Passport)', 'Tickets / Bookings'],
      selectedMedicines: [],
      selectedAccessories: ['Chargers & Power Bank', 'Toiletries'],
    }
  },
  {
    id: 'trip-3',
    from: 'Chennai',
    to: 'Bangalore',
    date: '10 Mar 2025',
    days: 2,
    purpose: 'Meetup',
    temperature: '30°C',
    weatherIcon: 'sun',
    savedTripState: {
      from: 'Chennai',
      to: 'Bangalore',
      durationMonths: 0,
      durationWeeks: 0,
      durationDays: 2,
      purpose: 'Meetup',
      gender: 'Male',
      healthStatus: 'Healthy',
      selectedClothes: { tshirt: 2, jeans: 1, formal_shirt: 1 },
      selectedDocuments: ['ID Proof (Aadhar / Passport)', 'Tickets / Bookings'],
      selectedMedicines: [],
      selectedAccessories: ['Chargers & Power Bank'],
    }
  },
  {
    id: 'trip-4',
    from: 'Kolkata',
    to: 'Delhi',
    date: '5 Feb 2025',
    days: 4,
    purpose: 'Temple',
    temperature: '24°C',
    weatherIcon: 'rain',
    savedTripState: {
      from: 'Kolkata',
      to: 'Delhi',
      durationMonths: 0,
      durationWeeks: 0,
      durationDays: 4,
      purpose: 'Temple',
      gender: 'Female',
      healthStatus: 'Healthy',
      selectedClothes: { chuddar: 3, saree: 1, dupatta: 2, female_top: 2, nightwear: 2 },
      selectedDocuments: ['ID Proof (Aadhar / Passport)', 'Tickets / Bookings'],
      selectedMedicines: ['Paracetamol'],
      selectedAccessories: ['Chargers & Power Bank', 'Toiletries'],
    }
  }
];
