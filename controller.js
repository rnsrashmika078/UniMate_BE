import express, { request } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cors from "cors";
import { Person } from "./models/Person.js";
import { FriendRequest } from "./models/FriendRequest.js";
import cookieParser from "cookie-parser";
import { Posts } from "./models/Posts.js";
import { v2 as cloudinary } from "cloudinary";
import { PostsLikes } from "./models/PostsLikes.js";
import { PostsComments } from "./models/PostComments.js";

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
cloudinary.config({
  cloud_name: "dwcjokd3s",
  api_key: "384728788358625",
  api_secret: "HYxsHyNQLbVHYFKUwaTZdsdk2qg",
});
export const userLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await Person.findOne({ username }).select(
    "-confirm -createAt -updatedAt -__v"
  );
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.json({ message: "User Not Found!" });
  }
  const token = jwt.sign({ username }, secret, { expiresIn: "1d" });
  if (!user && !token) {
    return res.status(500).json({ message: "user not found" });
  }
  // if (user && token) {
  //   const {
  //     _id,
  //     username,
  //     firstname,
  //     lastname,
  //     email,
  //     profileImage,
  //     coverImage,
  //   } = user;
  //   const Person = {
  //     _id,
  //     username,
  //     firstname,
  //     lastname,
  //     email,
  //     profileImage,
  //     coverImage,
  //     token,
  //   };
  res.status(200).json({
    token,
    message: "Login Successfully",
  });
  // }
  console.log("user login route");
};
export const userSignUp = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      username,
      email,
      password,
      confirm,
      university,
      profileImage,
      coverImage,
    } = req.body;
    const existingUser = await Person.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmPassword = await bcrypt.hash(confirm, 10);
    console.log(req.body);
    const newPerson = new Person({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
      confirm: confirmPassword,
      university,
      profileImage,
      coverImage,
      // sex,
    });
    await newPerson.save();
    res.json({ message: "User Registered Succesfully!" });
  } catch (error) {
    res.json({ message: "User already Registered!", error });
  }
  console.log("user register route");
};
export const userUpdate = async (req, res) => {
  try {
    const { username, updatedata } = req.body;
    console.log(updatedata);
    const findUser = await Person.findOne({ username });
    if (!findUser) {
      return res.json({ message: "User Not Found!" });
    }
    const updatedUser = await Person.findOneAndUpdate(
      { username },
      { $set: updatedata },
      { new: true }
    );
    if (!updatedUser) {
      return res.json({ message: "User Not Updated!" });
    }
    return res.json({ message: "User Data Updated!", updatedUser });
  } catch (error) {
    res.json({ message: "Error while update the user data!", error });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await Person.find().select(
      "-password -confirm -createdAt -updatedAt -__v"
    );
    res.status(200).json({
      allUsers,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get all users!", error });
  }
  console.log("Get all users route");
};
export const getUser = async (req, res) => {
  const username = req.params.username;
  try {
    const user = await Person.findOne({ username }).select(
      "-password -confirm -createdAt -updatedAt -__v"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get all users!", error });
  }
  console.log("Get specific users route");
};
export const GetUserByToken = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, secret);
    console.log("DECORRED DATA", decoded);
    const user = await Person.findOne({ username: decoded.username }).select(
      "-password -confirm -createdAt -updatedAt -__v"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token", error });
  }
};

// related to the friend requests
export const storeFriendRequests = async (req, res) => {
  const { to, from, senderfname, recieverfname, status } = req.body;
  try {
    const existing = await FriendRequest.findOne({
      $or: [
        { from, to },
        { from: to, to: from },
      ],
    });

    if (existing) {
      return res.status(200).json({ message: "Request already exists" });
    }
    const newFriendRequest = new FriendRequest({
      to,
      from,
      senderfname,
      recieverfname,
      status,
    });
    await newFriendRequest.save();
    res.json({ message: "Added New Request" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get the friend requests at the movement",
      error,
    });
  }
};
// Update the status of the request
export const updateRequestStatus = async (req, res) => {
  const _id = req.params._id;
  const { status } = req.body;

  console.log(status);
  try {
    const updated = await FriendRequest.findByIdAndUpdate(
      _id,
      { status },
      { new: true }
    );

    return res.json({ message: "Request Updated!", updated });
  } catch (err) {
    return res.status(500).json({ error: "Update failed" });
  }
};
export const updateLastSeen = async (req, res) => {
  const _id = req.params._id;
  const { lastseen } = req.body;

  try {
    const updated = await FriendRequest.findByIdAndUpdate(
      _id,
      { lastseen },
      { new: true, select: "lastseen" } // This line doesn't work with findByIdAndUpdate directly
    );

    return res.json({
      message: "Last Seen Updated!",
      updated: updated.lastseen,
    });
  } catch (err) {
    return res.status(500).json({ error: "Update failed" });
  }
};

export const getFriendRequests = async (req, res) => {
  const to = req.params.to;

  try {
    const requests = await FriendRequest.find({
      $or: [{ from: to }, { to: to }],
    });
    res.status(200).json({
      requests,
    });
  } catch (error) {
    res.status(500).json({
      message: "Cannot Get Requests at the movement!",
      error,
    });
  }
};
export const getAllRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.find();
    return res.status(200).json({
      requests,
      message: "Succesfully get the all the requests!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Cannot Get All the Requests at the movement!",
      error,
    });
  }
};
export const deleteAllFriendRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.deleteMany();
    return res.json({
      message: "All FriendRequests are deleted succesfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: "cannot delete all friend requests at the movement!",
      error,
    });
  }
};

// Realted to get Images ( profiles Display Picture )
export const getImages = async (req, res) => {
  try {
    const username = req.params.username;
    const findImages = await Person.findOne(
      { username },
      { profileImage: 1, _id: 0 }
    );
    const imageURL = findImages?.profileImage;

    if (!imageURL) {
      return res.status(404).json({ message: "Image Not Found!" });
    }
    return res
      .status(200)
      .json({ message: "Image Recieved Succesfully!", image: imageURL });
  } catch (error) {
    console.log(error);
  }
};

// Related to Posts
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
// export const getAllPosts = async (req, res) => {
//   const friends = await FriendRequest.find({ from: "rnsrashmika078" });
//   const fromUsernames = friends.map((f) => f.to);
//   console.log("GET ALL FRIEND", friends);
//   try {
//     const allPosts = await Posts.find({
//       // username: { $in: [fromUsernames] },
//       username: fromUsernames,
//     });
//     if (allPosts.length === 0) {
//       return res.status(404).json({ message: "No posts found!" });
//     }
//     return res
//       .status(200)
//       .json({ message: "Posts fetched successfully", allPosts });
//   } catch (error) {
//     console.error("Server error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
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
    const allPosts = await Posts.find({ username: { $in: friendUsernames } });

    if (allPosts.length === 0) {
      return res.status(404).json({ message: "No posts found!" });
    }

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
