import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
    {
        To: { type: String, required: true },
        From: { type: String, required: true },
    },
    { timestamps: true }
);

export const FriendRequest = mongoose.model(
    "FriendRequest",
    friendRequestSchema
);
