import express from "express";
import {
  userLogin,
  userSignUp,
  getAllUsers,
  getUser,
  storeFriendRequests,
  getFriendRequests,
  addPost,
  getPost,
  getAllPosts,
  deleteData,
  userUpdate,
  getImages,
  deletePost,
} from "./controller.js";
const router = express.Router();

const secret = "pubg";
router.post("/login", userLogin);
router.post("/register", userSignUp);
router.get("/allUsers", getAllUsers);
router.get("/getUser/:username", getUser);
router.post("/addPost", addPost);
router.get("/getAllPosts", getAllPosts);
router.delete("/deletePosts", deleteData);
router.delete("/deletePost/:_id", deletePost);
router.put("/userUpdate", userUpdate);
router.get("/getImage/:username", getImages);
router.get("/getPost/:username", getPost);
router.post("/storeFriendRequests", storeFriendRequests);
router.get("/getFriendRequests/:To", getFriendRequests);

export default router;
