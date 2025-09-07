import type { Joke } from './joke.interface';

export interface CacheData<T = unknown> {
    data: T;
    timestamp: number;
}

export type JokesCacheData = CacheData<Joke[]>;
export type TypesCacheData = CacheData<string[]>;