<script setup>
import { ref, watch } from 'vue';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/vue/24/outline';
import { weatherApi } from '../services/weatherApi';
import { useDebounce } from '../composables/useDebounce';

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
});

const searchQuery = ref('');
const suggestions = ref([]);
const loading = ref(false);
const showSuggestions = ref(false);

const emit = defineEmits(['search', 'error']);

const debouncedSearch = useDebounce(async (query) => {
  if (!query) {
    suggestions.value = [];
    return;
  }
  
  try {
    loading.value = true;
    suggestions.value = await weatherApi.searchCities(query);
  } catch (error) {
    emit('error', error.message);
  } finally {
    loading.value = false;
  }
}, 300);

watch(searchQuery, (newQuery) => {
  showSuggestions.value = true;
  debouncedSearch(newQuery);
});

const handleLocationClick = async () => {
  try {
    loading.value = true;
    const location = await weatherApi.getCurrentLocation();
    emit('search', { lat: location.lat, lon: location.lon, name: location.name });
  } catch (error) {
    emit('error', error.message);
  } finally {
    loading.value = false;
  }
};

const handleSuggestionClick = (suggestion) => {
  searchQuery.value = suggestion.name;
  showSuggestions.value = false;
  emit('search', { 
    lat: suggestion.lat, 
    lon: suggestion.lon,
    name: suggestion.name
  });
};

const handleBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false;
  }, 200);
};
</script>

<template>
  <div class="relative w-full">
    <div class="flex items-center gap-2">
      <div class="relative flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search location..."
          :disabled="disabled"
          class="w-full px-4 py-2.5 rounded-2xl bg-weather-overlay backdrop-blur-sm text-white placeholder-white/50 border-0 focus:outline-none focus:ring-2 focus:ring-white/25"
          @blur="handleBlur"
        />
        <div v-if="loading" class="absolute right-3 top-1/2 -translate-y-1/2">
          <div class="w-4 h-4 border-2 border-white/30 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
      <button
        @click="handleLocationClick"
        :disabled="disabled"
        class="p-2.5 bg-weather-overlay backdrop-blur-sm rounded-2xl hover:bg-weather-overlay-hover active:bg-weather-overlay-active transition-colors text-white/80"
        title="Use current location"
      >
        <MapPinIcon class="w-5 h-5" />
      </button>
    </div>

    <div
      v-if="showSuggestions && suggestions.length > 0"
      class="absolute z-10 w-full mt-2 bg-weather-overlay backdrop-blur-md rounded-2xl border border-white/10 max-h-60 overflow-auto"
    >
      <button
        v-for="suggestion in suggestions"
        :key="`${suggestion.lat}-${suggestion.lon}`"
        class="w-full px-4 py-2.5 text-left hover:bg-weather-overlay-hover active:bg-weather-overlay-active focus:outline-none transition-colors text-white/80"
        @click="handleSuggestionClick(suggestion)"
      >
        <div class="flex items-center gap-2">
          <MagnifyingGlassIcon class="w-4 h-4 opacity-50" />
          <div>
            <div class="font-medium">{{ suggestion.name }}</div>
            <div class="text-sm text-white/60">
              {{ suggestion.state ? `${suggestion.state}, ` : '' }}{{ suggestion.country }}
            </div>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>