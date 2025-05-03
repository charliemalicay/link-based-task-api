import express from "express";
import dotenv from "dotenv";

import { MongoClient } from "mongodb";
import { User } from "./models/User";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mydb";

// MongoDB Connection
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(mongoUri);
const DBNAME = process.env.DATABASE;


async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

connectDB().then();
const db = client.db(DBNAME);

app.get("/", (req, res) => {
    res.send("Hello, TypeScript + Express + MongoDB!");
});

app.get("/find-user", async (req, res) => {
    try {
        const usersCollection = db.collection<User>("users");
        const users = await usersCollection.find().toArray();

        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Error fetching users" });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
