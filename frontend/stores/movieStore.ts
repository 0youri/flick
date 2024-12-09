import { defineStore } from "pinia";

// Définition des types pour les réponses de l'API
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  [key: string]: any; // Permet d'inclure d'autres propriétés possibles
}

interface CastMember {
  name: string;
  order: number;
}

interface ApiResponse {
  genres: Object[];
  results: Movie[];
}

export const useMovieStore = defineStore("movieStore", () => {
  // Init
  const config = useRuntimeConfig();
  const apiKey = config.public.tmdbApiKey;

  // State
  const genres = ref<Array<Object>>()
  const genreEmojis = {
    "Action": "🎬",
    "Adventure": "🗺️",
    "Animation": "🎨",
    "Comedy": "😂",
    "Crime": "🕵️",
    "Documentary": "🎥",
    "Drama": "🎭",
    "Family": "👨‍👩‍👧‍👦",
    "Fantasy": "🧙",
    "History": "📜",
    "Horror": "👻",
    "Music": "🎵",
    "Mystery": "🔍",
    "Romance": "❤️",
    "Science Fiction": "🚀",
    "TV Movie": "📺",
    "Thriller": "⚡",
    "War": "⚔️",
    "Western": "🤠"
  };
  // Actions & getters

  // Fonction pour récupérer les films
  async function getGenres() {
    try {
      const data = await $fetch<ApiResponse>("https://api.themoviedb.org/3/genre/movie/list", {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${config.public.tmdbApiKey}`,
        },
        params: {
          language: "en",
        },
      });


      genres.value = data.genres.map(genre => ({
        ...genre,
        emoji: getEmojiByGenre(genre.name)
      }));
    } catch (e) {
      throw e;
    }
  }


  function getEmojiByGenre(genreName: string) {
    const defaultEmoji = "❓"; // Default emoji for unknown genres
    return genreEmojis[genreName] || defaultEmoji;
  }

  return {
    getGenres,
    genres,
  };
});