import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import { getJokeTypes, getJokesAll } from "@/services/jokeService";
import type { Joke } from "@/interfaces/joke.interface";
import type { ModeForm, SortBy } from "@/types";
import { loadJokesFromLocalStorage, loadTypesFromLocalStorage, saveToLocalStorage } from "@/utils";
import { JOKES_CACHE_KEY, TYPES_CACHE_KEY } from "@/const";
import { usePagination } from "@/composables/usePagination";

export const useJokesStore = defineStore("jokes", () => {
  const jokes = ref<Joke[]>([]);
  const jokeId = ref<number>(-1);
  const formMode = ref<ModeForm>("none");

  const types = ref<string[]>([]);
  const typeSelected = ref<string>("");

  const loading = ref(false);
  const error = ref<string | null>(null);

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

  const comparators: Record<SortBy, (a: Joke, b: Joke) => number> = {
    "setup-asc": (a, b) => a.setup.localeCompare(b.setup),
    "setup-desc": (a, b) => b.setup.localeCompare(a.setup),
    "rating-desc": (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
    "rating-asc": (a, b) => (a.rating ?? 0) - (b.rating ?? 0),
    "type-asc": (a, b) => a.type.localeCompare(b.type) || a.setup.localeCompare(b.setup),
    "type-desc": (a, b) => b.type.localeCompare(a.type) || a.setup.localeCompare(b.setup),
    "by-user": () => 0
  };

  const sortedAndFilteredJokes = computed<Joke[]>(() => {
    let list = [...getJokes()];

    if (typeSelected.value && typeSelected.value !== "general") {
      list = list.filter(j => j.type === typeSelected.value);
    }
    if (sortBy.value === "by-user") {
      list = list.filter(j => j.byUser);
    }

    list.sort(comparators[sortBy.value]);
    return list;
  });

  const {
    getPaginatedItems,
    getTotalPages,
    setPage,
    setPerPage,
    getCurrentPage,
    getPerPage
  } = usePagination<Joke>(() => sortedAndFilteredJokes.value);

  watch([sortBy, typeSelected], () => {
    setPage(1);
  });

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
    const _jokes = [...getJokes()];
    const joke = _jokes.find(j => j.id === id);
    if (joke) {
      joke.rating = rating;
      setJokes(_jokes);
      saveToLocalStorage(JOKES_CACHE_KEY, _jokes);
    }
  }

  function addJoke(joke: Joke) {
    const _jokes = [...jokes.value];
    _jokes.unshift({ ...joke, id: Date.now(), byUser: true });
    setJokes(_jokes);
    saveToLocalStorage(JOKES_CACHE_KEY, _jokes);
  }

  function updateJoke(id: number, joke: Joke) {
    const _jokes = [...jokes.value];
    const index = _jokes.findIndex(j => j.id === id);
    if (index !== -1) {
      _jokes[index] = { ..._jokes[index], ...joke, id, byUser: true };
      setJokes(_jokes);
      saveToLocalStorage(JOKES_CACHE_KEY, _jokes);
    }
  }

  function removeJokeById(id: number) {
    const _jokes = jokes.value.filter(j => j.id !== id);
    setJokes(_jokes);
    saveToLocalStorage(JOKES_CACHE_KEY, _jokes);
  }

  function paginatedJokes(): Joke[] {
    if (sortBy.value === 'by-user' && sortedAndFilteredJokes.value.length === 0) return [];
    return getPaginatedItems();
  }

  function setSortBy(value: SortBy) {
    sortBy.value = value;
  }

  function setJokeId(_jokeId: number) {
    jokeId.value = _jokeId;
  }


  function setTypes(_types: string[]) {
    types.value = _types;
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

  function setTypeSelected(_type: string) {
    typeSelected.value = _type;
  }

  function setLoading(_loading: boolean) {
    loading.value = _loading;
  }

  function setError(_error: string | null) {
    error.value = _error;
  }

  return {
    // Jokes Types
    loadJokeTypes,
    getTypes: () => types.value,
    setTypeSelected,
    getTypeSelected: () => typeSelected.value,

    // Jokes CRUD
    loadJokes,
    getJokes,
    addJoke,
    updateJoke,
    removeJokeById,
    setJokeRatingById,
    setJokeId,
    getJokeId: () => jokeId.value,

    // Form mode
    setModeForm,
    getModeForm: () => formMode.value,

    // Sorting
    setSortBy,
    getSortBy: () => sortBy.value,
    getSortTypes: () => sortTypes,

    // Pagination
    paginatedJokes,
    getTotalPages,
    setCurrentPage: setPage,
    getCurrentPage,
    setPerPage,
    getPerPage,

    // Loading / Error
    setLoading,
    getLoading: () => loading.value,
    getError: () => error.value,
  };
});
