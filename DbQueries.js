import express from "express";
import express from "express";
import { connectDb } from "./config/dbMongo.js";
import { connectDb } from "./config/dbMongo.js";
import { Person } from "./models/Person.js";

const app = express();
const PORT = 3000;

await connectDb(); //Connect to DB
app.use(express.json());

app.get("/", (req, res) => {
    res.send("this is home page");
});

//create person
app.post("/person", async (req, res) => {
    try {
        console.log(req.body);
        const { name, email, age } = req.body;
        const payload = { name, age, email };
        const newPerson = new Person(payload);
        await newPerson.save();
        res.send("Person Added");
    } catch (error) {
        res.send(error.message);
    }
});

// update person
app.put("/person", async (req, res) => {
    const { id } = req.body;
    const personData = await Person.findByIdAndUpdate(id, { age: 50 });
    // personData.age = 30;
    // await personData.save();
    console.log(personData);
    res.send("Person data updated!");
});
// delete person
app.delete("/person/:id", async (req, res) => {
    const { id } = req.params;
    await Person.findByIdAndDelete(id);
    res.send("Person deleted Successfully!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
