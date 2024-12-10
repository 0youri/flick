<template>
  <div class="flex flex-col items-center gap-5 lg:gap-5 text-dark">
    <!-- Page Header -->
    <div class="text-2xl font-medium text-center">
      Match Your Mood
    </div>
    <svg width="150" height="1" viewBox="0 0 150 1" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line y1="0.5" x2="150" y2="0.5" stroke="#0A2E36" />
    </svg>
    <div class="grid grid-cols-2 px-5 lg:px-0 text-center gap-5">
      <button
        v-for="mood in moods"
        :key="mood.id"
        @click="navigateToGenre(mood.id)"
        class="border-2 border-accent-sky text-accent-sky w-full px-6 py-3 text-lg md:text-md rounded-2xl hover:bg-accent-sky hover:text-white"
      >
        {{ mood.title || 'Mood' }} {{ mood.emoji || '😎' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useMoodStore } from "~/stores/moodStore";
  import { useMovieStore } from "~/stores/movieStore";

  // Extract necessary data and methods
  const { getGenres, getGenreById } = useMovieStore();
  const { getRandomGenreId } = useMoodStore();
  const { moods } = storeToRefs(useMoodStore());

  // Fetch genres on mount
  onMounted( async () => {
    await getGenres();
  });

  // Use Vue Router to navigate
  const router = useRouter();

  const navigateToGenre = (moodId: number): void => {
    const randomGenreId = getRandomGenreId(moodId);
    const genre = getGenreById(randomGenreId);

    if (!genre) {
      console.error("Invalid genre");
      return;
    }

    router.push({
      name: "movies-genres-genre",
      params: {
        genre: genre.slug,
      },
      query: {
        mood: moodId,
      },
    });
  };
</script>