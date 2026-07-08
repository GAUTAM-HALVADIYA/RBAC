import mongoose from "mongoose";

let dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL!);
        console.log("mongo is connected");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default dbConnection;
