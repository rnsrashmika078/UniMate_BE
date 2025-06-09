import express, { Router } from "express";
import router from "../route.js";
import { connectDb } from "./config/db.js";
import cors from 'cors'

const app = express();
const PORT = 3000;
app.use(
    cors({
        origin: "*",
    })
);
app.use(express.json());
await connectDb();
app.get("/", (req, res) => {
    res.send("This is home page");
});
app.use("/api", router);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
