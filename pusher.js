import Pusher from "pusher";
import express from "express";
export const PusherConnection = async (app) => {
  const pusher = new Pusher({
    appId: "1968186",
    key: "55cea717740ce6a4f1cc",
    secret: "9743cdf17a5b80efb9f2",
    cluster: "ap2",
    useTLS: true,
  });
  app.use(express.json());

  app.post("/pusher/auth", async (req, res) => {
    const {
      socket_id,
      channel_name,
      user_id,
      username,
      firstname,
      lastname,
      email,
      profileImage,
    } = req.body;

    console.log("USER ID", user_id);

    try {
      const auth = await pusher.authorizeChannel(socket_id, channel_name, {
        user_id,
        user_info: {
          username,
          firstname,
          lastname,
          email,
          profileImage,
        },
      });
      res.send(auth);
    } catch (err) {
      console.error("Auth error:", err);
      res.status(500).send("Authorization error");
    }
  });
};
