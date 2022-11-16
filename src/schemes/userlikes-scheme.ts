import mongoose from "mongoose";
import {UserLikeStatusConstructor} from "../types/userLikeStatus-constructor";

const userLikesScheme = new mongoose.Schema<UserLikeStatusConstructor>({
    userId: {type: String, required: true},
    commentId: {type: String, required: true},
    likeStatus: {type: String, required: true}
})

export const UserLikesScheme = mongoose.model('userLikes', userLikesScheme)