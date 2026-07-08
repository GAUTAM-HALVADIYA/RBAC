// import mongoose, { Document, Schema } from "mongoose";

// export interface IPermission extends Document {
//     name: string;
//     key: string;
//     moduleId: mongoose.Types.ObjectId;
//     description?: string;
// }

// const permissionSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     key: {
//         type: String,
//         required: true,
//         unique: true,
//         trim: true,
//         lowercase: true,
//     },
//     moduleId: {
//         type: Schema.Types.ObjectId,
//         ref: "Module",
//         required: true,
//     },

// }, { timestamps: true });

// export default mongoose.model<IPermission>("Permission", permissionSchema);

import mongoose, { Document, Schema } from "mongoose";

export interface IPermission extends Document {
    permissions: {
        read: boolean;
        write: boolean;
    };
    moduleId: mongoose.Types.ObjectId;
    roleId: mongoose.Types.ObjectId;
}

const permissionSchema = new Schema<IPermission>(
    {
        permissions: {
            read: {
                type: Boolean,
                default: false,
            },
            write: {
                type: Boolean,
                default: false,
            },
        },
        moduleId: {
            type: Schema.Types.ObjectId,
            ref: "Module",
            required: true,
        },
        roleId: {
            type: Schema.Types.ObjectId,
            ref: "Role",
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model<IPermission>("Permission", permissionSchema);
