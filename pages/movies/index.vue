<template>
  <div class="flex flex-col items-center gap-5 lg:gap-5 text-dark">
    <!-- Page Header -->
    <div class="text-2xl font-medium text-center">
      Pick Your Path
    </div>
    <svg width="150" height="2" viewBox="0 0 150 1" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line y1="0.5" x2="150" y2="0.5" stroke="#0A2E36" />
    </svg>
    <div class="flex flex-col items-center text-center gap-5">
      <NuxtLink
        v-for="path in paths"
        :key="path.title"
        :to="`/movies/${path.link}`"
        class="border-2 border-accent-sky text-accent-sky w-full px-6 py-3 text-lg md:text-md rounded-2xl lg:hover:bg-accent-sky lg:hover:text-white"
      >
        {{ path.title || 'Unknown Path' }}
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMovieStore } from "~/stores/movieStore";

const { getGenres } = useMovieStore();

// Fetch genres on mount
onMounted(async () => {
  await getGenres();
});

// Static paths
const paths = [
  {
    title: 'your mood 🧐',
    link: 'mood',
  },
  {
    title: 'your genre 🎥',
    link: 'genres',
  },
  {
    title: 'random genre 🎲',
    link: 'genres/random',
  },
];
</script>