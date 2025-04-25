/**
 * Movie Controller (movieController.ts)
 *
 * This file defines functions (controllers) for handling incoming requests related to items.
 * These functions interact with the item service (movieService.ts) to perform the actual
 * logic for CRUD operations on items.
 */

import { Request, Response, NextFunction } from "express";
import * as movieService from "../services/movieService";
import type { Movie } from "../services/movieService";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { successResponse } from "../models/responseModel";

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
        const movies: Movie[] = await movieService.getAllMovies();

        res.status(200).json({ message: "Movies Retrieved", data: movies });
    } catch (error) {
        next(error);
    }
};

/**
 * @description Get movies by ID.
 * @route GET /:id
 * @returns {Promise<void>}
 */
export const getMoviesId = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        
        const movies: Movie[] = await movieService.getMoviesId(
            "id",
            id,
        );

        res.status(HTTP_STATUS.OK).json(
            successResponse(
                movies,
                `Movie with id "${id}" retrieved successfully`
            )
        );
    } catch (error) {
        next(error);
    }
};
/**
 * @description Create a new movie.
 * @route POST /
 * @returns {Promise<void>}
 */
export const createMovie = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // call the movieService by passing the body of the request
        const newMovie: Movie = await movieService.createMovie(req.body);

        res.status(HTTP_STATUS.CREATED).json(
            successResponse(newMovie, "Movie Created")
        );
    } catch (error) {
        next(error);
    }
};
/**
 * @description Update an existing movie.
 * @route PUT /:id
 * @returns {Promise<void>}
 */
export const updateMovie = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        console.log("Controller called");
        // call the movieService by passing the id from the url path and the body of the request
        const updatedMovie: Movie = await movieService.updateMovie(
            req.params.id,
            req.body
        );
        console.log("Request body:", req.body); 
        console.log("Request id params",req.params.id);
        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedMovie, "Movie Updated")
        );
    } catch (error) {
        console.log("Error in controller:", error);
        next(error);
    }
};

/**
 * @description Delete a movie.
 * @route DELETE /movies/:id
 * @returns {Promise<void>}
 */
export const deleteMovie = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        await movieService.deleteMovie(req.params.id);
        res.status(200).json({
            message: "Movie Deleted"  
        });
    } catch (error) {
        next(error);
    }
};
