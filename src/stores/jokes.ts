import { ref } from "vue";
import { defineStore } from "pinia";
import { getJokeTypes } from "@/services/jokeService";
import type { Joke } from "@/interfaces/joke.interface";

export const useJokesStore = defineStore("jokes", () => {
  const jokes = ref<Joke[]>([]);
  const types = ref<string[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function loadJokeTypes(): Promise<string[] | void> {
    setLoading(true);
    setError(null);
    try {
      const _types = await getJokeTypes();
      setTypes(_types);
      return _types;
    } catch (error: Error | unknown) {
      const _error = (error  as Error).message || "Error fetching joke types";
      setError(_error);
      console.error(_error);
    } finally {
      setLoading(false);
    }
  }

  // TODO: Implement other actions to fetch jokes, fetch by type, pagination, etc.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function setJokes(_jokes: Joke[]) {
    jokes.value = _jokes;
  }

  function getJokes(): Joke[] {
    return jokes.value;
  }

  function setTypes(_types: string[]) {
    types.value = _types;
  }

  function getTypes(): string[] {
    return types.value;
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
    loadJokeTypes,
    getJokes,
    getTypes,
    getLoading,
    getError,
  };
});
