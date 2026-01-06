import type { Request, Response, NextFunction } from "express";
import * as SettingsService from "../services/settings.service.js";
import type { UpdateSettingsInput } from "../schemas/settings.schema.js";

// Controller: handles HTTP layer for settings, delegates business logic to service

/**
 * Get user settings
 * GET /api/settings
 */
export async function getSettings(
  req: Request,
  res: Response,
  next: NextFunction
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

    const settings = await SettingsService.getUserSettings(userId);

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Update user settings
 * PUT /api/settings
 */
export async function updateSettings(
  req: Request<{}, {}, UpdateSettingsInput>,
  res: Response,
  next: NextFunction
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

    const settingsData = { ...req.body, userId };

    const settings = await SettingsService.updateUserSettings(settingsData);

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      settings,
    });
  } catch (err) {
    next(err);
  }
}
