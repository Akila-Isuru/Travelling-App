import { Router } from "express";
import {
  registerUser,
  loginUser,
  getMyDetails,
} from "../controllers/authController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", authenticate, getMyDetails);

export default router;
