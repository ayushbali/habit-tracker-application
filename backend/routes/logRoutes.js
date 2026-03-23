import express from "express";
import { createLog, getLogs, updateLog } from "../controllers/logController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

// mergeParams: true allows the router to access the params defined in the parent router (habitRoutes.js) which includes the habitId.
// This is necessary because the log routes are nested under the habit routes and we need to know which habit the logs belong to..
const router = express.Router({ mergeParams: true });

router.post("/logs", authMiddleware, createLog);
router.get("/logs", authMiddleware, getLogs);
router.put("/logs/:id", authMiddleware, updateLog);
export default router;
