import type { ObjectId } from "mongodb"


export interface User {
    _id?: ObjectId | string
    id?: string
    name: string
    email: string
    password: string
    image?: string
    createdAt: string
    updatedAt?: string
}

export type UserWithoutPassword = Omit<User, "password">
