import mongoose from "mongoose";
import {LikesConstructor} from "../types/likes-constructor";

const likesScheme = new mongoose.Schema<LikesConstructor>({
    parentId: {type: String, required: true},
    userId: {type: String, required: true},
    status: {type: String, required: true}
})

export const LikesScheme = mongoose.model('likes', likesScheme)