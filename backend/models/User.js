// this model stores user and account information in the database

// imports
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
}, {timestamps: true}); // Automatically adds createdAt and updatedAt fields

export default mongoose.model("User", userSchema);
