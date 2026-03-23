import express from "express";
import {
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
  getHabitStats,
} from "../controllers/habitController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import logRoutes from "./logRoutes.js";

const router = express.Router();

// Mount log routes under the habit routes. This means that any request to /habits/:habitId/logs will be handled by the logRoutes router. The habitId parameter will be available in the logRoutes router because of the mergeParams: true option we set when creating the logRoutes router.
router.use("/habits/:habitId", logRoutes);

router.post("/create-habit", authMiddleware, createHabit);
router.get("/habits", authMiddleware, getHabits);

router.get("/habits/:id/stats", authMiddleware, getHabitStats);
router.put("/habits/:id", authMiddleware, updateHabit);
router.delete("/habits/:id", authMiddleware, deleteHabit);

export default router;
