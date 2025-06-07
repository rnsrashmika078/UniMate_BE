import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cors from "cors";
import { connectDb } from "./config/dbMongo.js";
import router from "./route.js";
import cookieParser from "cookie-parser";
import WebSK from "./Serverfile.js";
import http from "http";

const app = express();
const PORT = 5000;

app.use(express.json());
const server = http.createServer(app);
WebSK(server);

const secret = "pubg";
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
await connectDb();

app.use("/api/auth", router);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
