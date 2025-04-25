import { Request, Response, NextFunction } from "express";
import * as reviewService from "../services/reviewService";
import { Review } from "../services/reviewService";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { successResponse } from "../models/responseModel";

/**
 * @description Get all reviews.
 * @route GET /
 * @returns {Promise<void>}
 */
export const getAllReviews = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const reviews: Review[] = await reviewService.getAllReviews();

        res.status(200).json({ message: "Reviews Retrieved", data: reviews });
    } catch (error) {
        next(error);
    }
};

/**
 * @description Get a review by ID.
 * @route GET /:id
 * @returns {Promise<void>}
 */
export const getReviewById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        // Assume service returns an array of reviews
        const reviews: Review[] = await reviewService.getReviewById("id", id);

        const review = reviews[0]; // Grab the first one

        if (!review) {
            res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Review not found." });
            return; // optional, for flow clarity
        }
        

        res.status(HTTP_STATUS.OK).json(
            successResponse(
                review,
                `Review with id "${id}" retrieved successfully`
            )
        );
    } catch (error) {
        next(error);
    }
};


/**
 * @description Create a new review.
 * @route POST /
 * @returns {Promise<void>}
 */
export const createReview = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // call the reviewService by passing the body of the request
        const newReview: Review = await reviewService.createReview(req.body);

        res.status(HTTP_STATUS.CREATED).json(
            successResponse(newReview, "Review Created")
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description Update an existing review.
 * @route PUT /:id
 * @returns {Promise<void>}
 */
export const updateReview = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const updatedReview: Review = await reviewService.updateReview(
            req.params.id,
            req.body
        );
        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedReview, "Review Updated")
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description Delete a review.
 * @route DELETE /:id
 * @returns {Promise<void>}
 */
export const deleteReview = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        await reviewService.deleteReview(req.params.id);
        res.status(HTTP_STATUS.OK).json({
            message: "Review Deleted"
        });
    } catch (error) {
        next(error);
    }
};
