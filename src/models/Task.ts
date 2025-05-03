import type { ObjectId } from "mongodb";


export interface Task {
    _id?: ObjectId | string;
    id?: string;
    title: string;
    description: string;
    assignee: string;
    dueDate: string;
    status: "active" | "pending" | "completed";
    createdBy: string;
    createdAt: string;
    assignedDate: string;
    completedDate?: string;
    response?: {
        approved: boolean;
        feedback?: string;
        respondedAt: string;
    };
    token: string;
}
