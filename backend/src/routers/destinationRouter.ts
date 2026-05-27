import { Router } from "express";
import {
  createDestination,
  getAllDestinations,
  getDestinationBySlug,
} from "../controllers/destinationController";
import { authenticate, requireRole } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

router.post(
  "/create",
  authenticate,
  requireRole(["ADMIN"]),
  upload.array("images", 5),
  createDestination,
);
router.get("/", getAllDestinations);
router.get("/slug/:slug", getDestinationBySlug);

export default router;
