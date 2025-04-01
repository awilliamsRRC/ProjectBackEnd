/**
 * Movie Service (MovieService.ts)
 *
 * This file defines functions (services) for managing movie data. These functions
 * currently store movies in-memory but could be extended to use a database.
 */

/**
 * @interface Movie
 * @description Represents an item object.
 */
export type Movie = {
    id: string;
    name: string;
    description: string;
};

const movies: Movie[] = [];

/**
 * @description Get all items.
 * @returns {Promise<Movie[]>}
 */
export const getAllMovies = async (): Promise<Movie[]> => {
    return movies;
};
