// imports
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { connectDB, disconnectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import habitRoutes from "./routes/habitRoutes.js";
import logRoutes from "./routes/logRoutes.js";

// Connect To the Database
connectDB();

// initialize express app
const app = express();
const PORT = process.env.PORT || 5001;

// middlewares
// This will allow future frontend to talk to this backend
app.use(cors());
// This will allow the server to read JSON data sent in request bodies
app.use(express.json());

// ----- Mount routes -----

// test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Habit Tracker API v1 is working!",
    lastTimeChecked: new Date().getTime().toString(),
  });
});

// user registeration route
app.use("/api", userRoutes);
app.use("/api", habitRoutes);
app.use("/api", logRoutes);

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// --- Graceful shutdown & error handlers ---

// 1. Unhandled Promise Rejection
// Fires when a Promise rejects and no .catch() handles it.
process.on("unhandledRejection", async (reason) => {
  console.error("Unhandled Promise Rejection:", reason);
  await disconnectDB();
  process.exit(1);
});

// 2. Uncaught Exception
// Fires when a synchronous throw is never caught. Process state is unreliable — must exit.
process.on("uncaughtException", async (error) => {
  console.error("Uncaught Exception:", error);
  await disconnectDB();
  process.exit(1);
});

// 3. SIGTERM / SIGINT (Ctrl+C or platform shutdown)
// Fires when the OS or orchestrator asks the process to stop.
process.on("SIGTERM", async () => {
  console.log("SIGTERM received — shutting down");
  await disconnectDB();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received — shutting down");
  await disconnectDB();
  process.exit(0);
});
