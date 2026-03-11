import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
configDotenv();

// connectDB function for mongoDB 
const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } 
    catch(error){
        console.error('Database connection error:', error.stack);
        process.exit(1); // Exit the process with failure
    }
}


// disconnectDB function — gracefully closes the MongoDB connection
const disconnectDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB disconnected gracefully');
    } catch (error) {
        console.error('Error during MongoDB disconnection:', error.stack);
        process.exit(1);
    }
};

export { connectDB, disconnectDB };