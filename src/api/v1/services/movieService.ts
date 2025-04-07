import { encryptData } from "../utils/encryptionUtil";
import { decryptData } from "../utils/encryptionUtil";
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
    price: string;
};

const movies: Movie[] = [];

/**
 * @description Get all movies.
 * @returns {Promise<Movie[]>}
 */
export const getAllMovies = async (): Promise<Movie[]> => {
    return movies.map((movie) => ({
        ...movie,
        description: decryptData(movie.description || ""),
        price: decryptData(movie.price || ""),
    }));
};
/**
 * @description Get movies by ID.
 * @returns {Promise<Movie[]>}
 */
export const getMoviesId = async (id: string): Promise<Movie | null> => {
    const movie = movies.find((movie) => movie.id === id);
    return movie || null;
  };

/**
 * @description Creates a new movie and adds it to the in-memory database.
 * @param {Object} movie - The movie object to create.
 * @param {string} movie.name - The name of the movie.
 * @param {string} movie.description - A description of the movie.
 * @param {string} movie.price - The price of the movie.
 * @returns {Promise<Movie>} A promise that resolves to the newly created movie object.
 */
export const createMovie = async (movie: {
    name: string;
    description: string;
    price:string
}): Promise<Movie> => {
    if (!movie.name || !movie.description || !movie.price) {
        throw new Error("Movie name, description, and price are required");
    }
    const encryptedDescription = encryptData(movie.description);
    const encryptedPrice = encryptData(movie.price);

    console.log("Encrypted Description:", encryptedDescription);
    console.log("Encrypted Price:", encryptedPrice);
   
    const newMovie: Movie = {
        id: Date.now().toString(),
        name: movie.name,
        description: encryptedDescription,
        price: encryptedPrice
    };

    // adding the new item to the global scoped array of Items
    movies.push(newMovie);
    console.log("Movies Array:", movies);
    return newMovie;
};

/**
 * @description Updates an existing movie in the in-memory database.
 * @param {string} id - The ID of the movie to update.
 * @param {Object} movie - The updated movie data.
 * @param {string} movie.name - The updated name of the movie.
 * @param {string} movie.description - The updated description of the movie.
 * @param {string} movie.price - The updated price of the movie.
 * @returns {Promise<Movie>} A promise that resolves to the updated movie object.
 * @throws {Error} Throws an error if the movie with the given ID is not found.
 */
export const updateMovie = async (
    id: string,
    movie: { name: string; description: string; price:string }
): Promise<Movie> => {
    // retieve the item's index from the items array by comparing the item ids
    const index: number = movies.findIndex((i) => i.id === id);
    // if the index is not found we expects a -1
    if (index === -1) {
        throw new Error(`Item with ID ${id} not found`);
    }

    // assign the new value of the found index
    movies[index] = { id, ...movie };

    return movies[index];
}; 

/**
 * @description Deletes a movie by its unique ID from the in-memory database.
 * @param {string} id - The ID of the movie to delete.
 * @returns {Promise<void>} A promise that resolves once the movie is deleted.
 * @throws {Error} Throws an error if the movie with the given ID is not found.
 */
export const deleteMovie = async (id: string): Promise<void> => {
    const index: number = movies.findIndex((i) => i.id === id);
    if (index === -1) {
        throw new Error(`Item with ID ${id} not found`);
    }

    // remove the item from the Item array, start the delete form the index and only delete 1 index.
    movies.splice(index, 1);
};