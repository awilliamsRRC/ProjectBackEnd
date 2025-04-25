import express, { Router } from "express";
import * as promotionController from "../controllers/promotionController";
import { promotionSchema, deletePromotionSchema, promotionParamSchema } from "../validation/promotionSchema";
import { validateRequest } from "../middleware/validate";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

// express Router instance created
const router: Router = express.Router();

/**
 * @openapi
 * /api/v1/promotions:
 *   get:
 *     summary: Retrieve all promotions
 *     description: Get a list of all promotions.
 *     responses:
 *       200:
 *         description: A list of promotions.
 */
router.get("/", authenticate, promotionController.getAllPromotions);

/**
 * @openapi
 * /api/v1/promotions/{id}:
 *   get:
 *     summary: Retrieve a promotion by ID
 *     description: Get a promotion by its unique ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the promotion to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Promotion data retrieved successfully.
 *       404:
 *         description: Promotion not found.
 */
router.get("/:id", authenticate, promotionController.getPromotionById);

/**
 * @openapi
 * /api/v1/promotions:
 *   post:
 *     summary: Create a new promotion
 *     description: Add a new promotion to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               discount:
 *                 type: string
 *               start_date:
 *                 type: string
 *               end_date:
 *                 type: string
 *     responses:
 *       201:
 *         description: Promotion created successfully.
 */
router.post("/", authenticate, validateRequest(promotionSchema), promotionController.createPromotion);

/**
 * @openapi
 * /api/v1/promotions/{id}:
 *   put:
 *     summary: Update an existing promotion
 *     description: Modify the details of an existing promotion.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the promotion to update.
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
 *               discount:
 *                 type: string
 *               start_date:
 *                 type: string
 *               end_date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Promotion updated successfully.
 *       404:
 *         description: Promotion not found.
 */
router.put("/:id", authenticate, isAuthorized({ hasRole: ["admin"] }), validateRequest(promotionSchema), promotionController.updatePromotion);

/**
 * @openapi
 * /api/v1/promotions/{id}:
 *   delete:
 *     summary: Delete a promotion
 *     description: Remove a promotion from the database.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the promotion to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Promotion deleted successfully.
 *       404:
 *         description: Promotion not found.
 */
router.delete("/:id", authenticate, isAuthorized({ hasRole: ["admin"] }), validateRequest(deletePromotionSchema), promotionController.deletePromotion);

export default router;
