import mongoose from "mongoose";
import {UserDBConstructor} from "../types/user-constructor";

const userScheme = new mongoose.Schema<UserDBConstructor>({
    id: {type: String, required: true},
    login: {type: String, required: true},
    email: {type: String, required: true},
    passwordHash: {type: String, required: true},
    passwordSalt: {type: String, required: true},
    createdAt: {type: String, required: true}
})

export const UserScheme = mongoose.model('users', userScheme)