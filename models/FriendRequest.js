import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
    {
        to: { type: String, required: true },
        from: { type: String, required: true },
        fullname: { type: String, required: true },
        // messageType: { type: String, required: true },

    },
    { timestamps: true }
);

export const FriendRequest = mongoose.model(
    "FriendRequest",
    friendRequestSchema
);
