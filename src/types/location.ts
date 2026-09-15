// src/types/location.ts
export interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'bank' | 'atm' | 'store' | 'pharmacy' | 'restaurant';
  distance: number;
  rating?: number;
  openNow?: boolean;
  phone?: string;
  icon?: string;
}

export interface DirectionsResult {
  distance: string;
  duration: string;
  polyline: string[];
}

export interface GeocodeResult {
  lat: number;
  lng: number;
  formattedAddress: string;
}
