import mongoose from "mongoose";
import {UserLikesConstructor} from "../types/userLiked-constructor";

const userLikesScheme = new mongoose.Schema<UserLikesConstructor>({
    userId: {type: String, required: true},
    commentId: {type: String, required: true},
    likeStatus: {type: String, required: true}
})

export const UserLikesScheme = mongoose.model('userLikes', userLikesScheme)