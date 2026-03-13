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