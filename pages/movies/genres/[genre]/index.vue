<template>
  <div v-if="loading" class="flex items-center gap-2 py-20 text-dark text-2xl">
    <span class="loader"></span>
    <span>Loading...</span>
  </div>
  <div v-else class="flex flex-col items-center gap-5 lg:gap-5 text-dark">
    <!-- Page Header -->
    <div class="text-2xl font-medium text-center">
      Your Chosen Genre
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

    <p class="text-accent-sky text-3xl py-20 font-medium">
      {{ genre?.name || "Genre" }} {{ genre?.emoji || "🎬" }}
    </p>

    <!-- Action Buttons -->
    <div class="flex justify-center text-5xl lg:text-6xl">
      <button
        class="px-10 py-3 hover:drop-shadow-xl cursor-pointer"
        @click="regenerateGenre"
      >
        🔄
      </button>
      <button @click="navigateToRandomMovie" class="px-10 py-3 hover:drop-shadow-xl">
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
  const loading = ref(true);
  const genre = ref(null);
  const moodId = Number(route.query.mood);

  // Fetch genres and initialize genre on mount
  onMounted(async () => {
    await getGenres();
    initializeGenre();
    loading.value = false;
  });

  // Watch for genre list changes to reset the genre
  watch(genres, () => {
    if (!loading.value) initializeGenre();
  });

  // Set the initial genre based on the route or randomly
  const initializeGenre = () => {
    const genreParam = route.params.genre?.toLowerCase();
    if (genreParam === "random") {
      assignRandomGenre();
    } else if (genreParam) {
      const genreId = parseInt(genreParam.split("-")[0], 10);
      genre.value = genres.value?.find((g) => g.id === genreId) || null;
    }
  };

  // Assign a random genre and navigate to it
  const assignRandomGenre = () => {
    const randomGenre = getRandomGenre();
    if (randomGenre) {
      genre.value = randomGenre;
      router.push({ name: "movies-genres-genre", params: { genre: randomGenre.slug } });
    }
  };

  // Navigate to a random movie within the genre
  const navigateToRandomMovie = async () => {
    if (!genre.value) return;

    await getRandomMovieFromGenre(genre.value.id);
    const movieSlug = generateSlug(randomMovie.value);

    router.push({
      name: "movies-genres-genre-movie",
      params: {
        genre: genre.value.slug,
        movie: movieSlug,
      },
    });
  };

  // Generate a URL-friendly slug for the movie
  const generateSlug = (movie) => {
    return `${movie.id}-${movie.original_title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")}`;
  };

  // Regenerate the genre based on mood or randomly
  const regenerateGenre = () => {
    loading.value = true;
    setTimeout(() => {
      if (moodId) {
        const randomGenreId = getRandomGenreId(moodId);
        genre.value = getGenreById(randomGenreId);
      } else {
        assignRandomGenre();
      }
      loading.value = false;
    }, 750);
  };
</script>

<style scoped>
.loader {
  width: 24px;
  height: 24px;
  border: 4px solid #a6a6a8;
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