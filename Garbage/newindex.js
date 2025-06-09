import cookieParser from "cookie-parser";
import express from "express";
import session from "express-session";
// import { connectDb } from "./config/db";

const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(
    session({
        secret: "sample-secret",
        resave: false,
        saveUninitialized: false,
    })
);
app.get("/visit", (req, res) => {
    if (req.session.page_views) {
        req.session.page_views++;
        res.send(`You have visited this page ${req.session.page_views} times`);
    } else {
        req.session.page_views = 1;
        res.send(`You have visited this page for the first times`);
    }
});

app.get("/remove-session", (req, res) => {
    req.session.destroy();
    res.send("Session Removed!");
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
