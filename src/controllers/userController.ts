import { Request, Response } from "express";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, UserWithoutPassword } from "../models/User";
import dotenv from "dotenv";

dotenv.config();

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(mongoUri);
const dbName = process.env.DATABASE;
const secretKey = process.env.JWT_SECRET || "your_secret_key";

async function connectDB() {
    try {
        await client.connect();
        return client.db(dbName).collection<User>("users");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        return null;
    }
}

// Create User (Register)
export async function registerUser(req: Request, res: Response) {
    try {
        const usersCollection = await connectDB();
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await usersCollection.findOne({ email })
        if (existingUser) {
            res.status(409).json({ message: "A user with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser: User = { name, email, password: hashedPassword, createdAt: new Date().toISOString() };

        const result = await usersCollection.insertOne(newUser);
        res.status(201).json({ message: "User created", userId: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: "Error creating user" });
    }
}

// Authenticate User (Login)
export async function loginUser(req: Request, res: Response): Promise<void> {
    try {
        const usersCollection = await connectDB();
        const { email, password } = req.body;

        const user = await usersCollection.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(401).json({ error: "Invalid credentials" });
            return; // Ensure function exits after sending response
        }

        const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: "Error logging in" });
    }
}

// Read User Data
export async function getUsers(req: Request, res: Response) {
    try {
        const usersCollection = await connectDB();
        // const users: UserWithoutPassword[] = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
        const users: User[] = await usersCollection.find().toArray();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Error fetching users" });
    }
}

// Update User
export async function updateUser(req: Request, res: Response) {
    try {
        const usersCollection = await connectDB();
        const { id } = req.params;
        const updateData = req.body;

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const result = await usersCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
        res.json({ message: "User updated", modifiedCount: result.modifiedCount });
    } catch (error) {
        res.status(500).json({ error: "Error updating user" });
    }
}

// Delete User
export async function deleteUser(req: Request, res: Response) {
    try {
        const usersCollection = await connectDB();
        const { id } = req.params;

        const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
        res.json({ message: "User deleted", deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).json({ error: "Error deleting user" });
    }
}
