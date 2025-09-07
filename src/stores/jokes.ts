import { ref } from "vue";
import { defineStore } from "pinia";
import { getJokeTypes, getJokesAll } from "@/services/jokeService";
import type { Joke } from "@/interfaces/joke.interface";

export const useJokesStore = defineStore("jokes", () => {
  const jokes = ref<Joke[]>([]);

  const types = ref<string[]>([]);
  const typeSelected = ref<string>("general");

  const loading = ref(false);
  const error = ref<string | null>(null);

  const currentPage = ref(1);
  const perPage = ref(5);

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
    let filteredJokes = getJokes();
    
    // Filter by type if a specific type is selected
    if (typeSelected.value && typeSelected.value !== 'general') {
      filteredJokes = filteredJokes.filter(joke => joke.type === typeSelected.value);
    }
    
    return filteredJokes.slice(start, start + perPage.value);
  }

  function getTotalPages(): number {
    let filteredJokes = jokes.value;
    
    // Filter by type if a specific type is selected
    if (typeSelected.value && typeSelected.value !== 'general') {
      filteredJokes = filteredJokes.filter(joke => joke.type === typeSelected.value);
    }
    
    return Math.ceil(filteredJokes.length / perPage.value);
  }

  function setJokes(_jokes: Joke[]) {
    jokes.value = _jokes;
  }

  function getJokes(): Joke[] {
    return jokes.value;
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

    // Loading & Error
    setLoading,
    getLoading,
    getError,
  };
});
