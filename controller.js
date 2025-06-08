import express, { request } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cors from "cors";
import { Person } from "./models/Person.js";
import { FriendRequest } from "./models/FriendRequest.js";
import cookieParser from "cookie-parser";
import { Posts } from "./models/Posts.js";
import { v2 as cloudinary } from "cloudinary";

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
  if (user && token) {
    const {
      _id,
      username,
      firstname,
      lastname,
      email,
      profileImage,
      coverImage,
    } = user;
    const Person = {
      _id,
      username,
      firstname,
      lastname,
      email,
      profileImage,
      coverImage,
      token,
    };
    res.status(200).json({
      Person,
      message: "Login Successfully",
    });
  }
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
  console.log(username);
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

export const storeFriendRequests = async (req, res) => {
  const { to, from, fullname } = req.body;
  try {
    const newFriendRequest = new FriendRequest({
      to,
      from,
      fullname,
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

export const getFriendRequests = async (req, res) => {
  const To = req.params.To;
  console.log(To);
  try {
    const requests = await FriendRequest.find({ To });
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
    const allPosts = await Posts.find();
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
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.image_public_id) {
      await cloudinary.uploader.destroy(post.image_public_id);
    }
    const del = await Posts.deleteOne({ _id });

    if (!del) {
      return res.json({
        message: "error while try to delete the post from the posts schema",
      });
    }
    return res.json({ message: "Post Deleted Succesfully", del });
  } catch (error) {
    console.log(error);
  }
};
