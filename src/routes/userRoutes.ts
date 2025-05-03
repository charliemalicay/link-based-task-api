import express from "express";
import { registerUser, loginUser, getUsers, updateUser, deleteUser } from "../controllers/userController";

import { body } from "express-validator";
import validateRequest from "../middleware/validateMiddleware";

const router = express.Router();

// Validation rules
const userValidationRules = [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

router.post("/register", userValidationRules, validateRequest, registerUser);
// router.post("/login", loginUser);

// @ts-ignore
router.post("/login", [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required"),
], validateRequest, loginUser);

router.get("/", getUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
