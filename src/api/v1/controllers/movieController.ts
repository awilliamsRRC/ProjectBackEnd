/**
 * Movie Controller (movieController.ts)
 *
 * This file defines functions (controllers) for handling incoming requests related to items.
 * These functions interact with the item service (movieService.ts) to perform the actual
 * logic for CRUD operations on items.
 */

import { Request, Response, NextFunction } from "express";
import * as itemService from "../services/itemService";
import type { Item } from "../services/itemService";

/**
 * @description Get all movies.
 * @route GET /
 * @returns {Promise<void>}
 */
export const getAllMovies = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const movies: Movie[] = await MovieService.getAllMovies();

        res.status(200).json({ message: "Movies Retrieved", data: movies });
    } catch (error) {
        next(error);
    }
};
