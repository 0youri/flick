import { defineStore } from "pinia";

// Define types for API responses
interface Genre {
  id: number;
  name: string;
  slug: string;
  emoji: string;
}

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  [key: string]: any;
}

export const useMovieStore = defineStore("movieStore", () => {
  // Init
  const config = useRuntimeConfig();
  const apiKey = config.public.tmdbApiKey;

  // State
  const genres = ref<Genre[]>([]);
  const randomMovie = ref<Movie | null>(null);
  const movieVideoKey = ref<string | null>(null);

  const genreEmojis: Record<string, string> = {
    Action: "🎬",
    Adventure: "🗺️",
    Animation: "🎨",
    Comedy: "😂",
    Crime: "🕵️",
    Documentary: "🎥",
    Drama: "🎭",
    Family: "👨‍👩‍👧‍👦",
    Fantasy: "🧙",
    History: "📜",
    Horror: "👻",
    Music: "🎵",
    Mystery: "🔍",
    Romance: "❤️",
    "Science Fiction": "🚀",
    "TV Movie": "📺",
    Thriller: "⚡",
    War: "⚔️",
    Western: "🤠",
  };

  // Fetch genres from the API
  async function getGenres(): Promise<void> {
    try {
      const data = await $fetch<{ genres: Genre[] }>(
        "https://api.themoviedb.org/3/genre/movie/list",
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          params: { language: "en" },
        }
      );

      genres.value = data.genres.map((genre) => ({
        ...genre,
        emoji: getEmojiByGenre(genre.name),
        slug: createSlug(genre.id, genre.name),
      }));
    } catch (error) {
      console.error("Error fetching genres:", error);
      throw error;
    }
  }

  // Get emoji for a genre
  function getEmojiByGenre(genreName: string): string {
    return genreEmojis[genreName] || "❓"; // Default emoji for unknown genres
  }

  // Create a slug from genre ID and name
  function createSlug(id: number, name: string): string {
    const slugName = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return `${id}-${slugName}`;
  }

  // Get genre by ID
  function getGenreById(id: number): Genre {
    if (!genres.value.length) throw new Error("Genres are not loaded yet.");
    const genre = genres.value.find((g) => g.id === id);
    if (!genre) throw new Error(`Genre with ID ${id} not found.`);
    return genre;
  }

  // Get a random genre
  function getRandomGenre(): Genre {
    if (!genres.value.length) throw new Error("Genres are not loaded yet.");
    const randomIndex = Math.floor(Math.random() * genres.value.length);
    return genres.value[randomIndex];
  }

  // Fetch a random movie for a genre
  async function getRandomMovieFromGenre(genreId: number): Promise<void> {
    try {
      const randomPage = Math.floor(Math.random() * 500) + 1;

      const data = await $fetch<{ results: Movie[] }>(
        "https://api.themoviedb.org/3/discover/movie",
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          params: { page: randomPage, with_genres: genreId },
        }
      );

      const movies = data.results;
      if (!movies?.length) throw new Error("No movies found on the random page.");

      randomMovie.value = movies[Math.floor(Math.random() * movies.length)];
    } catch (error) {
      console.error("Error fetching random movie:", error);
      throw error;
    }
  }

  // Fetch movie details by ID
  async function getMovieDetails(idMovie: number): Promise<void> {
    try {
      const data = await $fetch<Movie>(`https://api.themoviedb.org/3/movie/${idMovie}`, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      });

      randomMovie.value = data;
    } catch (error) {
      console.error("Error fetching movie details:", error);
      throw error;
    }
  }

  // Fetch movie video (trailer) by ID
  async function getMovieVideo(idMovie: number): Promise<void> {
    try {
      const { results } = await $fetch<{ results: { type: string; name: string; key: string }[] }>(
        `https://api.themoviedb.org/3/movie/${idMovie}/videos`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      movieVideoKey.value =
        results.find(
          (video) =>
            video.type.toLowerCase() === "trailer" &&
            (video.name.toLowerCase().includes("original trailer") ||
              video.name.toLowerCase().includes("trailer"))
        )?.key || null;
    } catch (error) {
      console.error("Error fetching movie video:", error);
      throw error;
    }
  }

  return {
    genres,
    randomMovie,
    movieVideoKey,
    getGenres,
    getGenreById,
    getRandomGenre,
    getRandomMovieFromGenre,
    getMovieDetails,
    getMovieVideo,
  };
});