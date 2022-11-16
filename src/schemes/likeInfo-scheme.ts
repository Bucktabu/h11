import mongoose from "mongoose";
import {LikesInfoConstructor} from "../types/likesInfo-constructor";

const likesInfoScheme = new mongoose.Schema<LikesInfoConstructor>({
    commentId: {type: String, required: true},
    myStatus: {type: String, required: true},
    likesCount: {type: Number, required: true},
    dislikesCount: {type: Number, required: true}
})

export const LikesInfoScheme = mongoose.model('userInfo', likesInfoScheme)