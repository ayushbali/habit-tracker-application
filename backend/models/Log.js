// This schema records daily success of failure of a habit. It is used to track the progress of a habit over time.

import mongoose from 'mongoose';

// define the schema for a log entry.
const logSchema = new mongoose.Schema({
    habit:{
        type: mongoose.Schema.Types.ObjectId, // Reference to the Habit being logged (ObjectId).
        ref: 'Habit',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }, // The date of the log entry (defaults to current date).
    status: {
        type: String,
        enum: ['completed', 'missed'],
        required: true
    },
    notes: {
        type: String, // Optional field in case you want to journal why you failed or succeeded on a particular day.
        default: ''
    }
}, {timestamps: true}); 

export default mongoose.model('Log', logSchema);