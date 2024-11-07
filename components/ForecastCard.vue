<script setup>
import { computed } from 'vue';

const props = defineProps({
  forecast: {
    type: Object,
    required: true
  }
});

const weatherIcon = computed(() => {
  return `https://openweathermap.org/img/wn/${props.forecast.weather[0].icon}.png`;
});

const formattedDate = computed(() => {
  return new Date(props.forecast.dt_txt).toLocaleDateString('en-US', {
    weekday: 'short',
    hour: 'numeric'
  });
});
</script>

<template>
  <div class="bg-weather-overlay backdrop-blur-sm rounded-2xl p-4 min-w-[120px]">
    <div class="space-y-2">
      <p class="text-sm font-medium text-white/80">{{ formattedDate }}</p>
      <div class="text-3xl font-light">{{ Math.round(forecast.main.temp) }}°</div>
      <p class="text-sm text-white/60">{{ forecast.weather[0].main }}</p>
    </div>
  </div>
</template>
