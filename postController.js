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

// res.status(400).json({ success: false, message: "Bad Request" });     // Validation or input error
// res.status(401).json({ success: false, message: "Unauthorized" });     // Not logged in or token missing
// res.status(403).json({ success: false, message: "Forbidden" });        // Logged in but no permission
// res.status(404).json({ success: false, message: "Not Found" });        // Data or route not found
// res.status(500).json({ success: false, message: "Server Error" });     // General server issue

export const addPost = async (req, res) => {
  try {
    const body = req.body;
    console.log(body);
    const newPost = new Posts(body);
    await newPost.save();
    res.json({ message: "New Post Added!" });
  } catch (error) {
    res.json({
      message: "Error while adding a new post..please try again!",
      error: error.message,
    });
  }
};

export const getPost = async (req, res) => {
  try {
    const username = req.params.username;
    const posts = await Posts.find({ username });

    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found!" });
    }

    return res
      .status(200)
      .json({ message: "Posts fetched successfully", allPosts: posts });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const username = req.params.username;
    const friends = await FriendRequest.find({
      $or: [{ to: username }, { from: username }],
      status: "Accepted",
    });
    const friendUsernames = friends.map((fr) =>
      fr.from === username ? fr.to : fr.from
    );
    friendUsernames.push(username);
    const postByusers = await Posts.find({
      username: { $in: friendUsernames },
    });

    if (postByusers.length === 0) {
      return res.status(404).json({ message: "No posts found!" });
    }

    const allPosts = await Promise.all(
      postByusers.map(async (post) => {
        const comments = await PostsComments.find({ postId: post._id });

        const commentCount = comments.length;
        const replyCount = comments.reduce(
          (acc, comment) => acc + (comment.reply?.length || 0),
          0
        );
        const postObj = post.toObject();
        return {
          ...postObj,
          commentCount: commentCount + replyCount,
        };
      })
    );

    return res
      .status(200)
      .json({ message: "Posts fetched successfully", allPosts });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteData = async (req, res) => {
  try {
    const del = await Posts.deleteMany();
    if (!del) {
      return res.json({
        message: "error while try to delete the data from the posts schema",
      });
    }
    return res.json({ message: "Delete all data from Posts schema" });
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const _id = req.params._id;
    const post = await Posts.findById(_id);
    const likes = await PostsLikes.find({ productId: _id });
    const comment = await PostsComments.find({ postId: _id });

    if (!post && !likes) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.image_public_id) {
      await cloudinary.uploader.destroy(post.image_public_id);
    }
    const likeDelete = await Posts.deleteOne({ productId: _id });
    const postDelete = await Posts.deleteOne({ _id });

    if (comment) {
      const deleteComments = await PostsComments.deleteOne({ postId: _id });
    }

    if (!likeDelete && !postDelete) {
      return res.json({
        message: "error while try to delete the post from the posts schema",
      });
    }
    return res.json({ message: "Post Deleted Succesfully" });
  } catch (error) {
    console.log(error);
  }
};

// Related to the posts likes
export const addLike = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const existing = await PostsLikes.findOne({
      username: data.username,
      postId: data.postId,
    });
    if (existing) {
      await PostsLikes.deleteOne({ _id: existing._id });
      return res.status(200).json({ message: "Like removed!" });
    }
    const like = new PostsLikes(data);
    await like.save();
    return res.status(200).json({ message: "Liked Added!", like });
  } catch (error) {
    console.log(error);
  }
};
export const getAllLikes = async (req, res) => {
  try {
    const likes = await PostsLikes.find();
    if (!likes) {
      return res
        .status(404)
        .json({ message: "No Likes for that posts or post not found" });
    }
    return res.status(200).json({ message: "GET ALL LIKES TO POSTS", likes });
  } catch (error) {
    console.log(error);
  }
};
export const getLikes = async (req, res) => {
  try {
    const postId = req.params.postId;
    const likes = await PostsLikes.find({ postId });
    if (!likes) {
      return res
        .status(404)
        .json({ message: "No Likes for that posts or post not found" });
    }
    return res.status(200).json({ message: "GET ALL LIKES TO POSTS", likes });
  } catch (error) {
    console.log(error);
  }
};
export const deleteAllLikes = async (req, res) => {
  try {
    const likes = await PostsLikes.deleteMany();

    return res.status(200).json({ message: "Delete all likes" });
  } catch (error) {
    console.log(error);
  }
};
