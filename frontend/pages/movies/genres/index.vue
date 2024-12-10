<template>
  <div class="flex flex-col items-center gap-5 lg:gap-5 text-dark py-10">
    <!-- Page Header -->
    <div class="text-2xl font-medium text-center">
      Pick Your Genre
    </div>
    <svg
      width="150"
      height="1"
      viewBox="0 0 150 1"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line y1="0.5" x2="150" y2="0.5" stroke="#0A2E36" />
    </svg>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-center px-5 lg:px-0 text-center gap-5">
      <NuxtLink
        v-for="genre in genres"
        :key="genre.id"
        :to="{ name: 'movies-genres-genre', params: { genre: genre.slug } }"
        class="border-2 border-accent-sky text-accent-sky w-full px-6 py-3 text-lg md:text-md rounded-2xl lg:hover:bg-accent-sky lg:hover:text-white"
      >
        {{ genre.name || 'Genre' }} {{ genre.emoji || '🎬' }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
  import { useMovieStore } from "~/stores/movieStore";

  const { getGenres } = useMovieStore();
  const { genres } = storeToRefs(useMovieStore());

  // Fetch genres on mount
  onMounted(async () => {
    await getGenres()
  });
</script>