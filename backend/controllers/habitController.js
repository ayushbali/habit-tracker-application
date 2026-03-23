import Habit from "../models/Habit.js";

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
