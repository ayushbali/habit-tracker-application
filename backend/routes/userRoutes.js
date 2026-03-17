import express from "express";

import {
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register-user", registerUser);
router.post("/login-user", loginUser);
router.get("/users", getAllUsers);
router.delete("/delete-user/:id", deleteUser); // This route will be used by admin to delete a user. It is not exposed to frontend yet, but it is here for future use.

export default router;
