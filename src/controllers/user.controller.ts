// Importing required modules
import type { Request, Response, NextFunction } from "express";
// Importing the user service module; use the UserService namespace to call functions
import * as UserService from "../services/user.service.js";
// Importing types inferred from validation schemas
import type {
  RegisterInput,
  LoginInput,
  UpdateUserInput,
} from "../schemas/user.schema.js";

// Controller: handles HTTP layer, delegates business logic to service
// Includes inline documentation to guide learning and future endpoints implementation

export async function register(
  /**
   * About `Request<{}, {}, RegisterInput>`:
   * - Express signature is `Request<Params, ResBody, ReqBody, ReqQuery, Locals>`.
   * - We only need to type the body (3rd generic). We pass `{}` placeholders for `Params` and `ResBody`,
   *   and `RegisterInput` (Zod-inferred type) as `ReqBody`.
   * - We cannot pass the Zod schema itself because generics need TypeScript types, not runtime values;
   *   that’s why we use `z.infer<typeof registerSchema>` exported as `RegisterInput`.
   * - Even though `validate({ body: registerSchema })` checks at runtime, TypeScript does not carry
   *   that type information across middlewares, so we annotate the handler explicitly.
   */
  req: Request<{}, {}, RegisterInput>,
  res: Response,
  next: NextFunction
) {
  // Body was validated by Zod in the route via validate({ body: registerSchema })
  const { email, password, firstName, lastName, profileImage } = req.body; // Destructuring the validated body
  try {
    // Check if user already exists
    const existing = await UserService.findUserByEmail(email); // Llamada al servicio para buscar usuario por email
    if (existing) {
      res.status(409).json({ message: "Email already registered" });
      return;
    }

    // Create user (hash password inside service)
    const user = await UserService.createUser({
      email,
      password,
      firstName,
      lastName,
      profileImage,
    });

    // Issue JWT for immediate login after registration
    const token = UserService.signToken({ sub: user.id, email: user.email });

    // Return safe user (no password) and token
    res.status(201).json({ user: UserService.toSafeUser(user), token });
  } catch (err) {
    // Why use next(err) here instead of res.status(500).json(...)?
    // - Centralizes unexpected errors in the global error handler (see src/server.ts),
    //   avoiding duplicate response logic in controllers.
    // - Keeps the controller focused on expected domain errors (401/409, etc.).
    // - Follows the Express contract: errors propagate with next(err) to the 4-arg middleware.
    next(err);
  }
}

export async function login(
  req: Request<{}, {}, LoginInput>,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;
  try {
    const user = await UserService.findUserByEmail(email);
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const valid = await UserService.verifyPassword(password, user.password!);
    if (!valid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = UserService.signToken({ sub: user.id, email: user.email });
    res.status(200).json({ user: UserService.toSafeUser(user), token });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const userIdRaw = req.user?.sub ?? req.user?.id;
    const userId =
      typeof userIdRaw === "string" ? Number(userIdRaw) : userIdRaw;
    if (!userId || Number.isNaN(userId)) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const user = await UserService.getUserById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ user: UserService.toSafeUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function updateMe(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Body validated by Zod: updateUserSchema ensures at least one field
  const userIdRaw = req.user?.sub ?? req.user?.id;
  const userId = typeof userIdRaw === "string" ? Number(userIdRaw) : userIdRaw;
  if (!userId || Number.isNaN(userId)) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const { firstName, lastName, email, profileImage, phoneNumber } =
    req.body as UpdateUserInput;
  try {
    // If email is changing, ensure uniqueness
    if (email) {
      const existing = await UserService.findUserByEmail(email);
      if (existing && existing.id !== userId) {
        res.status(409).json({ message: "Email already in use" });
        return;
      }
    }

    const updated = await UserService.updateUserById(userId, {
      firstName,
      lastName,
      email,
      profileImage,
      phoneNumber,
    });
    res.status(200).json({ user: UserService.toSafeUser(updated) });
  } catch (err) {
    next(err);
  }
}

export async function deleteMe(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userIdRaw = req.user?.sub ?? req.user?.id;
  const userId = typeof userIdRaw === "string" ? Number(userIdRaw) : userIdRaw;
  if (!userId || Number.isNaN(userId)) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    await UserService.deleteUserById(userId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
