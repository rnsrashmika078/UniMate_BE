import mongoose from "mongoose";

export const connectDb = async () => {
    const db = "newDB";
    const MONGODB_URI = `mongodb+srv://rnsrashmika078:123@cluster0.if8jbdc.mongodb.net/${db}`;

    await mongoose.connect(MONGODB_URI).then(() => {
        console.log("Database Connected!");
    });
    
};
