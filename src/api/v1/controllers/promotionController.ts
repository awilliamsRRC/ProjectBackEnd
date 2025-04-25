import { Request, Response, NextFunction } from "express";
import * as promotionService from "../services/promotionService";
import { Promotion } from "../services/promotionService";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { successResponse } from "../models/responseModel";

/**
 * @description Get all promotions.
 * @route GET /
 * @returns {Promise<void>}
 */
export const getAllPromotions = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const promotions: Promotion[] = await promotionService.getAllPromotions();

        res.status(200).json({ message: "Promotions Retrieved", data: promotions });
    } catch (error) {
        next(error);
    }
};

/**
 * @description Get a promotion by ID.
 * @route GET /:id
 * @returns {Promise<void>}
 */
export const getPromotionById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const promotion: Promotion | null = await promotionService.getPromotionById(id);

        if (!promotion) {
            res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Promotion not found." });
            return; 
        }

        res.status(HTTP_STATUS.OK).json(
            successResponse(
                promotion,
                `Promotion with id "${id}" retrieved successfully`
            )
        );
    } catch (error) {
        next(error);
    }
};


/**
 * @description Create a new promotion.
 * @route POST /
 * @returns {Promise<void>}
 */
export const createPromotion = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // call the promotionService by passing the body of the request
        const newPromotion: Promotion = await promotionService.createPromotion(req.body);

        res.status(HTTP_STATUS.CREATED).json(
            successResponse(newPromotion, "Promotion Created")
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description Update an existing promotion.
 * @route PUT /:id
 * @returns {Promise<void>}
 */
export const updatePromotion = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const updatedPromotion: Promotion = await promotionService.updatePromotion(
            req.params.id,
            req.body
        );
        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedPromotion, "Promotion Updated")
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description Delete a promotion.
 * @route DELETE /:id
 * @returns {Promise<void>}
 */
export const deletePromotion = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        await promotionService.deletePromotion(req.params.id);
        res.status(HTTP_STATUS.OK).json({
            message: "Promotion Deleted"
        });
    } catch (error) {
        next(error);
    }
};
