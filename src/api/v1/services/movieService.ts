/**
 * Movie Service (MovieService.ts)
 *
 * This file defines functions (services) for managing movie data. These functions
 * currently store movies in-memory but could be extended to use a database.
 */

import { encryptData } from "../utils/encryptionUtil";
import { decryptData } from "../utils/encryptionUtil";
import {
    getDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocumentsByFieldValue,
} from "../repositories/firestoreRepository";

const COLLECTION = "Movie";
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
    const snapshot: FirebaseFirestore.QuerySnapshot = await getDocuments(COLLECTION);
    return snapshot.docs.map((doc) => {
        const data: FirebaseFirestore.DocumentData = doc.data();
        return {
            id: doc.id,
            ...data,
            description: decryptData(data.description || ""),
            price: decryptData(data.price || ""),
        } as Movie;
    });
};

/**
 * @description Get movies by ID.
 * @returns {Promise<Movie[]>}
 */
export const getMoviesId = async (
    fieldName: string,
    fieldValue: string,
): Promise<Movie[]> => {
    const snapshot: FirebaseFirestore.QuerySnapshot =
        await getDocumentsByFieldValue(
            COLLECTION,
            fieldName,
            fieldValue
        );

    return snapshot.docs.map((doc) => {
        const data: FirebaseFirestore.DocumentData = doc.data();
        return {
            id: doc.id,
            ...data,
            description: decryptData(data.description || ""),
            price: decryptData(data.price || ""),
        } as Movie;
    });
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

    const movieData = {
        name: movie.name,
        description: encryptedDescription,
        price: encryptedPrice
    };

    const id = await createDocument(COLLECTION, movieData); 

    const newMovie: Movie = {
        id,
        ...movieData
    };

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
    movie: Partial<Movie>
): Promise<Movie> => {
    await updateDocument(COLLECTION, id, movie);
    return { id, ...movie } as Movie;
};

/**
 * @description Deletes a movie by its unique ID from the in-memory database.
 * @param {string} id - The ID of the movie to delete.
 * @returns {Promise<void>} A promise that resolves once the movie is deleted.
 * @throws {Error} Throws an error if the movie with the given ID is not found.
 */
export const deleteMovie = async (id: string): Promise<void> => {
    await deleteDocument(COLLECTION, id);
};