import Log from "../models/Log.js";

// @desc    Log a daily habit success or failure
// @route   POST /api/logs

export const createLog = async (req, res) => {
    try{
        const { habit, status, notes } = req.body;

        // validation
        if(!habit || !status || !notes){
            return res.status(400).json({
                message: "Please fill in all fields"
            }); 
        }
        const log = await Log.create({
            habit,
            status,
            notes
        });
        // send response
        res.status(201).json(log);
    
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
} 

// @desc get logs
// @route GET /api/logs

export const getLogs = async(req, res)=>{
    try{
        const logs = await Log.find().populate('habit', 'title description type isActive');

        res.status(200).json(logs);
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
}

// @desc update logs
// @route PUT /api/logs/:id
export const updateLog = async (req, res)=>{
    try{
        const {id} = req.params;
        // get the log by id and delte it
        const updateLog = await Log.findByIdAndUpdate(id, req.body, {new: true});
        if(!updateLog){
            return res.status(404).json({
                message: "Log not found"
            });
        }
        res.status(200).json(updateLog);
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
}