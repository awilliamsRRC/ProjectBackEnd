import { db } from "../../../../config/firebaseConfig";
import { encryptData, decryptData } from "../utils/encryptionUtil";
import {
    getDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
} from "../repositories/firestoreRepository";

const COLLECTION = "Movie";

export type Movie = {
    id: string;
    name: string;
    description: string;
    price: string;
};

/**
 * @description Get all movies.
 * @returns {Promise<Movie[]>}
 */
export const getAllMovies = async (): Promise<Movie[]> => {
    const snapshot = await getDocuments(COLLECTION);
    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name,
            description: data.description ? decryptData(data.description) : "No description",
            price: data.price ? decryptData(data.price) : "No price",
        } as Movie;
    });
};

/**
 * @description Get a single movie by Firestore document ID.
 * @param {string} _ - Unused fieldName to preserve signature.
 * @param {string} id - The Firestore document ID of the movie.
 * @returns {Promise<Movie[]>}
 */
export const getMoviesId = async (_: string, id: string): Promise<Movie[]> => {
    const docRef = db.collection(COLLECTION).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
        throw new Error(`No documents found in collection ${COLLECTION} where id == ${id}`);
    }

    const data = doc.data();

    return [
        {
            id: doc.id,
            name: data?.name || "Unknown Name",
            description: data?.description ? decryptData(data.description) : "Invalid Data",
            price: data?.price ? decryptData(data.price) : "Invalid Data",
        },
    ];
};

/**
 * @description Creates a new movie.
 * @returns {Promise<Movie>}
 */
export const createMovie = async (movie: {
    name: string;
    description: string;
    price: string;
}): Promise<Movie> => {
    if (!movie.name || !movie.description || !movie.price) {
        throw new Error("Movie name, description, and price are required");
    }

    const encryptedDescription = encryptData(movie.description);
    const encryptedPrice = encryptData(movie.price);

    const movieData = {
        name: movie.name,
        description: encryptedDescription,
        price: encryptedPrice,
    };

    const id = await createDocument(COLLECTION, movieData);

    return {
        id,
        ...movieData,
    };
};

/**
 * @description Updates an existing movie, re-encrypting fields as needed.
 * @returns {Promise<Movie>}
 */
export const updateMovie = async (
    id: string,
    movie: Partial<Movie>
): Promise<Movie> => {
    const updatePayload: Partial<Movie> = {
        ...(movie.name && { name: movie.name }),
        ...(movie.description && { description: encryptData(movie.description) }),
        ...(movie.price && { price: encryptData(movie.price) }),
    };

    await updateDocument(COLLECTION, id, updatePayload);

    return {
        id,
        ...movie,
    } as Movie;
};

/**
 * @description Deletes a movie by its unique ID from Firestore.
 * @returns {Promise<void>}
 */
export const deleteMovie = async (id: string): Promise<void> => {
    await deleteDocument(COLLECTION, id);
};
