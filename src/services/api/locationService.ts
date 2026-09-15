// src/services/api/locationService.ts
// Google Maps Platform integration for finding nearby ATMs, merchants, banks
import { apiClient, handleApiError } from './client';
import { env } from '../../config/env';
import type { Location } from '../../types/location';

export const locationService = {
  /**
   * Find nearby places (ATMs, merchants, banks) using Google Places API
   */
  async findNearbyPlaces(
    latitude: number,
    longitude: number,
    type: 'bank' | 'atm' | 'store' | 'pharmacy' | 'restaurant',
    radius = 2000
  ): Promise<Location[]> {
    try {
      const types: Record<string, string> = {
        bank: 'bank',
        atm: 'atm',
        store: 'store',
        pharmacy: 'pharmacy',
        restaurant: 'restaurant',
      };

      const res = await apiClient.get('/maps/nearby', {
        params: {
          key: env.googleMapsApiKey,
          location: `${latitude},${longitude}`,
          type: types[type] || type,
          radius,
        },
      });
      return res.data;
    } catch (error) {
      const err = handleApiError(error);
      throw new Error(err.message);
    }
  },

  /**
   * Get directions from current location to destination
   */
  async getDirections(
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number,
    mode: 'driving' | 'walking' | 'transit' = 'driving'
  ): Promise<{ distance: string; duration: string; polyline: string[] }> {
    try {
      const res = await apiClient.get('/maps/directions', {
        params: {
          key: env.googleMapsApiKey,
          origin: `${originLat},${originLng}`,
          destination: `${destLat},${destLng}`,
          mode,
        },
      });
      return res.data;
    } catch (error) {
      const err = handleApiError(error);
      throw new Error(err.message);
    }
  },

  /**
   * Geocode an address to coordinates
   */
  async geocodeAddress(address: string): Promise<{ lat: number; lng: number; formattedAddress: string }> {
    try {
      const res = await apiClient.get('/maps/geocode', {
        params: {
          key: env.googleMapsApiKey,
          address,
        },
      });
      return res.data;
    } catch (error) {
      const err = handleApiError(error);
      throw new Error(err.message);
    }
  },

  /**
   * Reverse geocode coordinates to address
   */
  async reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
      const res = await apiClient.get('/maps/reverse-geocode', {
        params: {
          key: env.googleMapsApiKey,
          latlng: `${lat},${lng}`,
        },
      });
      return res.data.formattedAddress;
    } catch (error) {
      const err = handleApiError(error);
      throw new Error(err.message);
    }
  },
};
