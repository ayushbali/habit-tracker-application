import mongoose from "mongoose";
import Habit from "../models/Habit.js";
import Log from "../models/Log.js";

// @desc create a new Habit
// @route POST /api/create-habit

export const createHabit = async (req, res) => {
  try {
    // get data from the request body when submitting a post request when creating a habit
    const { title, description, type, isActive } = req.body;

    // validation
    if (!title || !type || !description) {
      return res.status(400).json({
        message: "Please fill in all fields",
      });
    }

    // once data is validated, we can create a habit in the database using the Habit model.
    // The .create() method is a convenient way to create and save a new document in one step.
    // It takes an object as an argument, where the keys correspond to the fields defined in the Habit schema.
    // In this case, we are creating a new habit with the user field set to the ID of the currently logged-in user (req.user._id), and the title, description, type, and isActive fields set to the values provided in the request body.

    const habit = await Habit.create({
      // The user field is automatically assigned the ID of the currently logged-in user, which is available in req.user._id thanks to the authMiddleware. This ensures that each habit is associated with the user who created it.
      user: req.user._id,
      title,
      description,
      type,
      isActive,
    });
    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Get all habits
// @route   GET /api/habits

export const getHabits = async (req, res) => {
  try {
    // This tells MongoDB to find ALL habits in the database
    // The .populate('user', 'username') part automatically pulls in the user's name!
    const habits = await Habit.find({ user: req.user._id }).populate(
      "user",
      "username",
    );
    res.status(200).json(habits);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc update habit
// @route PUT /api/habits/:id

export const updateHabit = async (req, res) => {
  try {
    const { id } = req.params;
    // findByIdAndUpdate()
    const updateHabit = await Habit.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updateHabit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }
    res.status(200).json(updateHabit);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// @desc delete a habit
// @route DELETE /api/habits/:id

export const deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteHabit = await Habit.findByIdAndDelete(id);
    if (!deleteHabit) {
      return res.status(404).json({ message: "Habit not found" });
    }
    res.status(200).json(`Habit = ${deleteHabit.title} has been deleted.`);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Get stats and streaks for a specific habit
// @route   GET /api/habits/:id/stats

export const getHabitStats = async (req, res) => {
  try {
    const { id } = req.params; // Get the habit ID from the request parameters

    // 1. MongoDB aggregation: DB does the heavy lifting
    const statusCounts = await Log.aggregate([
      // Stage 1: Filter logs for ONLY this specific habit
      { $match: { habit: new mongoose.Types.ObjectId(id) } },
      // Stage 2: Group them by their status and sum them up.
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // format aggregation results into a clean object
    let stats = { completed: 0, missed: 0 };
    statusCounts.forEach((status) => {
      status[status._id] = status.total;
    });

    // 2. Streak calculation: We calculate the current streak by fetching the most recent log for this habit and checking if it was completed yesterday. If it was, we continue counting backwards until we find a log that wasn't completed or we run out of logs.
    // fetch only completed logs, sorted newest to oldest
    const completedLogs = await Log.find({
      habit: id,
      status: "completed",
    })
      .sort({ date: -1 })
      .select("date");

    let currentStreak = 0;
    let currentDate = new Date();

    currentDate.setHours(0, 0, 0, 0); // Normalize today's date to exactly midnight

    for (let i = 0; i < completedLogs.length; i++) {
      const logDate = new Date(completedLogs[i].date);
      logDate.setHours(0, 0, 0, 0); // Normalize log date to exactly midnight

      // Calculate the difference in days
      const diffTime = Math.abs(currentDate - logDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // If the log was today (diff 0) or yesterday (diff 1), the streak continues!
      if (diffDays === 0 || diffDays === 1) {
        currentStreak++;
        currentDate = logDate; // Move our pointer back one day
      } else {
        break; // A gap of more than 1 day means the streak is broken
      }
    }
    res.status(200).json({
      success: true,
      totalCompleted: stats.completed,
      totalFailed: stats.failed,
      currentStreak,
    });

    // end try block
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
