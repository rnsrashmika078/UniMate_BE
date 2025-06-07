import express from "express";
import multer from "multer";
import cors from "cors";
import cookieSession from "cookie-session";
const app = express();
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, callback) => {
        const username = req.params.username;
        const mmtype = file.mimetype.split("/").pop();
        callback(null, username + "." + mmtype);
    },
});
const upload = multer({
    storage,
});
app.use("/uploads", express.static("uploads"));
app.use(cors());
// app.use( upload.single("image"));

let extension = "png";
app.post("/upload/:username", upload.single("dp"), (req, res, next) => {
    const { username } = req.params;
    console.log(username)
    extension = req.file.mimetype.split("/").pop();

    if (extension) {
        const image = `http://localhost:5000/uploads/${username}.${extension}`;
        if (image) {
            res.json({ image });
        }
    }
});
app.get("/dp/:username", (req, res) => {
    const { username } = req.params;
    console.log(username)
    const image = `http://localhost:5000/uploads/${username}.${extension}`;

    if (image) {
        console.log(image);
        res.status(200).json({ image });
    } else {
        res.status(404);
    }
    // res.send("Form Received!");
});
const PORT = 5000;
app.get("/", (req, res) => {});
app.listen(PORT, (req, res) => {
    console.log("Server is online!");
});
