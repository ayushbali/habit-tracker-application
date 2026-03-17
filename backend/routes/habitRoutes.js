import express from "express";
import {
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
} from "../controllers/habitController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-habit", authMiddleware, createHabit);
router.get("/habits", authMiddleware, getHabits);
router.put("/habits/:id", authMiddleware, updateHabit);
router.delete("/habits/:id", authMiddleware, deleteHabit);

export default router;
