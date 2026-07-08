import { Schema, model } from "mongoose";

const auditLogSchema = new Schema({
    action: {
        type: String,
        required: true,
        index: true,
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
        index: true,
    },

    timestamp: {
        type: Date,
        default: Date.now,
        index: true,
    },

    ipAddress: {
        type: String,
        default: null,
    },

    status: {
        type: String,
        enum: ["success", "failure"],
        required: true,
        index: true,
    },

    metadata: {
        type: Schema.Types.Mixed,
        default: {},
    },
});

const auditLogModel = model("AuditLog", auditLogSchema);

export default auditLogModel;
