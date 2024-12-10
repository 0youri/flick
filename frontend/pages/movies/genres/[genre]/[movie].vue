<template>
  <div v-if="loading" class="flex justify-center h-96 items-center gap-2 py-20 text-dark text-2xl">
    <span class="loader"></span>
    <span>Loading...</span>
  </div>
  <div v-else class="flex flex-col gap-10 text-white w-full pb-10">
    <!-- Movie Header -->
    <div
      class="relative bg-cover py-10 bg-center lg:bg-right-top"
      :style="`background-image: url(${getImageUrl(randomMovie?.backdrop_path)})`"
    >
      <div class="absolute inset-0 bg-black bg-opacity-75"></div>
      <div class="relative flex flex-col lg:flex-row justify-center items-center lg:items-start lg:px-10">
        <img
          :src="getImageUrl(randomMovie?.poster_path)"
          alt="Movie poster"
          class="w-5/6 lg:w-auto lg:h-[500px] rounded-2xl border transform transition-transform duration-300 hover:scale-105"
        />
        <div class="py-5 flex flex-col gap-5 w-5/6 lg:w-3/4 lg:pl-10">
          <div class="space-y-5">
            <h1 class="text-2xl lg:text-3xl font-bold">{{ randomMovie?.original_title }}</h1>
            <div class="flex flex-col text-lg gap-0.5 lg:text-md">
              <span v-if="releaseYear">📆 {{ releaseYear }}</span>
              <span v-if="genres">🎥 {{ genres }}</span>
              <span v-if="runtimeFormatted">⏳ {{ runtimeFormatted }}</span>
              <span v-if="votePercentage">
                ⭐ <span class="text-yellow-400 font-medium">{{ votePercentage }}</span>
                <span class="text-primary font-medium text-xs"> ({{ randomMovie?.vote_count }} review)</span>
              </span>
            </div>
          </div>
          <!-- Trailer Modal -->
          <div v-if="movieVideoKey">
            <button
              @click="toggleModal"
              class="flex w-fit items-center rounded-lg gap-2 hover:opacity-75 cursor-pointer"
            >
              <svg height="40" width="40" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 461.001 461.001" xml:space="preserve"><g><path style="fill:#F61C0D;" d="M365.257,67.393H95.744C42.866,67.393,0,110.259,0,163.137v134.728 c0,52.878,42.866,95.744,95.744,95.744h269.513c52.878,0,95.744-42.866,95.744-95.744V163.137 C461.001,110.259,418.135,67.393,365.257,67.393z M300.506,237.056l-126.06,60.123c-3.359,1.602-7.239-0.847-7.239-4.568V168.607 c0-3.774,3.982-6.22,7.348-4.514l126.06,63.881C304.363,229.873,304.298,235.248,300.506,237.056z"/></g></svg>
              <span class="text-sm lg:-text-md">Play trailer</span>
            </button>
            <Modal
              :visible="modalState"
              @close="toggleModal"
            >
              <iframe
                class="rounded-b-3xl aspect-video min-w-[400px] md:min-w-[700px] lg:min-w-[1000px]"
                :src="`https://www.youtube.com/embed/${movieVideoKey}`"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              ></iframe>
            </Modal>
          </div>
          <div v-else>
            <NuxtLink
              :to="`https://www.youtube.com/results?search_query=${randomMovie.original_title} ${relaseYear} trailer`"
              class="flex w-fit items-center rounded-lg gap-2 hover:opacity-75 cursor-pointer"
              target="_blank"
            >
              <svg height="40" width="40" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 461.001 461.001" xml:space="preserve"><g><path style="fill:#F61C0D;" d="M365.257,67.393H95.744C42.866,67.393,0,110.259,0,163.137v134.728 c0,52.878,42.866,95.744,95.744,95.744h269.513c52.878,0,95.744-42.866,95.744-95.744V163.137 C461.001,110.259,418.135,67.393,365.257,67.393z M300.506,237.056l-126.06,60.123c-3.359,1.602-7.239-0.847-7.239-4.568V168.607 c0-3.774,3.982-6.22,7.348-4.514l126.06,63.881C304.363,229.873,304.298,235.248,300.506,237.056z"/></g></svg>
              <span class="text-sm lg:-text-md">See trailer on Youtube</span>
            </NuxtLink>
          </div>
          <!-- Overview -->
          <div v-if="randomMovie?.overview">
            <h1 class="text-xl lg:text-2xl font-semibold">Overview</h1>
            <p class="text-sm lg:text-md text-block font-light">{{ randomMovie?.overview }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- Buttons -->
    <div class="flex flex-col items-center gap-2">
      <button
        @click="fetchAnotherRandomMovie"
        class="bg-accent-gray text-dark hover:bg-accent-gray/80 px-5 py-3 rounded-lg text-lg cursor-pointer"
      >
        Another one! 🔄
      </button>
      <NuxtLink to="/movies" class="bg-red-300 text-dark hover:bg-red-300/80 px-3 py-1 rounded-lg text-sm w-max">
        Reset
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useMovieStore } from "~/stores/movieStore";

// Store data
const { getMovieDetails, getRandomMovieFromGenre, getMovieVideo } = useMovieStore();
const { randomMovie, movieVideoKey } = storeToRefs(useMovieStore());

const route = useRoute();
const modalState = ref(false);
const loading = ref(true);

const config = useRuntimeConfig();
const baseURL = config.app.baseURL;

// Modal toggle
const toggleModal = () => {
  modalState.value = !modalState.value;
};

// Computed properties
const releaseYear = computed(() => randomMovie.value?.release_date?.split("-")[0]);
const genres = computed(() =>
  randomMovie.value?.genres?.map((genre) => genre.name).join(", ") || null
);
const runtimeFormatted = computed(() => {
  const minutes = randomMovie.value?.runtime;
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
});
const votePercentage = computed(() => {
  const vote = randomMovie.value?.vote_average || 0;
  return `${((vote / 10) * 100).toFixed(0)}%`;
});

// Helper functions
const getImageUrl = (path: string) =>
  path ? `https://image.tmdb.org/t/p/original${path}` : `${baseURL}img/default-poster.png`;

// Fetch another random movie
const fetchAnotherRandomMovie = async () => {
  const genreId = parseInt(route.params.genre.split("-")[0], 10);
  await getRandomMovieFromGenre(genreId);

  const movieSlug = `${randomMovie.value.id}-${randomMovie.value.original_title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;

  const genreSlug = route.params.genre;

  navigateTo({
    name: "movies-genres-genre-movie",
    params: {
      genre: genreSlug,
      movie: movieSlug,
    },
  });
};

// Fetch movie details and video on mount
onMounted(async () => {
  loading.value = true;
  const movieId = parseInt(route.params.movie.split("-")[0], 10);
  await Promise.all([getMovieDetails(movieId), getMovieVideo(movieId)]);
  loading.value = false;
});
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