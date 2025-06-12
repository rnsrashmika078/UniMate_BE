import express from "express";
import {
  userLogin,
  userSignUp,
  getAllUsers,
  getUser,
  storeFriendRequests,
  getFriendRequests,
  userUpdate,
  getImages,
  deleteAllFriendRequests,
  getAllRequests,
  updateRequestStatus,
  updateLastSeen,
  GetUserByToken,
} from "./controller.js";
import {
  addComment,
  getComments,
  updateComment,
  addLike,
  getAllLikes,
  deleteAllLikes,
  getLikes,
  addPost,
  getPost,
  getAllPosts,
  deletePost,
  deleteData,
} from "./postController.js";
const router = express.Router();

const secret = "pubg";

// Authentication Related Routes
router.post("/login", userLogin);
router.post("/register", userSignUp);
router.get("/allUsers", getAllUsers);
router.get("/getUser/:username", getUser);
router.get("/getUser", GetUserByToken);
router.put("/userUpdate", userUpdate);
router.get("/getImage/:username", getImages);

// Friends and Friend Requets
router.post("/storeFriendRequests", storeFriendRequests);
router.get("/getFriendRequests/:to", getFriendRequests);
router.delete("/deleteAllRequests", deleteAllFriendRequests);
router.get("/getAllRequests", getAllRequests);
router.put("/updateRequestStatus/:_id", updateRequestStatus);
router.put("/updateLastSeen/:_id", updateLastSeen);

// Likes Routes
router.post("/addLikes", addLike);
router.get("/getAllLikes", getAllLikes);
router.get("/getLikes/:postId", getLikes);
router.delete("/deleteAllLikes", deleteAllLikes);

// Posts Routes
router.post("/addPost", addPost);
router.get("/getAllPosts/:username", getAllPosts);
router.delete("/deletePosts", deleteData);
router.delete("/deletePost/:_id", deletePost);
router.get("/getPost/:username", getPost);

// Comments Routes
router.post("/addComment", addComment);
router.get("/getComments/:postId", getComments);
router.put("/updateComment/:postId/:commentId", updateComment);

export default router;
