import Log from "../models/Log.js";

// @desc    Log a daily habit success or failure
// @route   POST /api/logs

export const createLog = async (req, res) => {
  try {
    // get the habitId from the URL params and status and notes from the request body.
    // @UseCase: The habitId is needed to know which habit this log belongs to.
    // @UseCase The status and notes are needed to create the log entry.
    const { habitId } = req.params;
    const { status, notes } = req.body;

    // validation
    if (!status || !notes) {
      return res.status(400).json({
        message: "Input missing: Status and Notes are required.",
      });
    }
    const log = await Log.create({
      user: req.user._id, // automatically assigns the logged in users id as the creator of the habit.  This is important for security and data integrity. 2 references.
      habit: habitId, // this is the reference to the habit that this log belongs to. We get it from the URL params because of the way we set up our routes. This is important for data integrity and to ensure that logs are correctly associated with their habits.
      status,
      notes,
    });
    // send response
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc get all logs (with pagination and filtering by habit)
// @route GET /api/logs

export const getLogs = async (req, res) => {
  try {
    // Get query params from URL or set default
    // Example /api/logs?page=2&limit=5&status=completed
    const page = parseInt(req.query.page) || 1; // default to page 1
    const limit = parseInt(req.query.limit) || 10; // default to 10 logs per page
    const skip = (page - 1) * limit; // calculate how many logs to skip for pagination

    // 2. Build a dynamic query object
    // We always ensure the user only see their OWN logs
    let query = { user: req.user._id }; // Start with filtering by user

    // If the user wants to filter by status (e.g., completed, missed)
    if (req.query.status) {
      query.status = req.query.status;
    }
    // If the user wants to filter by habit
    if (req.query.habit) {
      query.habit = req.query.habit;
    }

    // 3. Execute the database calls
    // .sort({ date: -1 }) ensures the newest logs appear first!
    const logs = await Log.find(query)
      .populate("habit", "title description type isActive")
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    // 4. Count the total documents so the frontend knows how many pages exist
    const totalLogs = await Log.countDocuments(query);

    // 5. Send the response with logs and pagination info
    res.status(200).json({
      success: true,
      count: logs.length,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalLogs / limit),
        totalLogs,
      },
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc update logs
// @route PUT /api/logs/:id
export const updateLog = async (req, res) => {
  try {
    const { id } = req.params;
    // get the log by id and delte it
    const updateLog = await Log.findByIdAndUpdate(id, req.body, { new: true });
    if (!updateLog) {
      return res.status(404).json({
        message: "Log not found",
      });
    }
    res.status(200).json(updateLog);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
