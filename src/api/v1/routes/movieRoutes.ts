/**
 * Movie Routes (movieRoutes.ts)
 *
 * This file defines the routes for managing movies in our application.
 * It uses the Express framework for routing and makes calls to the movie controller
 * (movieController.ts) to handle the logic for each route.
 */
import express, { Router } from "express";
import * as movieController from "../controllers/movieController";

// express Router instance created. This instance will group all the item-related routes.
const router: Router = express.Router();

// app.use("/api/v1/movies", movieRoutes);

/**
 * @route GET /movies
 * @description Get all items.
 */
router.get("/", movieController.getAllMovies);
/**
 * @route GET /movies/:id
 * @description Get items by id.
 */
router.get("/:id", movieController.getMoviesId);
/**
 * @route POST /movies
 * @description Create a new movie.
 */
router.post("/", movieController.createMovie);

router.put("/:id", movieController.updateMovie);

router.delete("/:id", movieController.deleteMovie);


export default router;
