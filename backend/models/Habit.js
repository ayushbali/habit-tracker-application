// Habit model stores information about user habits in the database.

import mongoose from "mongoose";

// Define the schema for a Habit.
const habitSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, // Reference to the User who owns this habit (ObjectId).
    title:{
        type: String,
        required: true
    }, // Name of the habit (e.g., "Exercise", "Read a book").
    description:{
        type: String,
        default: ''
    }, // Optional details about the habit.
    type:{
        type: String,
        enum : ['good', 'bad'],
        required: true
    }, // Type of habit (e.g., "Health", "Productivity", "Hobby").
    isActive : {
        type: Boolean,
        default: true
    } // Indicates if the habit is currently active or not.

}, {timestamps: true}); // Automatically adds createdAt and updatedAt fields.

export default mongoose.model("Habit", habitSchema);