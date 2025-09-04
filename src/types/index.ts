

export interface VenuePackage {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
}

export interface WeatherData {
  maxTemp: number;
  minTemp: number;
  condition: string;
  code: number;
}

export interface BookingFormData {
  // Step 1
  date: Date | null;
  timeSlot: 'Morning (9am-1pm)' | 'Afternoon (2pm-6pm)' | 'Evening (7pm-11pm)' | '';

  // Step 2
  eventType: string;
  guests: number;
  selectedPackage: VenuePackage | null;
  
  // Step 3
  name: string;
  email: string;
  phone: string;
  details: string;
}

export interface BookingQuote {
  summary: string;
  quote: {
    packageName: string;
    guestCount: number;
    baseCost: number;
    weekendSurcharge: number;
    totalEstimate: number;
    notes: string[];
  };
  nextSteps: string[];
}

export interface EventInspiration {
  themeName: string;
  planningTip: string;
  colorPalette: string[];
  decorIdeas: string[];
  musicSuggestions: string[];
  signatureCocktail: {
    name: string;
    description: string;
  };
}