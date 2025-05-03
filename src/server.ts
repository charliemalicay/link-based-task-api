import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS
app.use(cors({
    origin: process.env.CLIENT_URL || "*", // Adjust for security
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use("/users", userRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
