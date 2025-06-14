import cookieParser from "cookie-parser";
import express from "express";
import session from "express-session";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

app.use(
    session({
        secret: "sample-secret",
        resave: false,
        saveUninitialized: false,
    })
);
const users = [];

app.post("/register", (req, res) => {
    const { username, password } = req.body;
    users.push({
        username,
        password,
    });
    res.send("User Registered Succesfully!");
});
app.get("/", (req, res) => {
    res.send("this is the home page");
});
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);
    if (!user || password !== user.password) {
        return res.send("Not Authorized!");
    }
    req.session.user = user;
    res.send("User Logged In!");
});

app.get("/dashboard", (req, res) => {
    if (!req.session.user) {
        return res.send("Unauthorized!");
    }
    res.send(`Welcome ${req.session.user.username}`);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
