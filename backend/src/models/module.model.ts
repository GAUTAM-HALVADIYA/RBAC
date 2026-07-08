import mongoose, { Document } from "mongoose";

export interface IModule extends Document {
    name: string;
    key: string;
    description?: string;
    isActive: boolean;
}

const moduleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    key: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

export default mongoose.model<IModule>("Module", moduleSchema);
