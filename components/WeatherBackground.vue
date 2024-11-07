<script setup>
import { computed } from 'vue';

const props = defineProps({
  weather: {
    type: Object,
    required: true
  }
});

const getBackgroundStyle = computed(() => {
  const condition = props.weather.weather[0].main.toLowerCase();
  const temp = props.weather.main.temp;
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour > 18;
  
  // Background gradients based on weather, temperature and time
  const backgrounds = {
    clear: {
      day: {
        hot: 'from-orange-400 to-amber-300',
        warm: 'from-sky-400 to-blue-300',
        cold: 'from-blue-500 to-cyan-400'
      },
      night: {
        default: 'from-gray-900 to-blue-900'
      }
    },
    clouds: {
      day: {
        default: 'from-gray-400 to-slate-300'
      },
      night: {
        default: 'from-gray-900 to-slate-800'
      }
    },
    rain: {
      default: 'from-slate-700 to-gray-600'
    },
    snow: {
      day: {
        default: 'from-slate-200 to-gray-100'
      },
      night: {
        default: 'from-slate-800 to-gray-700'
      }
    },
    thunderstorm: {
      default: 'from-slate-900 to-gray-800'
    }
  };

  const getTemperatureRange = () => {
    if (temp > 25) return 'hot';
    if (temp > 15) return 'warm';
    return 'cold';
  };

  const timeOfDay = isNight ? 'night' : 'day';
  const tempRange = getTemperatureRange();

  const bgClass = backgrounds[condition]?.[timeOfDay]?.[tempRange] ||
                 backgrounds[condition]?.[timeOfDay]?.default ||
                 backgrounds[condition]?.default ||
                 backgrounds.clear[timeOfDay][tempRange] ||
                 backgrounds.clear[timeOfDay].default;

  return `bg-gradient-to-br ${bgClass}`;
});
</script>

<template>
  <div 
    :class="['min-h-screen transition-colors duration-700 text-white', getBackgroundStyle]"
  >
    <slot></slot>
  </div>
</template>