import express from "express";

import {
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser,
} from "../controllers/userController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", getAllUsers);
router.delete("/delete-user/:id", authMiddleware, deleteUser); // This route will be used by admin to delete a user. It is not exposed to frontend yet, but it is here for future use.

export default router;
