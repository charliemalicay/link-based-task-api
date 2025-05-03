# Task Management API

## 📝 Overview
This project is a **Task Management System** that provides a **Node.js backend** with **Express, TypeScript, and MongoDB**. It allows users to **create, read, update, and delete tasks** with authentication and filtering.

---

## ⚙️ Tech Stack
### **Backend:**
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Typed JavaScript for robustness
- **MongoDB** - NoSQL database
- **MongoDB Driver** - Native MongoDB integration
- **bcrypt.js** - Password hashing
- **JWT (jsonwebtoken)** - Authentication
- **express-validator** - Input validation
- **CORS** - Secure API access

---

## 🏗️ Setup & Installation

### **1️⃣ Backend Setup (Node.js + Express + MongoDB)**
#### **Clone the repository & Install dependencies**
```bash
git clone <your-repo-url>
cd backend
npm install
```

### **Setup Environment Variables**
```bash
PORT=4000
MONGO_URI=mongodb+srv://<username>:<password>@task-approval-cluster.ximuvjf.mongodb.net/?retryWrites=true&w=majority&appName=task-approval-cluster

DATABASE=task-approval
UI_URL=https://link-based-task-app.vercel.app

TASK_ASSIGNEE_NAME=Charlie Task Assignee
TASK_ASSIGNEE_EMAIL=<email>
TASK_ASSIGNEE_PASS=<password>

JWT_SECRET_KEY=2c7d6cf457300f0558cad7e9b2616a4f82badff2818d4fe132504987f1e32ca9
```

### **Run in Local**
```bash
npx ts-node src/index.ts
```
