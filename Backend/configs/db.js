import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1); // Stop the server if DB fails to connect
    }
};

export default connectDB;
