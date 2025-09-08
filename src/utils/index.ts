import { CACHE_DURATION, JOKES_CACHE_KEY, TYPES_CACHE_KEY } from "@/const";
import type {
  JokesCacheData,
  TypesCacheData,
} from "@/interfaces/cache-data.interface";

export const confirmModal = (title: string) => window.confirm(title);

export function saveToLocalStorage<
  T extends TypesCacheData["data"] | JokesCacheData["data"],
>(key: string, data: T) {
  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.warn("Failed to save to localStorage:", error);
  }
}

export function loadJokesFromLocalStorage(
  key: string
): JokesCacheData["data"] | null {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const parsedCache = JSON.parse(cached);

    if (Date.now() - parsedCache.timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }

    return parsedCache.data;
  } catch (error) {
    console.warn("Failed to load from localStorage:", error);
    localStorage.removeItem(key);
    return null;
  }
}
export function loadTypesFromLocalStorage(
  key: string
): TypesCacheData["data"] | null {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const parsedCache = JSON.parse(cached);

    if (Date.now() - parsedCache.timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }

    return parsedCache.data;
  } catch (error) {
    console.warn("Failed to load from localStorage:", error);
    localStorage.removeItem(key);
    return null;
  }
}

export function clearCache() {
  localStorage.removeItem(JOKES_CACHE_KEY);
  localStorage.removeItem(TYPES_CACHE_KEY);
}
