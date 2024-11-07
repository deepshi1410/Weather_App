<script setup>
import { computed } from 'vue';

const props = defineProps({
  weather: {
    type: Object,
    required: true
  }
});

const weatherIcon = computed(() => {
  if (props.weather?.weather?.[0]?.icon) {
    return `https://openweathermap.org/img/wn/${props.weather.weather[0].icon}@2x.png`;
  }
  return '';
});

const formattedDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
});
</script>

<template>
  <div class="space-y-8">
    <!-- Location and Search -->
    <div class="flex items-center space-x-2 text-white/80">
      <div class="text-lg font-light">
        {{ weather.name }}
      </div>
    </div>

    <!-- Main Weather Info -->
    <div class="space-y-1">
      <div class="flex items-start">
        <span class="text-temp font-extralight">{{ Math.round(weather.main.temp) }}</span>
        <span class="text-4xl mt-2">°</span>
      </div>
      
      <div class="flex items-center space-x-4">
        <span class="text-5xl font-light">±{{ Math.round(Math.abs(weather.main.temp_max - weather.main.temp_min)) }}°</span>
        <span class="text-xl text-white/60">{{ Math.round(weather.wind.speed) }} m/h</span>
      </div>

      <div class="text-lg font-light text-white/80">
        {{ weather.weather[0].description }}
      </div>
    </div>

    <!-- Additional Info -->
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-weather-overlay backdrop-blur-sm rounded-2xl p-4">
        <div class="text-sm text-white/60">Humidity</div>
        <div class="text-2xl font-light">{{ weather.main.humidity }}%</div>
      </div>
      <div class="bg-weather-overlay backdrop-blur-sm rounded-2xl p-4">
        <div class="text-sm text-white/60">Feels Like</div>
        <div class="text-2xl font-light">{{ Math.round(weather.main.feels_like) }}°</div>
      </div>
      <div class="bg-weather-overlay backdrop-blur-sm rounded-2xl p-4">
        <div class="text-sm text-white/60">Pressure</div>
        <div class="text-2xl font-light">{{ weather.main.pressure }} hPa</div>
      </div>
      <div class="bg-weather-overlay backdrop-blur-sm rounded-2xl p-4">
        <div class="text-sm text-white/60">Visibility</div>
        <div class="text-2xl font-light">{{ Math.round(weather.visibility / 1000) }} km</div>
      </div>
    </div>
  </div>
</template>