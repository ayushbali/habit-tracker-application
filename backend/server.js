// imports
import express from 'express';
import cors from 'cors';
import { connectDB, disconnectDB } from './config/db.js';

// initialize express app
const app = express();
connectDB(); // Connect to the database
const PORT = 5001;

// middlewares
// This will allow future frontend to talk to this backend
app.use(cors()); 
// This will allow the server to read JSON data sent in request bodies
app.use(express.json());

// Mount routes
app.get('/', (req, res) => {
    res.json({ success: true, message: "API v1 is working!" });
});

// start the server
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
});

// --- Graceful shutdown & error handlers ---

// 1. Unhandled Promise Rejection
// Fires when a Promise rejects and no .catch() handles it.
process.on('unhandledRejection', async (reason) => {
    console.error('Unhandled Promise Rejection:', reason);
    await disconnectDB();
    process.exit(1);
});

// 2. Uncaught Exception
// Fires when a synchronous throw is never caught. Process state is unreliable — must exit.
process.on('uncaughtException', async (error) => {
    console.error('Uncaught Exception:', error);
    await disconnectDB();
    process.exit(1);
});

// 3. SIGTERM / SIGINT (Ctrl+C or platform shutdown)
// Fires when the OS or orchestrator asks the process to stop.
process.on('SIGTERM', async () => {
    console.log('SIGTERM received — shutting down');
    await disconnectDB();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received — shutting down');
    await disconnectDB();
    process.exit(0);
});