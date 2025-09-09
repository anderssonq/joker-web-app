import { ref } from "vue";
import { defineStore } from "pinia";
import { getJokeTypes, getJokesAll } from "@/services/jokeService";
import type { Joke } from "@/interfaces/joke.interface";
import type { ModeForm, SortBy } from "@/types";
import { loadJokesFromLocalStorage, loadTypesFromLocalStorage, saveToLocalStorage } from "@/utils";
import { JOKES_CACHE_KEY, TYPES_CACHE_KEY } from "@/const";

export const useJokesStore = defineStore("jokes", () => {
  const jokes = ref<Joke[]>([]);
  const jokeId = ref<number>(-1);
  const formMode = ref<ModeForm>("none");

  const types = ref<string[]>([]);
  const typeSelected = ref<string>('');

  const loading = ref(false);
  const error = ref<string | null>(null);

  const currentPage = ref(1);
  const perPage = ref(10);

  const sortTypes: SortBy[] = [
    "setup-asc",
    "setup-desc",
    "rating-desc",
    "rating-asc",
    "type-asc",
    "type-desc",
    "by-user",
  ];
  const sortBy = ref<SortBy>("setup-asc");

  async function loadJokeTypes(): Promise<string[]> {
    const cachedTypes = loadTypesFromLocalStorage(TYPES_CACHE_KEY);

    if (cachedTypes) {
      setTypes(cachedTypes);
      setTypeSelected(cachedTypes[0]);
      return cachedTypes;
    }

    setLoading(true);
    setError(null);
    try {
      const _types = await getJokeTypes();
      setTypes(_types);
      setTypeSelected(_types[0]);

      saveToLocalStorage(TYPES_CACHE_KEY, _types);

      return _types;
    } catch (error: Error | unknown) {
      const _error = (error as Error).message || "Error fetching joke types";
      setError(_error);
      console.error(_error);
      return [];
    } finally {
      setLoading(false);
    }
  }

  async function loadJokes(): Promise<Joke[]> {
    const cachedJokes = loadJokesFromLocalStorage(JOKES_CACHE_KEY);
    if (cachedJokes) {
      setJokes(cachedJokes);
      return cachedJokes;
    }

    setLoading(true);
    setError(null);
    try {
      const _jokes = await getJokesAll();
      setJokes(_jokes);
      saveToLocalStorage(JOKES_CACHE_KEY, _jokes);

      return _jokes;
    } catch (error: Error | unknown) {
      const _error = (error as Error).message || "Error fetching jokes";
      setError(_error);
      console.error(_error);
      return [];
    } finally {
      setLoading(false);
    }
  }

  function setJokeRatingById(id: number, rating: number) {
    const _jokes = getJokes();
    const joke = _jokes.find((joke) => joke.id === id);
    if (joke) {
      joke.rating = rating;
      setJokes(_jokes);
      saveToLocalStorage(JOKES_CACHE_KEY, _jokes);
    }
  }

  function addJoke(joke: Joke) {
    const _jokes = getJokes();
    _jokes.unshift({ ...joke, id: Date.now(), byUser: true });
    setJokes(_jokes);
    saveToLocalStorage(JOKES_CACHE_KEY, _jokes);
  }

  function updateJoke(id: number, joke: Joke) {
    const _jokes = getJokes();
    const index = _jokes.findIndex((j) => j.id === id);
    if (index !== -1) {
      const _jokeUpdated = { ..._jokes[index], ...joke, id, byUser: true };
      _jokes[index] = _jokeUpdated;
      setJokes(_jokes);
      saveToLocalStorage(JOKES_CACHE_KEY, _jokes);
    }
  }

  function removeJokeById(id: number) {
    const _jokes = getJokes();
    const jokeIndex = _jokes.findIndex((joke) => joke.id === id);
    if (jokeIndex !== -1) {
      _jokes.splice(jokeIndex, 1);
      setJokes(_jokes);
      saveToLocalStorage(JOKES_CACHE_KEY, _jokes);
    }
  }

  function paginatedJokes(): Joke[] {
    const start = (currentPage.value - 1) * perPage.value;
    let filteredJokes = [...getJokes()];

    // Filter by type if a specific type is selected
    if (typeSelected.value && typeSelected.value !== "general") {
      filteredJokes = filteredJokes.filter(
        (joke) => joke.type === typeSelected.value
      );
    }

    if (sortBy.value === 'by-user') {
      filteredJokes = filteredJokes.filter(j => j.byUser);
      if (filteredJokes.length === 0) return [];
    }
    // Sort jokes based on sortBy value
    filteredJokes.sort((a, b) => {
      switch (sortBy.value) {
        case "setup-asc":
          return a.setup.localeCompare(b.setup);
        case "setup-desc":
          return b.setup.localeCompare(a.setup);
        case "rating-desc": {
          const ra = a.rating ?? 0;
          const rb = b.rating ?? 0;
          return rb - ra;
        }
        case "rating-asc": {
          const ra = a.rating ?? 0;
          const rb = b.rating ?? 0;
          return ra - rb;
        }
        case "type-asc":
          return a.type.localeCompare(b.type) || a.setup.localeCompare(b.setup);
        case "type-desc":
          return b.type.localeCompare(a.type) || a.setup.localeCompare(b.setup);
        case "by-user":
          return 0;
        default:
          return 0;
      }
    });

    return filteredJokes.slice(start, start + perPage.value);
  }

function getTotalPages(): number {
    // Start from all jokes
    let filteredJokes = getJokes();

    // Apply type filter (same logic as in paginatedJokes)
    if (typeSelected.value && typeSelected.value !== "general") {
      filteredJokes = filteredJokes.filter(joke => joke.type === typeSelected.value);
    }

    // Apply "by-user" filter when active (must mirror paginatedJokes)
    if (sortBy.value === 'by-user') {
      filteredJokes = filteredJokes.filter(j => j.byUser);
    }

    return Math.ceil(filteredJokes.length / perPage.value) || 1;
  }

  function setSortBy(value: SortBy) {
    sortBy.value = value;
    setCurrentPage(1);
  }

  function setJokeId(_jokeId: number) {
    jokeId.value = _jokeId;
  }

  function getJokeId(): number {
    return jokeId.value;
  }

  function setJokes(_jokes: Joke[]) {
    jokes.value = _jokes;
  }

  function getJokes(): Joke[] {
    return jokes.value;
  }

  function setModeForm(_mode: ModeForm) {
    formMode.value = _mode;
  }

  function setPerPage(page: number): void {
    setCurrentPage(1);
    perPage.value = page;
  }

  function getPerPage(): number {
    return perPage.value;
  }

  function setCurrentPage(page: number): void {
    currentPage.value = page;
  }

  function getCurrentPage(): number {
    return currentPage.value;
  }

  function setTypes(_types: string[]) {
    types.value = _types;
  }

  function setTypeSelected(_type: string) {
    typeSelected.value = _type;
    setCurrentPage(1);
  }

  function setLoading(_loading: boolean) {
    loading.value = _loading;
  }

  function setError(_error: string | null) {
    error.value = _error;
  }

  return {
    // Joke Types
    loadJokeTypes,
    getTypes: () => types.value,
    setTypeSelected,
    getTypeSelected: () => typeSelected.value,

    // jokes mutation
    addJoke,
    updateJoke,
    setJokeRatingById,
    removeJokeById,
    setJokeId,
    getJokeId,

    // jokes form mode
    setModeForm,
    getModeForm: () => formMode.value,

    // Jokes items
    loadJokes,
    getJokes,

    // Pagination
    setCurrentPage,
    getCurrentPage,
    paginatedJokes,
    getTotalPages,
    setPerPage,
    getPerPage,

    // Sorting
    setSortBy,
    getSortBy: () => sortBy.value,
    getSortTypes: () => sortTypes,

    // Loading & Error
    setLoading,
    getLoading: () => loading.value,
    getError: () => error.value,
  };
});
