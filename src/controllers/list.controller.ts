import type { Request, Response, NextFunction } from "express";
import * as ListService from "../services/list.service.js";
import type {
  CreateListInput,
  UpdateListInput,
} from "../schemas/list.schema.js";

// Controller: handles HTTP layer for lists, delegates business logic to service

/**
 * Create a new list
 * POST /api/lists
 */
export async function createList(
  req: Request<{}, {}, CreateListInput>,
  res: Response,
  next: NextFunction,
) {
  try {
    // Get userId from authenticated request
    const userIdRaw = req.user?.sub ?? req.user?.id;
    const userId =
      typeof userIdRaw === "string" ? Number(userIdRaw) : userIdRaw;

    if (!userId || Number.isNaN(userId)) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Ensure authorId matches authenticated user
    const listData = { ...req.body, authorId: userId };

    const list = await ListService.createList(listData);

    res.status(201).json({
      success: true,
      message: "List created successfully",
      list,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get all lists for authenticated user
 * GET /api/lists
 */
export async function getLists(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // Get userId from authenticated request
    const userIdRaw = req.user?.sub ?? req.user?.id;
    const userId =
      typeof userIdRaw === "string" ? Number(userIdRaw) : userIdRaw;

    if (!userId || Number.isNaN(userId)) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const lists = await ListService.getListsByUserId(userId);

    res.status(200).json({
      success: true,
      message: "Lists retrieved successfully",
      lists,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get a single list by ID with tasks
 * GET /api/lists/:id
 */
export async function getListById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    // Get userId from authenticated request
    const userIdRaw = req.user?.sub ?? req.user?.id;
    const userId =
      typeof userIdRaw === "string" ? Number(userIdRaw) : userIdRaw;

    if (!userId || Number.isNaN(userId)) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const listId = Number(req.params.id);
    if (Number.isNaN(listId)) {
      res.status(400).json({ message: "Invalid list ID" });
      return;
    }

    const list = await ListService.getSingleListById(listId, userId);

    res.status(200).json({
      success: true,
      message: "List retrieved successfully",
      list,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Update a list
 * PUT /api/lists/:id
 */
export async function updateList(
  req: Request<{ id: string }, {}, UpdateListInput>,
  res: Response,
  next: NextFunction,
) {
  try {
    // Get userId from authenticated request
    const userIdRaw = req.user?.sub ?? req.user?.id;
    const userId =
      typeof userIdRaw === "string" ? Number(userIdRaw) : userIdRaw;

    if (!userId || Number.isNaN(userId)) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const listId = Number(req.params.id);
    if (Number.isNaN(listId)) {
      res.status(400).json({ message: "Invalid list ID" });
      return;
    }

    const listData = { ...req.body, id: listId, userId };

    const list = await ListService.updateListById(listData);

    res.status(200).json({
      success: true,
      message: "List updated successfully",
      list,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Delete a list
 * DELETE /api/lists/:id
 */
export async function deleteList(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    // Get userId from authenticated request
    const userIdRaw = req.user?.sub ?? req.user?.id;
    const userId =
      typeof userIdRaw === "string" ? Number(userIdRaw) : userIdRaw;

    if (!userId || Number.isNaN(userId)) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const listId = Number(req.params.id);
    if (Number.isNaN(listId)) {
      res.status(400).json({ message: "Invalid list ID" });
      return;
    }

    await ListService.deleteListById(listId, userId);

    res.status(200).json({
      success: true,
      message: "List deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Toggle favorite status of a list
 * PATCH /api/lists/:id/favorite
 */
export async function toggleListFavorite(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    // Get userId from authenticated request
    const userIdRaw = req.user?.sub ?? req.user?.id;
    const userId =
      typeof userIdRaw === "string" ? Number(userIdRaw) : userIdRaw;

    if (!userId || Number.isNaN(userId)) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const listId = Number(req.params.id);
    if (Number.isNaN(listId)) {
      res.status(400).json({ message: "Invalid list ID" });
      return;
    }

    const list = await ListService.toggleListFavorite(listId, userId);

    res.status(200).json({
      success: true,
      message: "List favorite status toggled successfully",
      list,
    });
  } catch (err) {
    next(err);
  }
}
