import mongoose from "mongoose";
import {LikesInfoConstructor} from "../types/likesInfo-constructor";

const likesInfoScheme = new mongoose.Schema<LikesInfoConstructor>({
    myStatus: {type: String, required: true},
    likesCount: {type: Number, required: true},
    dislikesCount: {type: Number, required: true}
})

export const LikesInfoScheme = mongoose.model('userLikes', likesInfoScheme)