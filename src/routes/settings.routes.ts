import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { auth } from "../middlewares/auth.js";
import { updateSettingsSchema } from "../schemas/settings.schema.js";
import * as SettingsController from "../controllers/settings.controller.js";

const router = Router();

// All settings routes are protected - require authentication

/**
 * GET /api/settings
 * Get user settings
 */
router.get("/settings", auth, SettingsController.getSettings);

/**
 * PUT /api/settings
 * Update user settings
 */
router.put(
  "/settings",
  auth,
  validate({ body: updateSettingsSchema }),
  SettingsController.updateSettings
);

export default router;
