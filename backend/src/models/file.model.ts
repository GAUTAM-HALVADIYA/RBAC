import { Schema, model } from "mongoose";

const fileSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
        },
        format: {
            type: String,
        },
        bytes: {
            type: Number,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const fileModel = model("File", fileSchema);

export default fileModel;
