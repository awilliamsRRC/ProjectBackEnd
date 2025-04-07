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
    return movies;
};
/**
 * @description Get movies by ID.
 * @returns {Promise<Movie[]>}
 */
export const getMoviesId = async (id: string): Promise<Movie | null> => {
    const movie = movies.find((movie) => movie.id === id);
    return movie || null;
  };

// create Movie
export const createMovie = async (movie: {
    name: string;
    description: string;
    price:string
}): Promise<Movie> => {
    // the ... is the spread operator in js/ts and is the same as writing { name: item.name, description: item.description }
    const newMovie: Movie = { id: Date.now().toString(), ...movie };

    // adding the new item to the global scoped array of Items
    movies.push(newMovie);
    return newMovie;
};
// update movie
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
// dlete movie
export const deleteMovie = async (id: string): Promise<void> => {
    const index: number = movies.findIndex((i) => i.id === id);
    if (index === -1) {
        throw new Error(`Item with ID ${id} not found`);
    }

    // remove the item from the Item array, start the delete form the index and only delete 1 index.
    movies.splice(index, 1);
};