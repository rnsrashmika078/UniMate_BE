import express, { request } from "express";
import cors from "cors";
import { Person } from "./models/Person.js";
import { FriendRequest } from "./models/FriendRequest.js";
import cookieParser from "cookie-parser";
import { Posts } from "./models/Posts.js";
import { PostsLikes } from "./models/PostsLikes.js";
import { PostsComments } from "./models/PostComments.js";
import { PostReply } from "./models/PostReply.js";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cookieParser());

const secret = "pubg";
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

export const addComment = async (req, res) => {
  try {
    const body = req.body;

    const newComment = new PostsComments(body);

    await newComment.save();

    return res.status(200).json({ message: "Comment Added!", newComment });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};
export const updateComment = async (req, res) => {
  try {
    const { fullname, username, profileImage, reply } = req.body;
    const { postId, commentId } = req.params;

    const comment = await PostsComments.updateOne(
      { postId, _id: commentId },
      {
        $push: {
          reply: {
            fullname,
            username,
            profileImage,
            reply,
          },
        },
      }
    );

    if (!comment || comment.length === 0) {
      return res
        .status(200)
        .json({ message: "Unable to update the comment Updated!" });
    }
    return res.status(200).json({ message: "Comment Updated!", comment });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};
export const getComments = async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await PostsComments.find({ postId });

    if (!comments) {
      return res.status(200).json({ message: "No Comments!" });
    }
    console.log(comments);

    return res.status(200).json({ message: "Comments Recieved!", comments });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};
// export const addReply = async (req, res) => {
//   try {
//     const body = req.body;

//     const newReply = new PostReply(body);

//     await newReply.save();

//     return res.status(200).json({ message: "Reply Added!", newReply });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ message: "Server Error", error: error.message });
//   }
// };
// export const getReplies = async (req, res) => {
//   try {
//     const { postId, commentId } = req.params;
//     console.log("POST ID  and comment ID  ", commentId, postId);
//     const replies = await PostReply.find({ postId, commentId });

//     if (!replies || replies.length === 0) {
//       return res.status(200).json({ message: "No Replies!", replies: [] });
//     }

//     return res.status(200).json({ message: "Replies Recieved!", replies });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ message: "Server Error", error: error.message });
//   }
// };
// res.status(400).json({ success: false, message: "Bad Request" });     // Validation or input error
// res.status(401).json({ success: false, message: "Unauthorized" });     // Not logged in or token missing
// res.status(403).json({ success: false, message: "Forbidden" });        // Logged in but no permission
// res.status(404).json({ success: false, message: "Not Found" });        // Data or route not found
// res.status(500).json({ success: false, message: "Server Error" });     // General server issue
