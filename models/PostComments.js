import mongoose from "mongoose";

const postscommentsSchema = new mongoose.Schema(
  {
    postId: { type: String, required: true },
    fullname: { type: String, required: true },
    profileImage: { type: String, required: false },
    comment: { type: Boolean, required: true },
    reply: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "PostComments",
          required: true,
        },
        fullname: { type: String, required: true },
        profileImage: { type: String, required: false },
        reply: { type: Boolean, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const PostsComments = mongoose.model(
  "Postscomments",
  postscommentsSchema
);
