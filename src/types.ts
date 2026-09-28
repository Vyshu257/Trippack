export type PurposeType = 
  | 'Event' 
  | 'Meetup' 
  | 'Temple' 
  | 'Travel' 
  | 'Business' 
  | 'Vacation' 
  | 'Trekking' 
  | 'Wedding';

export interface TripState {
  from: string;
  to: string;
  durationMonths: number;
  durationWeeks: number;
  durationDays: number;
  purpose: PurposeType | '';
  gender: 'Male' | 'Female';
  healthStatus: 'Healthy' | 'Unhealthy';
  selectedClothes: Record<string, number>;
  selectedDocuments: string[];
  selectedMedicines: string[];
  selectedAccessories: string[];
}

export interface HistoryItem {
  id: string;
  from: string;
  to: string;
  date: string;
  days: number;
  purpose: PurposeType;
  temperature: string;
  weatherIcon: 'sun' | 'cloud' | 'rain';
  savedTripState?: Partial<TripState>;
}

export type WeatherMetric = 'Temperature' | 'AQI' | 'Humidity' | 'Rain Chances';

export interface DayWeather {
  date: string;
  tempFrom: number;
  tempTo: number;
  aqiFrom: number;
  aqiTo: number;
  humidityFrom: number;
  humidityTo: number;
  rainFrom: number;
  rainTo: number;
}
