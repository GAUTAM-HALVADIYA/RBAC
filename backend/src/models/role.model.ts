// import mongoose, { Document, Schema } from "mongoose";

// export interface IRole extends Document {
//     name: string;
//     permissions: mongoose.Types.ObjectId[];
// }

// const roleSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         unique: true,
//         trim: true,
//     },
//     permissions: [{
//         type: Schema.Types.ObjectId,
//         ref: "Permission"
//     }],
// }, { timestamps: true });

// const roleModel = mongoose.model<IRole>("Role", roleSchema);

// export default roleModel;

import mongoose, { Document, Schema } from "mongoose";

export interface IRole extends Document {
    name: string;
}

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    }
}, { timestamps: true });

const roleModel = mongoose.model<IRole>("Role", roleSchema);

export default roleModel;
