// in order to store a habit, we need to have user id which will come by creating a user first.

import User from "../models/User.js";

// @desc Create a new user
// @route POST /api/register-user

export const registerUser = async(req, res)=> {
    try{
        // Get user details from the request body.
        const {username, email, password} = req.body;

        // Check if all required fields are provided.
        if(!username || !email || !password){
            return res.status(400).json({
                message: "Please fill in all fields"
            });
        }
        // Check if the user already exists in the database.
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({
                message: "User already exists."
            });
        } 
        // Create the user in mongoDB.
        const user = await User.create({
            username,
            email,
            password
        });

        // send response
        res.status(201).json({ 
            _id: user.id,
            username: user.username,
            email: user.email,
            message: "User created successfully."
        }
        );
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
}

