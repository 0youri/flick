<template>
   <div v-if="loading" class="flex justify-center h-96 items-center gap-2 py-20 text-dark text-2xl">
      <span class="loader"></span>
      <span> Loading...</span>
    </div>
  <div v-else class="flex flex-col gap-10 text-white w-full pb-10">
    <div
      class="relative bg-cover py-10 bg-center lg:bg-right-top"
      :style="`background-image: url(${getImageUrl(randomMovie.backdrop_path)})`"
    >
      <div class="absolute inset-0 bg-black bg-opacity-75"></div>

      <div class="relative flex flex-col lg:flex-row justify-center items-center lg:items-start lg:px-10" >
        <img 
          :src="getImageUrl(randomMovie.poster_path)" 
          alt="Movie poster" 
          class="w-5/6 lg:w-auto lg:h-[500px] rounded-2xl border transform transition-transform duration-300 hover:scale-105"
        />
        <div class="py-5 flex flex-col gap-5 w-5/6 lg:w-3/4 lg:pl-10">
          <div class="space-y-5">
            <h1 class="text-2xl lg:text-3xl font-bold ">{{ randomMovie.original_title }}</h1>
            <div class="flex flex-col text-lg gap-0.5 lg:text-md">
              <span v-if="relaseYear" >📆 {{ relaseYear }}</span>
              <span v-if="genres">🎥 {{ genres }}</span>
              <span v-if="randomMovie.runtime">⏳ {{ formatMinutesToHoursAndMinutes(randomMovie.runtime) }}</span>
              <span v-if="randomMovie.vote_average">⭐ <span class="text-yellow-400 font-medium">{{ convertReviewToPercentage(randomMovie.vote_average) }}</span> <span class="text-primary font-medium text-xs">({{ randomMovie.vote_count }} review)</span></span>
            </div>
          </div>
          <!-- Review & Trailer -->
          <div v-if="movieVideoKey">
            <button
              @click="modal"
              class="flex w-fit items-center rounded-lg gap-2 hover:opacity-75 cursor-pointer"
            >
              <svg height="40" width="40" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 461.001 461.001" xml:space="preserve"><g><path style="fill:#F61C0D;" d="M365.257,67.393H95.744C42.866,67.393,0,110.259,0,163.137v134.728 c0,52.878,42.866,95.744,95.744,95.744h269.513c52.878,0,95.744-42.866,95.744-95.744V163.137 C461.001,110.259,418.135,67.393,365.257,67.393z M300.506,237.056l-126.06,60.123c-3.359,1.602-7.239-0.847-7.239-4.568V168.607 c0-3.774,3.982-6.22,7.348-4.514l126.06,63.881C304.363,229.873,304.298,235.248,300.506,237.056z"/></g></svg>
              <span class="text-sm lg:-text-md">Play trailer</span>
            </button>
            <Modal
              :visible="modalState"
              @close="modal"
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
          <div v-if="randomMovie.overview" class="">
            <h1 class="text-xl lg:text-2xl font-semibold">Overview</h1>
            <p class="text-sm lg:text-md text-block font-light">
              {{ randomMovie.overview }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-center gap-2">
      <button
        @click="anotherRandomMovie"
        class="bg-accent-gray text-dark hover:bg-accent-gray/80 px-5 py-3 rounded-lg text-lg"
      >
        Another one! 🔄
      </button>
      <NuxtLink to="/movies" class="bg-red-300 text-dark hover:bg-red-300/80 px-3 py-1 rounded-lg text-sm w-max">
        reset
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useMovieStore } from "~/stores/movieStore";

  const route = useRoute()

  const { getMovieDetails, getRandomMovieFromGenre, getMovieVideo } = useMovieStore();
  const { randomMovie, movieVideoKey } = storeToRefs(useMovieStore());

  const modalState = ref(false)
  const loading = ref(true); // Loading state

  const modal = () => {
    modalState.value = !modalState.value
  }

  const relaseYear = computed (() => {
    return randomMovie.value?.release_date.split('-')[0]
  })

  const genres = computed(() => {
    return randomMovie.value?.genres?.map((member: { name: string }) => member.name).join(', ') || null;
  })

  function getImageUrl(path: string) {
    return path ? `https://image.tmdb.org/t/p/original${path}` : '/img/default-poster.png';
  }

  function formatMinutesToHoursAndMinutes(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}min`; // If less than 60 minutes, return in minutes
    }
    
    const hours = Math.floor(minutes / 60); // Calculate full hours
    const remainingMinutes = minutes % 60; // Calculate remaining minutes

    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`; // Format output
  }

  function convertReviewToPercentage(review: number): string {
    if (review < 0 || review > 10) {
      throw new Error("Review score must be between 0 and 10.");
    }
    
    const percentage = (review / 10) * 100; // Convert to percentage
    return `${percentage.toFixed(0)}%`; // Return as a formatted string
  }


  const anotherRandomMovie = async () => {
    const genreId = route.params.genre.split("-").map((part: string) => parseInt(part, 10))[0]
    await getRandomMovieFromGenre(genreId)
    const movieSlug = `${randomMovie.value.id}-${randomMovie.value.original_title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
    const genreSlug = route.params.genre
    navigateTo({
      name: 'movies-genres-genre-movie',
      params: { 
        genre: genreSlug,
        movie: movieSlug,
      } 
    })
  }
  onMounted( async () => {
    loading.value = true; // Start loading
    const movieId = route.params.movie.split("-").map((part: string) => parseInt(part, 10))[0]
    await getMovieDetails(movieId)
    await getMovieVideo(movieId)
    loading.value = false; // End loading
  })
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