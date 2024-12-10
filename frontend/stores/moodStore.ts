import { defineStore } from 'pinia'

export const useMoodStore = defineStore("moodStore", () => {
  // State
  const moods = ref([
    {
      id: 1,
      title: "feel-good",
      emoji: '🌞',
      genres: [35, 10751, 16, 10402], // Comedy, Family, Animation, Music
    },
    {
      id: 2,
      title: "chill",
      emoji: '😌',
      genres: [99, 18, 10770, 10402], // Documentary, Drama, TV Movie, Music
    },
    {
      id: 3,
      title: "thrilling",
      emoji: '⚡',
      genres: [28, 53, 80, 9648], // Action, Thriller, Crime, Mystery
    },
    {
      id: 4,
      title: "romantic",
      emoji: "❤️",
      genres: [10749, 18, 35, 16], // Romance, Drama, Comedy, Animation
    },
    {
      id: 5,
      title: "adventurous",
      emoji: "🌍",
      genres: [12, 14, 878, 37], // Adventure, Fantasy, Science Fiction, Western
    },
    {
      id: 6,
      title: "funny",
      emoji: "😂",
      genres: [35, 16, 10751, 10402], // Comedy, Animation, Family, Music
    },
    {
      id: 7,
      title: "spooky",
      emoji: "👻",
      genres: [27, 9648, 14], // Horror, Mystery, Fantasy
    },
    {
      id: 8,
      title: "epic",
      emoji: "🏆",
      genres: [36, 878, 10752, 14], // History, Science Fiction, War, Fantasy
    },
  ]);


  // Get all moods
  const getMoods = () => {
    return moods.value;
  };

  // Get mood by ID
  const getMoodById = (id: number) => {
    return moods.value.find((mood) => mood.id === id) || null;
  };


  const getRandomGenreId = (moodId: number) => {
    const mood = getMoodById(moodId);
    if (!mood || mood.genres.length === 0) {
      throw new Error(`No genres available for mood with ID ${moodId}`);
    }
    const randomIndex = Math.floor(Math.random() * mood.genres.length);
    return mood.genres[randomIndex];
  };

  const getMoodSlug = (moodId: number) => {
    const mood = getMoodById(moodId);
    if (!mood) {
      throw new Error(`Mood with ID ${moodId} not found`);
    }
    const slug = `${mood.id}-${mood.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
    return slug;
  };

  return {
    moods,
    getMoods,
    getMoodById,
    getRandomGenreId,
    getMoodSlug,
  }

})
