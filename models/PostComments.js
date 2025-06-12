import mongoose from "mongoose";

const postscommentsSchema = new mongoose.Schema(
  {
    postId: { type: String, required: true },
    fullname: { type: String, required: true },
    username: { type: String, required: true },
    profileImage: { type: String, required: false },
    comment: { type: String, required: true },
    reply:[{
      fullname: { type: String, required: true },
      username: { type: String, required: true },
      profileImage: { type: String, required: false },
      reply: { type: String, required: true },
    }]
  },
  { timestamps: true }
);

export const PostsComments = mongoose.model(
  "Postscomments",
  postscommentsSchema
);
