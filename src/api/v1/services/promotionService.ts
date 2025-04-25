import { db } from "../../../../config/firebaseConfig";
import { encryptData, decryptData } from "../utils/encryptionUtil";
import {
    getDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
} from "../repositories/firestoreRepository";

const COLLECTION = "Promotion";

export type Promotion = {
    id: string;
    title: string;
    description: string;
    discount: string;
    startDate: string;
    endDate: string;
};

/**
 * @description Get all promotions.
 * @returns {Promise<Promotion[]>}
 */
export const getAllPromotions = async (): Promise<Promotion[]> => {
    const snapshot = await getDocuments(COLLECTION);

    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            title: data.title,
            description: data.description ? decryptData(data.description) : "No description",
            discount: data.discount,
            startDate: data.startDate,
            endDate: data.endDate,
        } as Promotion;
    });
};

/**
 * @description Get a promotion by Firestore document ID.
 * @param {string} id - The Firestore document ID of the promotion.
 * @returns {Promise<Promotion | null>}
 */
export const getPromotionById = async (id: string): Promise<Promotion | null> => {
    const docRef = db.collection(COLLECTION).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return null;
    }

    const data = doc.data();

    return {
        id: doc.id,
        title: data?.title || "Untitled",
        description: data?.description ? decryptData(data.description) : "No description",
        discount: data?.discount || "0%",
        startDate: data?.startDate || "Unknown",
        endDate: data?.endDate || "Unknown",
    };
};

/**
 * @description Create a new promotion.
 * @returns {Promise<Promotion>}
 */
export const createPromotion = async (promotion: {
    title: string;
    description: string;
    discount: string;
    startDate: string;
    endDate: string;
}): Promise<Promotion> => {
    if (!promotion.title || !promotion.description || !promotion.discount || !promotion.startDate || !promotion.endDate) {
        throw new Error("All fields are required");
    }

    const encryptedDescription = encryptData(promotion.description);

    const promoData = {
        title: promotion.title,
        description: encryptedDescription,
        discount: promotion.discount,
        startDate: promotion.startDate,
        endDate: promotion.endDate,
    };

    const id = await createDocument(COLLECTION, promoData);

    return {
        id,
        ...promoData,
        description: promotion.description // Return decrypted for client
    };
};

/**
 * @description Update an existing promotion.
 * @returns {Promise<Promotion>}
 */
export const updatePromotion = async (
    id: string,
    promotion: Partial<Promotion>
): Promise<Promotion> => {
    const updatePayload: Partial<Promotion> = {
        ...(promotion.title && { title: promotion.title }),
        ...(promotion.description && { description: encryptData(promotion.description) }),
        ...(promotion.discount && { discount: promotion.discount }),
        ...(promotion.startDate && { startDate: promotion.startDate }),
        ...(promotion.endDate && { endDate: promotion.endDate }),
    };

    await updateDocument(COLLECTION, id, updatePayload);

    return {
        id,
        ...promotion,
    } as Promotion;
};

/**
 * @description Delete a promotion by ID.
 * @returns {Promise<void>}
 */
export const deletePromotion = async (id: string): Promise<void> => {
    await deleteDocument(COLLECTION, id);
};
