<template>
  <div v-if="genres" class="flex flex-col items-center gap-5 lg:gap-5 text-dark">
   <!-- Page Header -->
    <div class="text-2xl font-medium text-center">
      Your Chosen Genre
    </div>
    <svg width="150" height="1" viewBox="0 0 150 1" fill="none" xmlns="http://www.w3.org/2000/svg"><line y1="0.5" x2="150" y2="0.5" stroke="#0A2E36" /></svg>
    <p class="text-accent-sky text-3xl py-20 font-medium">
      {{ genre.name }} {{ genre.emoji }}
    </p>
    <div class="flex justify-center text-5xl lg:text-6xl">
      <button class="px-10 py-3 hover:drop-shadow-xl">
        🔄
      </button>
      <NuxtLink to="X/X" class="px-10 py-3 hover:drop-shadow-xl">
        ➡️
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useMovieStore } from "~/stores/movieStore";

  const route = useRoute()
  const { getGenres } = useMovieStore();
  const { genres } = storeToRefs(useMovieStore());

  onMounted(() => {
    getGenres()
  })

  const genre = computed(() => {
    const genreParam = route.params.genre?.toLowerCase(); // Extract route parameter in lowercase
    return (
      genres.value.find((g) => g.name.toLowerCase() === genreParam) ||
      { name: "Unknown", emoji: "❓" } // Default value if not found
    );
  });

</script>

<style>

</style>