import axios from 'axios';

const API_KEY = '1f3750e532e024955265f9fd9c50d0a8';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    appid: API_KEY,
    units: 'metric'
  }
});

const geoApi = axios.create({
  baseURL: GEO_URL,
  params: {
    appid: API_KEY,
    limit: 5
  }
});

export const weatherApi = {
  async getCurrentWeather(lat, lon) {
    try {
      const response = await api.get('/weather', {
        params: { lat, lon }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch weather data. Please try again later.');
    }
  },

  async getForecast(lat, lon) {
    try {
      const response = await api.get('/forecast', {
        params: { lat, lon }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch forecast data. Please try again later.');
    }
  },

  async searchCities(query) {
    if (!query?.trim()) return [];
    try {
      const response = await geoApi.get('/direct', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch city suggestions.');
    }
  },

  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude: lat, longitude: lon } = position.coords;
            const response = await geoApi.get('/reverse', {
              params: { lat, lon, limit: 1 }
            });
            resolve({
              lat,
              lon,
              name: response.data[0]?.name || 'Current Location'
            });
          } catch (error) {
            reject(new Error('Failed to get location details'));
          }
        },
        () => {
          reject(new Error('Unable to retrieve your location'));
        }
      );
    });
  }
};
