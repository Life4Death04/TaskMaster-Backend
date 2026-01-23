import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { auth } from "../middlewares/auth.js";
import { createListSchema, updateListSchema } from "../schemas/list.schema.js";
import { idParamsSchema } from "../schemas/common.js";
import * as ListController from "../controllers/list.controller.js";

const router = Router();

// All list routes are protected - require authentication

/**
 * POST /api/lists
 * Create a new list
 */
router.post(
  "/lists",
  auth,
  validate({ body: createListSchema }),
  ListController.createList,
);

/**
 * GET /api/lists
 * Get all lists for authenticated user
 */
router.get("/lists", auth, ListController.getLists);

/**
 * GET /api/lists/:id
 * Get a single list by ID with tasks
 */
router.get(
  "/lists/:id",
  auth,
  validate({ params: idParamsSchema }),
  ListController.getListById,
);

/**
 * PUT /api/lists/:id
 * Update a list
 */
router.put(
  "/lists/:id",
  auth,
  validate({ params: idParamsSchema, body: updateListSchema }),
  ListController.updateList,
);

/**
 * DELETE /api/lists/:id
 * Delete a list and all its tasks
 */
router.delete(
  "/lists/:id",
  auth,
  validate({ params: idParamsSchema }),
  ListController.deleteList,
);

/**
 * PATCH /api/lists/:id/favorite
 * Toggle favorite status of a list
 */
router.patch(
  "/lists/:id/favorite",
  auth,
  validate({ params: idParamsSchema }),
  ListController.toggleListFavorite,
);

export default router;
