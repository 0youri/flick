<template>
  <div v-if="loading" class="flex items-center gap-2 py-20 text-dark text-2xl">
    <span class="loader"></span>
    <span> Loading...</span>
  </div>
  <div v-else class="flex flex-col items-center gap-5 lg:gap-5 text-dark">
    <!-- Page Header -->
    <div class="text-2xl font-medium text-center">
      Your Chosen Genre
    </div>
    <svg width="150" height="1" viewBox="0 0 150 1" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line y1="0.5" x2="150" y2="0.5" stroke="#0A2E36" />
    </svg>

    <p class="text-accent-sky text-3xl py-20 font-medium">
      {{ genre.name }} {{ genre.emoji }}
    </p>

    <!-- Action Buttons -->
    <div class="flex justify-center text-5xl lg:text-6xl">
      <button class="px-10 py-3 hover:drop-shadow-xl cursor-pointer" @click="regenerateGenre">
        🔄
      </button>
      <button @click="getRandomMovie" class="px-10 py-3 hover:drop-shadow-xl">
        ➡️
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMovieStore } from "~/stores/movieStore";
import { useMoodStore } from "~/stores/moodStore";

// Stores and router
const route = useRoute();
const router = useRouter();
const { getGenres, getRandomGenre, getGenreById, getRandomMovieFromGenre } = useMovieStore();
const { genres, randomMovie } = storeToRefs(useMovieStore());
const { getRandomGenreId } = useMoodStore();

// Reactive states
const loading = ref(true); // Loading state for spinner
const genre = ref<Object>();
const moodId = Number(route.query.mood); // Extract mood ID from route query

// Compute next route for NuxtLink

const getRandomMovie = async () => {
  await getRandomMovieFromGenre(genre.value.id)
  const slug = `${randomMovie.value.id}-${randomMovie.value.original_title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
  navigateTo({ 
    name: 'movies-genres-genre-movie',
    params: {
      genre: genre.value.slug,
      movie: slug
    }
  })
}

// Initialize genres and set current genre
onMounted(async () => {
  await getGenres();
  setInitialGenre();
  loading.value = false; // Stop loading once data is ready
});

// Watch `genres` for changes
watch(genres, () => {
  if (!loading.value) setInitialGenre();
});

// Function to set the initial genre based on route or randomly
const setInitialGenre = () => {
  const genreParam = route.params.genre?.toLowerCase();

  if (genreParam === "random") {
    setRandomGenre();
  } else if (genreParam) {
    const [id] = genreParam.split("-").map((part) => parseInt(part, 10));
    const selectedGenre = genres.value?.find((g) => g.id === id);
    if (selectedGenre) genre.value = selectedGenre;
  }
};

// Function to set a random genre
const setRandomGenre = () => {
  const randomGenre = getRandomGenre();
  if (randomGenre) {
    genre.value = randomGenre;
    router.push({ name: "movies-genres-genre", params: { genre: randomGenre.slug } });
  }
};

// Function to regenerate genre
const regenerateGenre = () => {
  loading.value = true; // Show spinner during regeneration
  setTimeout(() => {
    if (moodId) {
      const randomGenreId = getRandomGenreId(moodId);
      genre.value = getGenreById(randomGenreId);
    } else {
      setRandomGenre();
    }
    loading.value = false; // Hide spinner after regeneration
  }, 750); // Simulate slight delay for smoother UX
};
</script>


<style scoped>
  .loader {
    width: 24px;
    height: 24px;
    border: 4px solid #A6A6A8;
    border-top-color: #272635;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

</style>