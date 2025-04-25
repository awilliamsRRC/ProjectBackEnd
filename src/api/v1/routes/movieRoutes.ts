/**
 * Movie Routes (movieRoutes.ts)
 *
 * This file defines the routes for managing movies in our application.
 * It uses the Express framework for routing and makes calls to the movie controller
 * (movieController.ts) to handle the logic for each route.
 */
import express, { Router } from "express";
import * as movieController from "../controllers/movieController";
import { movieSchema, deleteMovieSchema,movieParamSchema } from "../validation/movieValidations";
import { validateRequest } from "../middleware/validate";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

// express Router instance created. This instance will group all the item-related routes.
const router: Router = express.Router();

// app.use("/api/v1/movies", movieRoutes);

/**
 * @openapi
 * /api/v1/movies:
 *   get:
 *     summary: Retrieve all movies
 *     description: Get a list of all movies.
 *     responses:
 *       200:
 *         description: A list of movies.
 */
router.get("/",authenticate, movieController.getAllMovies);

/**
 * @openapi
 * /api/v1/movies/{id}:
 *   get:
 *     summary: Retrieve a movie by ID
 *     description: Get a movie by its unique ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the movie to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie data retrieved successfully.
 *       404:
 *         description: Movie not found.
 */
router.get("/:id",authenticate, movieController.getMoviesId);

/**
 * @openapi
 * /api/v1/movies:
 *   post:
 *     summary: Create a new movie
 *     description: Add a new movie to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               genre:
 *                 type: string
 *               releaseDate:
 *                 type: string
 *     responses:
 *       201:
 *         description: Movie created successfully.
 */
router.post("/",authenticate,validateRequest(movieSchema), movieController.createMovie);

/**
 * @openapi
 * /api/v1/movies/{id}:
 *   put:
 *     summary: Update an existing movie
 *     description: Modify the details of an existing movie.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the movie to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               genre:
 *                 type: string
 *               releaseDate:
 *                 type: string
 *     responses:
 *       200:
 *         description: Movie updated successfully.
 *       404:
 *         description: Movie not found.
 */
router.put("/:id",authenticate,isAuthorized({ hasRole: ["admin",] }),validateRequest(movieSchema), movieController.updateMovie);

/**
 * @openapi
 * /api/v1/movies/{id}:
 *   delete:
 *     summary: Delete a movie
 *     description: Remove a movie from the database.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the movie to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie deleted successfully.
 *       404:
 *         description: Movie not found.
 */
router.delete("/:id",authenticate,isAuthorized({ hasRole: ["admin"] }),validateRequest(deleteMovieSchema), movieController.deleteMovie);

export default router;
