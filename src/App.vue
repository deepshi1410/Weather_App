<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import { weatherApi } from './services/weatherApi';
import SearchBar from './components/SearchBar.vue';
import WeatherCard from './components/WeatherCard.vue';
import ForecastCard from './components/ForecastCard.vue';
import WeatherBackground from './components/WeatherBackground.vue';

const currentWeather = ref(null);
const forecast = ref([]);
const loading = ref(false);
const toast = useToast();

const searchWeather = async ({ lat, lon, name }) => {
  loading.value = true;
  currentWeather.value = null;
  forecast.value = [];

  try {
    const [weatherData, forecastData] = await Promise.all([
      weatherApi.getCurrentWeather(lat, lon),
      weatherApi.getForecast(lat, lon)
    ]);
    
    currentWeather.value = weatherData;
    forecast.value = forecastData.list.slice(0, 7);
  } catch (error) {
    toast.error(error.message || 'An unexpected error occurred');
  } finally {
    loading.value = false;
  }
};

const handleError = (message) => {
  toast.error(message);
};

onMounted(async () => {
  try {
    const location = await weatherApi.getCurrentLocation();
    searchWeather(location);
  } catch (error) {
    searchWeather({ 
      lat: 51.5074, 
      lon: -0.1278, 
      name: 'London' 
    });
  }
});
</script>

<template>
  <WeatherBackground v-if="currentWeather" :weather="currentWeather">
    <div class="min-h-screen p-6 sm:p-8">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col lg:flex-row lg:items-start gap-8">
          <!-- Left Panel -->
          <div class="lg:w-1/3 space-y-6">
            <SearchBar 
              @search="searchWeather" 
              @error="handleError"
              :class="{ 'opacity-50': loading }"
              :disabled="loading"
            />
            
            <div v-if="loading" class="flex justify-center items-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-white/30 border-t-transparent"></div>
            </div>

            <WeatherCard 
              v-else-if="currentWeather" 
              :weather="currentWeather"
            />
          </div>

          <!-- Right Panel -->
          <div v-if="!loading && forecast.length" class="lg:w-2/3">
            <div class="bg-weather-overlay backdrop-blur-md rounded-3xl p-6 sm:p-8">
              <h2 class="text-2xl font-light text-white/90 mb-6">Today's Highlight</h2>
              
              <!-- Weather Highlights Grid -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <!-- Wind Status -->
                <div class="bg-weather-overlay backdrop-blur-sm rounded-2xl p-6">
                  <h3 class="text-white/70 mb-4">Wind Status</h3>
                  <div class="text-3xl font-light mb-2">
                    {{ Math.round(currentWeather.wind.speed) }}
                    <span class="text-lg">km/h</span>
                  </div>
                  <div class="h-20 flex items-center justify-center">
                    <div class="w-full bg-white/10 rounded-full h-1">
                      <div class="bg-white/30 h-1 rounded-full" :style="{ width: `${(currentWeather.wind.speed / 20) * 100}%` }"></div>
                    </div>
                  </div>
                </div>

                <!-- UV Index -->
                <div class="bg-weather-overlay backdrop-blur-sm rounded-2xl p-6">
                  <h3 class="text-white/70 mb-4">UV Index</h3>
                  <div class="text-3xl font-light mb-2">5.50</div>
                  <div class="h-20 flex items-center justify-center">
                    <div class="w-full bg-gradient-to-r from-green-300 via-yellow-300 to-red-500 h-2 rounded-full"></div>
                  </div>
                </div>

                <!-- Sunrise & Sunset -->
                <div class="bg-weather-overlay backdrop-blur-sm rounded-2xl p-6">
                  <h3 class="text-white/70 mb-4">Sunrise & Sunset</h3>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <span class="text-white/70">Sunrise</span>
                      <span class="text-xl">5:50 AM</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-white/70">Sunset</span>
                      <span class="text-xl">6:30 PM</span>
                    </div>
                  </div>
                </div>

                <!-- Humidity -->
                <div class="bg-weather-overlay backdrop-blur-sm rounded-2xl p-6">
                  <h3 class="text-white/70 mb-4">Humidity</h3>
                  <div class="text-3xl font-light mb-2">
                    {{ currentWeather.main.humidity }}%
                  </div>
                  <div class="text-sm text-white/50">
                    The dew point is {{ Math.round(currentWeather.main.temp - (100 - currentWeather.main.humidity) / 5) }}° right now
                  </div>
                </div>

                <!-- Visibility -->
                <div class="bg-weather-overlay backdrop-blur-sm rounded-2xl p-6">
                  <h3 class="text-white/70 mb-4">Visibility</h3>
                  <div class="text-3xl font-light mb-2">
                    {{ Math.round(currentWeather.visibility / 1000) }}
                    <span class="text-lg">km</span>
                  </div>
                  <div class="text-sm text-white/50">
                    {{ currentWeather.visibility > 5000 ? 'Clear conditions' : 'Haze is affecting visibility' }}
                  </div>
                </div>

                <!-- Feels Like -->
                <div class="bg-weather-overlay backdrop-blur-sm rounded-2xl p-6">
                  <h3 class="text-white/70 mb-4">Feels Like</h3>
                  <div class="text-3xl font-light mb-2">
                    {{ Math.round(currentWeather.main.feels_like) }}°
                  </div>
                  <div class="text-sm text-white/50">
                    {{ currentWeather.main.feels_like > currentWeather.main.temp ? 'Humidity is making it feel warmer' : 'Wind is making it feel cooler' }}
                  </div>
                </div>
              </div>

              <!-- 7-Day Forecast -->
              <h2 class="text-2xl font-light text-white/90 mb-6">7-Day Forecast</h2>
              <div class="flex overflow-x-auto pb-4 gap-4 scrollbar-thin">
                <ForecastCard
                  v-for="(item, index) in forecast"
                  :key="index"
                  :forecast="item"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </WeatherBackground>
  <div v-else class="min-h-screen bg-gray-900 flex items-center justify-center">
    <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-white/30 border-t-transparent"></div>
  </div>
</template>
