// src/controllers/uploadController.ts
import { Request, Response, NextFunction } from "express";

/**
 * Controller for POST /api/upload/:type
 * Multer already processed the file before this function.
 */
export const uploadImageController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type } = req.params;

    // check type
    if (type !== "user" && type !== "clothing") {
      return res.status(400).json({
        error: 'Invalid type. Allowed: "user" or "clothing"',
      });
    }

    // multer adds file in req.file
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // file name on backend
    const filename = req.file.filename;

    // public URL (Express will serve /uploads as static)
    const imageUrl = `/uploads/${
      type === "user" ? "users" : "clothing"
    }/${filename}`;

    return res.status(201).json({
      message: "Image uploaded successfully",
      type,
      imageUrl,
    });
  } catch (error) {
    return next(error);
  }
};
