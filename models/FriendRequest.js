import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
  {
    to: { type: String, required: true },
    from: { type: String, required: true },
    status: { type: String, required: true },
    senderfname: { type: String, required: true },
    recieverfname: { type: String, required: true },
    lastseen: { type: String, required: false },
  },
  { timestamps: true }
);

export const FriendRequest = mongoose.model(
  "FriendRequest",
  friendRequestSchema
);
