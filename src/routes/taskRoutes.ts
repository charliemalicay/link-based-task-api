import express from "express";
import { body } from "express-validator";
import {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    sendEmail,
    getTaskByToken
} from "../controllers/taskController";
import validateRequest from "../middleware/validateMiddleware";

const router = express.Router();

// Validation rules
const taskValidationRules = [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("assignee").notEmpty().withMessage("Assignee is required"),
    body("dueDate").notEmpty().withMessage("Due date is required"),
];

// CRUD Routes
router.post("/", taskValidationRules, validateRequest, createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.get("/send-email/:id", sendEmail);
router.get("/token/:token", getTaskByToken);

export default router;
