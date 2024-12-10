import { defineStore } from "pinia";

// Définition des types pour les réponses de l'API
interface Genre {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  [key: string]: any; // Permet d'inclure d'autres propriétés possibles
}

export const useMovieStore = defineStore("movieStore", () => {
  // Init
  const config = useRuntimeConfig();
  const apiKey = config.public.tmdbApiKey;
  
  // State
  const genres = ref<Array<Object>>()
  const randomMovie = ref<Object>()
  const movieVideoKey = ref<String>()
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



  async function getGenres() {
    try {
      const data = await $fetch<Response>("https://api.themoviedb.org/3/genre/movie/list", {
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
        emoji: getEmojiByGenre(genre.name),
        slug: createSlug(genre.id, genre.name),
      }));
    } catch (e) {
      throw e;
    }
  }


  function getEmojiByGenre(genreName: string) {
    const defaultEmoji = "❓"; // Default emoji for unknown genres
    return genreEmojis[genreName] || defaultEmoji;
  }

  // Helper function to create a slug
  function createSlug(id: number, name: string) {
    const slugName = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); // Sanitize name
    return `${id}-${slugName}`;
  }

  function getGenreById(id: number) {
    // Ensure genres are loaded
    if (!genres.value || genres.value.length === 0) {
      throw new Error("Genres are not loaded yet.");
    }
  
    // Find the genre by its ID
    const genre = genres.value.find((g) => g.id === id);
  
    // Return the genre or handle missing ID
    if (!genre) {
      throw new Error(`Genre with ID ${id} not found.`);
    }
  
    return genre;
  }

  function getRandomGenre() {
    // Ensure genres are loaded
    if (!genres.value || genres.value.length === 0) {
      throw new Error("Genres are not loaded yet.");
    }
  
    // Select a random genre
    const randomIndex = Math.floor(Math.random() * genres.value.length);
    return genres.value[randomIndex];
  }


  async function getRandomMovieFromGenre(genreId: number) {
    try {
      const randomPage = Math.floor(Math.random() * 500) + 1;
  
      const randomPageData = await $fetch<Response>("https://api.themoviedb.org/3/discover/movie", {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${config.public.tmdbApiKey}`,
        },
        params: {
          page: randomPage,
          with_genres: genreId,
        },
      });
  
      const moviesOnPage = randomPageData.results;
  
      if (!moviesOnPage || moviesOnPage.length === 0) {
        throw new Error("No movies found on the random page.");
      }
  
      randomMovie.value = moviesOnPage[Math.floor(Math.random() * moviesOnPage.length)];
    } catch (e) {
      console.error("Error fetching random movie:", e);
      throw e;
    }
  }

  // Fonction pour récupérer les détails d'un film
  async function getMovieDetails(idMovie: number) {
    try {
      const data = await $fetch<Response>(`https://api.themoviedb.org/3/movie/${idMovie}`, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${config.public.tmdbApiKey}`,
        }
      });

      randomMovie.value = data;
    } catch (e) {
      throw e;
    }
  }

  async function getMovieVideo(idMovie: number) {
    try {
      const { results } = await $fetch<Response>(
        `https://api.themoviedb.org/3/movie/${idMovie}/videos`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${config.public.tmdbApiKey}`,
          },
        }
      );
  
      movieVideoKey.value = results.find(
        (video) =>
          video.type.toLowerCase() === "trailer" &&
          (video.name.toLowerCase().includes("original trailer") || video.name.toLowerCase().includes("trailer"))
      )?.key || null;
    } catch (e) {
      console.error("Error fetching movie video:", e);
      throw e;
    }
  }


  return {
    getGenres, getGenreById, getRandomGenre, getRandomMovieFromGenre, getMovieDetails, getMovieVideo,
    genres, randomMovie, movieVideoKey
  };
});