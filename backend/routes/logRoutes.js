import express from "express";
import { createLog, getLogs, updateLog } from "../controllers/logController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/logs", authMiddleware, createLog);
router.get("/logs", authMiddleware, getLogs);
router.put("/logs/:id", authMiddleware, updateLog);
export default router;
