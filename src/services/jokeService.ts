import type { Joke } from "@/interfaces/joke.interface";

const BASE_URL = import.meta.env.VITE_JOKE_API_BASE_URL;

export async function getRandomJoke(): Promise<Joke> {
  const res = await fetch(`${BASE_URL}/random_joke`);
  if (!res.ok) throw new Error("Error fetching joke");
  return await res.json();
}

export async function getRandomJokes(count: number): Promise<Joke[]> {
  const res = await fetch(`${BASE_URL}/jokes/random/${count}`);
  if (!res.ok) throw new Error("Error fetching jokes");
  return await res.json();
}

export async function getJokeTypes(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/types`);
  if (!res.ok) throw new Error("Error fetching joke types");
  return await res.json();
}

export async function getJokeById(id: number): Promise<Joke> {
  const res = await fetch(`${BASE_URL}/jokes/${id}`);
  if (!res.ok) throw new Error("Error fetching joke");
  return await res.json();
}

export async function getJokesAll(): Promise<Joke[]> {
  const res = await fetch(`${BASE_URL}/jokes/random/451`);
  if (!res.ok) throw new Error("Error fetching jokes");
  return await res.json();
}

export async function getPaginatedJokes(
  page: number,
  pageSize: number,
  type: string = "random"
): Promise<Joke[]> {
  const res = await fetch(`${BASE_URL}/jokes/${type}/${page * pageSize}`);
  if (!res.ok) throw new Error("Error fetching jokes");
  const jokes: Joke[] = await res.json();
  const start = (page - 1) * pageSize;
  return jokes.slice(start, start + pageSize);
}

export async function getJokesByType(
  type: string,
  count: number = 1
): Promise<Joke[]> {
  let endpoint = `${BASE_URL}/jokes/${type}/random`;
  if (count > 1) {
    endpoint = `${BASE_URL}/jokes/${type}/ten`;
  }
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error("Error fetching jokes by type");
  return await res.json();
}
