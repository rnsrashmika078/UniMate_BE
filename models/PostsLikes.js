import mongoose from "mongoose";

const postslikesSchema = new mongoose.Schema(
  {
    postId: { type: String, required: true },
    fullname: { type: String, required: true },
    username: { type: String, required: true },
    liked: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export const PostsLikes = mongoose.model("PostsLikes", postslikesSchema);
