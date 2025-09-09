import type { Joke } from "@/interfaces/joke.interface";

const BASE_URL = import.meta.env.VITE_JOKE_API_BASE_URL;

export async function getJokeTypes(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/types`);
  if (!res.ok) throw new Error("Error fetching joke types");
  return await res.json();
}

export async function getJokesAll(): Promise<Joke[]> {
  const res = await fetch(`${BASE_URL}/jokes/random/451`);
  if (!res.ok) throw new Error("Error fetching jokes");
  return await res.json();
}
