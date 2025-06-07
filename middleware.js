import express from "express";

const app = express();
const PORT = 3000;


app.get("/", (req, res) => {
    res.send("this is home page");
});

app.get("/error", () => {
    throw new Error("This is the test error");
});
app.use((err, req, res, next) => {
    console.error(err.message);
    res.send("Internal server Error");
});
app.listen(PORT, () => {
    console.log("Server is running!");
});
