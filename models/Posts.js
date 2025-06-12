import mongoose from "mongoose";

const postsSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    image_public_id: { type: String, required: false },
    lastname: { type: String, required: true },
    email: { type: String, required: false },
    content: { type: String, required: true },
    image: { type: String, required: false },
    time: { type: String, required: false },
    username: { type: String, required: true },
    commentCount: { type: Number, required: false },
  },
  { timestamps: true }
);
export const Posts = mongoose.model("Posts", postsSchema);
