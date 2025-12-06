// src/routes/uploadRoutes.ts
import { Router } from "express";
import multer from "multer";
import { uploadImageController } from "../controllers/uploadController.js";

const router = Router();

/**
 * Multer storage:
 * - Saves files into different folders based on req.params.type
 *   type = "user"     -> uploads/users
 *   type = "clothing" -> uploads/clothing
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { type } = req.params as { type: string };

    let folder = "uploads/others";

    if (type === "user") {
      folder = "uploads/users";
    } else if (type === "clothing") {
      folder = "uploads/clothing";
    }

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    // unique file name
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// POST /upload/:type
router.post("/upload/:type", upload.single("image"), uploadImageController);

export default router;
