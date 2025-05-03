import { Request, Response } from "express";
import { MongoClient, ObjectId } from "mongodb";
import { Task } from "../models/Task";
import dotenv from "dotenv";

import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";


dotenv.config();
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(mongoUri);
const dbName = process.env.DATABASE;

async function connectDB() {
    await client.connect();
    return client.db(dbName).collection<Task>("tasks");
}

interface JWTPayloadTypes {
    assignee: string;
    assignedDate: string;
    createdBy: string;
    taskTitle: string;
    dueDate: string;
}

// Create Task
export async function createTask(req: Request, res: Response): Promise<void> {
    try {
        const tasksCollection = await connectDB();
        const newTask: Task = {
            ...req.body,
            createdBy: process.env.TASK_ASSIGNEE_NAME,
            assignedDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            token: generateToken({
                assignee: req.body.assignee,
                assignedDate: req.body.assignedDate,
                createdBy: process.env.TASK_ASSIGNEE_NAME,
                taskTitle: req.body.title,
                dueDate: req.body.dueDate
            }),
            status: "pending",
        };
        const result = await tasksCollection.insertOne(newTask);
        res.status(201).json({ message: "Task created", taskId: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: "Error creating task" });
    }
}

// Read All Tasks
export async function getTasks(req: Request, res: Response): Promise<void> {
    try {
        const tasksCollection = await connectDB();
        const { status } = req.query;

        let tasks = {}

        if(status) {
            // @ts-ignore
            tasks = await tasksCollection.find({ status }).toArray();
        } else {
            tasks = await tasksCollection.find().toArray();
        }

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Error fetching tasks" });
    }
}

// Read Single Task
export async function getTaskById(req: Request, res: Response): Promise<void> {
    try {
        const tasksCollection = await connectDB();
        const { id } = req.params;
        const task = await tasksCollection.findOne({ _id: new ObjectId(id) });

        if (!task) {
            res.status(404).json({ error: "Task not found" });
            return;
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ error: "Error fetching task" });
    }
}

// Read Single Task by token
export async function getTaskByToken(req: Request, res: Response): Promise<void> {
    try {
        const tasksCollection = await connectDB();
        const { token } = req.params;

        const task = await tasksCollection.findOne({ token });

        if (!task) {
            res.status(404).json({ error: "Task not found" });
            return;
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ error: "Error fetching task" });
    }
}

// Update Task
export async function updateTask(req: Request, res: Response): Promise<void> {
    try {
        const tasksCollection = await connectDB();
        const { id } = req.params;
        const updateData = req.body;

        const result = await tasksCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });

        res.json({ message: "Task updated", modifiedCount: result.modifiedCount });
    } catch (error) {
        res.status(500).json({ error: "Error updating task" });
    }
}

// Delete Task
export async function deleteTask(req: Request, res: Response): Promise<void> {
    try {
        const tasksCollection = await connectDB();
        const { id } = req.params;

        const result = await tasksCollection.deleteOne({ _id: new ObjectId(id) });
        res.json({ message: "Task deleted", deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).json({ error: "Error deleting task" });
    }
}

// Send Email
export async function sendEmail(req: Request, res: Response): Promise<void> {
    try {
        const tasksCollection = await connectDB();
        const { id } = req.params;

        const task = await tasksCollection.findOne({ _id: new ObjectId(id) });

        if (!task) {
            res.status(404).json({ error: "Task not found" });
            return;
        }

        if (task.status !== 'pending') {
            res.status(404).json({ error: "Task is not pending status" });
            return;
        }

        let currentToken = task.token;

        try {
            jwt.verify(task.token, process.env.JWT_SECRET_KEY);

        } catch (error) {
            console.log("Token is expired, regenerating...")
            currentToken = generateToken({
                assignee: req.body.assignee,
                assignedDate: req.body.assignedDate,
                createdBy: process.env.TASK_ASSIGNEE_NAME,
                taskTitle: req.body.title,
                dueDate: req.body.dueDate
            })

            const updateData = {
                token: currentToken
            };

            const result = await tasksCollection.updateOne({ _id: new ObjectId(task.id) }, { $set: updateData });

            if (!result) {
                res.status(404).json({ error: "Error in regenerating task token" });
            }
        }


        const emailTemplate = `
        You have a new task: ${task.title}
        Please review and respond using the link below:
        ${process.env.UI_URL}/task/${currentToken}`

        const info = await transporter.sendMail({
            from: `"${process.env.TASK_ASSIGNEE_NAME}" <${process.env.TASK_ASSIGNEE_EMAIL}>`,
            to: task.assignee || "charliemalicay@gmail.com",
            subject: "Task Approval Request",
            text: emailTemplate
        });

        res.status(201).json({ message: "Email Sent", messageID: info.messageId });
    } catch (error) {
        res.status(500).json({ error: "Error sending email" });
    }
}

function generateToken(payload: JWTPayloadTypes): string {
    const options = { expiresIn: "1h" }; // Token expires in 1 hour

    // @ts-ignore
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, options);
}

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.TASK_ASSIGNEE_EMAIL,
        pass: process.env.TASK_ASSIGNEE_PASS
    },
});
