import express, { Router } from "express";
import * as reviewController from "../controllers/reviewController";
import { reviewSchema, deleteReviewSchema, reviewParamSchema } from "../validation/reviewSchema";
import { validateRequest } from "../middleware/validate";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

// express Router instance created
const router: Router = express.Router();

/**
 * @openapi
 * /api/v1/reviews:
 *   get:
 *     summary: Retrieve all reviews
 *     description: Get a list of all reviews.
 *     responses:
 *       200:
 *         description: A list of reviews.
 */
router.get("/", authenticate, reviewController.getAllReviews);

/**
 * @openapi
 * /api/v1/reviews/{id}:
 *   get:
 *     summary: Retrieve a review by ID
 *     description: Get a review by its unique ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the review to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review data retrieved successfully.
 *       404:
 *         description: Review not found.
 */
router.get("/:id", authenticate, reviewController.getReviewById);

/**
 * @openapi
 * /api/v1/reviews:
 *   post:
 *     summary: Create a new review
 *     description: Add a new review for a movie to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movie_id:
 *                 type: string
 *               user:
 *                 type: string
 *               rating:
 *                 type: integer
 *               review_text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created successfully.
 */
router.post("/", authenticate, validateRequest(reviewSchema), reviewController.createReview);

/**
 * @openapi
 * /api/v1/reviews/{id}:
 *   put:
 *     summary: Update an existing review
 *     description: Modify the details of an existing review.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the review to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movie_id:
 *                 type: string
 *               user:
 *                 type: string
 *               rating:
 *                 type: integer
 *               review_text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated successfully.
 *       404:
 *         description: Review not found.
 */
router.put("/:id", authenticate, isAuthorized({ hasRole: ["admin"] }), validateRequest(reviewSchema), reviewController.updateReview);

/**
 * @openapi
 * /api/v1/reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     description: Remove a review from the database.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the review to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully.
 *       404:
 *         description: Review not found.
 */
router.delete("/:id", authenticate, isAuthorized({ hasRole: ["admin"] }), validateRequest(deleteReviewSchema), reviewController.deleteReview);

export default router;
