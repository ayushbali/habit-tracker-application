import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
configDotenv();

// connectDB function for mongoDB 
const connectDB = async()=>{
    try {
        // for mongoose v5 and earlier
        // const conn = await mongoose.connect(process.env.uri, {
        //     useNewUrlParser: true,
        //     useCreateIndex: true,
        //     useFindAndModify: false
        // });
        // for mongoose v6 and later
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