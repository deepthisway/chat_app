import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        // console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log("Db connected");
        
    } catch (error) {
        console.log("Error connecting to the database:", error);
    }
}
