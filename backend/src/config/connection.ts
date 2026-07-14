import mongoose from "mongoose";
import dns from "dns";

let dbConnection = async () => {
    try {
        // Fix for "querySrv ECONNREFUSED" on Windows/Node with MongoDB Atlas
        dns.setServers(['8.8.8.8', '8.8.4.4']);
        await mongoose.connect(process.env.MONGO_URL!);
        console.log("mongo is connected");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default dbConnection;
