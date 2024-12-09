<template>
  <div class="flex flex-col items-center gap-5 lg:gap-5 text-dark">
   <!-- Page Header -->
    <div class="text-2xl font-medium text-center">
        Pick Your Genre
    </div>
    <svg width="150" height="1" viewBox="0 0 150 1" fill="none" xmlns="http://www.w3.org/2000/svg"><line y1="0.5" x2="150" y2="0.5" stroke="#0A2E36" /></svg>
    <div class="grid grid-cols-3 px-5 lg:px-0 text-center gap-5">
      <NuxtLink
        v-for="genre in genres"
        :key="genre.id"
        :to="{ name: 'movies-genres-genre', params: { genre: genre.name.toLowerCase() } }"
        class="border-2 border-accent-sky text-accent-sky w-full px-6 py-3 text-lg md:text-md rounded-2xl hover:bg-accent-sky hover:text-white"
      >
        {{ genre.name }} {{ genre.emoji }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>

  import { useMovieStore } from "~/stores/movieStore";

  const { getGenres } = useMovieStore();
  const { genres } = storeToRefs(useMovieStore());

  onMounted(() => {
    getGenres()
  })
</script>

<style>

</style>