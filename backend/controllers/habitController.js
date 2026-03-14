import Habit from '../models/Habit.js';

// @desc create a new Habit
// @route POST /api/create-habit

export const createHabit = async(req, res)=>{
    try{
        // get data from the request body when submitting a post request when creating a habit
        const { user, title, description, type, isActive } = req.body;

        // validation
        if(!user || !title || !type || !description){
            return res.status(400).json({
                message: "Please fill in all fields"
            });
        }

        const habit = await Habit.create({
            user,
            title,
            description,
            type,
            isActive
        });
        res.status(201).json(habit);

    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
}

// @desc    Get all habits
// @route   GET /api/habits

export const getHabits = async (req, res)=>{
    try{
        // This tells MongoDB to find ALL habits in the database
        // The .populate('user', 'username') part automatically pulls in the user's name!
        const habits = await Habit.find().populate('user', 'username email');
        res.status(200).json(habits);
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};


// @desc update habit
// @route PUT /api/habits/:id

export const updateHabit = async(req, res)=>{
    try {
        const {id} = req.params;
        // findByIdAndUpdate() 
        const updateHabit = await Habit.findByIdAndUpdate(id, req.body,{new: true});

        if(!updateHabit){
            return res.status(404).json({
                message: "Habit not found"
            });
        }
        res.status(200).json(updateHabit);
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
}
// @desc delete a habit
// @route DELETE /api/habits/:id

export const deleteHabit = async(req, res)=>{
    try{
        const {id} = req.params;
        const deleteHabit = await Habit.findByIdAndDelete(id);
        if(!deleteHabit){
            return res.status(404).json({message:"Habit not found"})
        }
        res.status(200).json(`Habit = ${deleteHabit.title} has been deleted.`);

    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
}