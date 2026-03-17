// in order to store a habit, we need to have user id which will come by creating a user first.

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate Token.
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
    algorithm: "HS256",
  });
};

// @desc Create a new user
// @route POST /api/register-user

export const registerUser = async (req, res) => {
  try {
    // Get user details from the request body.
    const { username, email, password } = req.body;

    // Check if all required fields are provided

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please fill in all fields",
      });
    }
    // Check if the user already exists in the database.
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists.",
      });
    }
    // Hash the password.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user in mongoDB.
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // send response
    res.status(201).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      message: "User created successfully.",
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc Login a user
// @route POST /api/login-user
export const loginUser = async (req, res) => {
  try {
    // get email and password from request body
    const { email, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({
        message: "Invalid email or password",
      });
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        message: "User logged in successfully.",
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc Delete a user
// @route DELETE /api/delete-user/:id
// This route will be used by admin to delete a user. It is not exposed to frontend yet, but it is here for future use.
export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    // Check if the user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Delete the user
    await User.findByIdAndDelete(id);
    res.status(200).json({
      message: "User deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc Get all users
// @route GET /api/users
// This route is just for the developer to see all the users in the database. It is not exposed to frontend yet, and it is no use for future.
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).json({
        message: "No users found.",
      });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
