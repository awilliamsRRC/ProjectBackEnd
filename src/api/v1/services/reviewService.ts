import { db } from "../../../../config/firebaseConfig";
import { encryptData, decryptData } from "../utils/encryptionUtil";
import {
    getDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
} from "../repositories/firestoreRepository";

const COLLECTION = "Review";  

export type Review = {
    id: string;
    movieId: string;
    reviewer: string;
    rating: number;
    comment: string;
};

/**
 * @description Get all reviews.
 * @returns {Promise<Review[]>}
 */
export const getAllReviews = async (): Promise<Review[]> => {
    const snapshot = await getDocuments(COLLECTION);
    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            movieId: data.movieId,
            reviewer: data.reviewer,
            rating: data.rating,
            comment: data.comment ? decryptData(data.comment) : "No comment",
        } as Review;
    });
};

/**
 * @description Get a single review by Firestore document ID.
 * @param {string} _ - Unused fieldName to preserve signature.
 * @param {string} id - The Firestore document ID of the review.
 * @returns {Promise<Review[]>}
 */
export const getReviewById = async (_: string, id: string): Promise<Review[]> => {
    const docRef = db.collection(COLLECTION).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
        throw new Error(`No documents found in collection ${COLLECTION} where id == ${id}`);
    }

    const data = doc.data();

    return [
        {
            id: doc.id,
            movieId: data?.movieId || "Unknown Movie ID",
            reviewer: data?.reviewer || "Unknown Reviewer",
            rating: data?.rating || 0,
            comment: data?.comment ? decryptData(data.comment) : "Invalid Data",
        },
    ];
};

/**
 * @description Creates a new review.
 * @returns {Promise<Review>}
 */
export const createReview = async (review: {
    movieId: string;
    reviewer: string;
    rating: number;
    comment: string;
}): Promise<Review> => {
    if (!review.movieId || !review.reviewer || !review.rating || !review.comment) {
        throw new Error("Review movieId, reviewer, rating, and comment are required");
    }

    const encryptedComment = encryptData(review.comment);

    const reviewData = {
        movieId: review.movieId,
        reviewer: review.reviewer,
        rating: review.rating,
        comment: encryptedComment,
    };

    const id = await createDocument(COLLECTION, reviewData);

    return {
        id,
        ...reviewData,
    };
};

/**
 * @description Updates an existing review, re-encrypting fields as needed.
 * @returns {Promise<Review>}
 */
export const updateReview = async (
    id: string,
    review: Partial<Review>
): Promise<Review> => {
    const updatePayload: Partial<Review> = {
        ...(review.movieId && { movieId: review.movieId }),
        ...(review.reviewer && { reviewer: review.reviewer }),
        ...(review.rating && { rating: review.rating }),
        ...(review.comment && { comment: encryptData(review.comment) }),
    };

    await updateDocument(COLLECTION, id, updatePayload);

    return {
        id,
        ...review,
    } as Review;
};

/**
 * @description Deletes a review by its unique ID from Firestore.
 * @returns {Promise<void>}
 */
export const deleteReview = async (id: string): Promise<void> => {
    await deleteDocument(COLLECTION, id);
};
