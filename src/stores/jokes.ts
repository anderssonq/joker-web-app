import { ref } from "vue";
import { defineStore } from "pinia";
import { getJokeTypes, getJokesAll } from "@/services/jokeService";
import type { Joke } from "@/interfaces/joke.interface";
import type { SortBy } from "@/types";

export const useJokesStore = defineStore("jokes", () => {
  const jokes = ref<Joke[]>([]);

  const types = ref<string[]>([]);
  const typeSelected = ref<string>("general");

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
  ];
  const sortBy = ref<SortBy>("setup-asc");

  async function loadJokeTypes(): Promise<string[]> {
    setLoading(true);
    setError(null);
    try {
      const _types = await getJokeTypes();
      setTypes(_types);
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
    setLoading(true);
    setError(null);
    try {
      const _jokes = await getJokesAll();
      setJokes(_jokes);
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

  function paginatedJokes(): Joke[] {
    const start = (currentPage.value - 1) * perPage.value;
    let filteredJokes = [...getJokes()]; // Create a copy to avoid mutating original
    
    // Filter by type if a specific type is selected
    if (typeSelected.value && typeSelected.value !== 'general') {
      filteredJokes = filteredJokes.filter(joke => joke.type === typeSelected.value);
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
        default:
          return 0;
      }
    });
    
    return filteredJokes.slice(start, start + perPage.value);
  }

  function getTotalPages(): number {
    let filteredJokes = jokes.value;
    
    if (typeSelected.value && typeSelected.value !== 'general') {
      filteredJokes = filteredJokes.filter(joke => joke.type === typeSelected.value);
    }
    
    return Math.ceil(filteredJokes.length / perPage.value);
  }

   function setSortBy(value: SortBy) {
    sortBy.value = value;
    setCurrentPage(1);
  }

  function getSortBy(): SortBy {
    return sortBy.value;
  }
  
  function getSortTypes(): SortBy[] {
    return sortTypes;
  }
  
  function setJokes(_jokes: Joke[]) {
    jokes.value = _jokes;
  }

  function getJokes(): Joke[] {
    return jokes.value;
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

  function getTypes(): string[] {
    return types.value;
  }

  function setTypeSelected(_type: string) {
    typeSelected.value = _type;
    setCurrentPage(1);
  }

  function getTypeSelected(): string {
    return typeSelected.value;
  }

  function setLoading(_loading: boolean) {
    loading.value = _loading;
  }

  function getLoading(): boolean {
    return loading.value;
  }

  function setError(_error: string | null) {
    error.value = _error;
  }

  function getError(): string | null {
    return error.value;
  }

  return {
    // Joke Types
    loadJokeTypes,
    getTypes,
    setTypeSelected,
    getTypeSelected,

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
    getSortBy,
    getSortTypes,

    // Loading & Error
    setLoading,
    getLoading,
    getError,
  };
});
