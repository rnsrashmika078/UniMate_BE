import mongoose from "mongoose";

const postreplySchema = new mongoose.Schema(
  {
    postId: { type: String, required: true },
    commentId: { type: String, required: true },
    fullname: { type: String, required: true },
    username: { type: String, required: true },
    profileImage: { type: String, required: false },
    reply: { type: String, required: true },
  },
  { timestamps: true }
);

export const PostReply = mongoose.model("PostReply", postreplySchema);
