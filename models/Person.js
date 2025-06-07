import mongoose from "mongoose";

const personSchema = new mongoose.Schema(
    {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        username: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        confirm: { type: String, required: true },
        university: { type: String, required: true },
        profileImage: { type: String, required: false },
        coverImage: { type: String, required: false },
    },
    { timestamps: true }
);

export const Person = mongoose.model("Person", personSchema);
