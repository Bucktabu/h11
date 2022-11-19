import mongoose from "mongoose";
import {CommentBDConstructor} from "../types/comment-constructor";

const commentsScheme = new mongoose.Schema<CommentBDConstructor>({
    id: {type: String, required: true},
    content: {type: String, required: true},
    userId: {type: String, required: true},
    userLogin: {type: String, required: true},
    createdAt: {type: String, required: true},
    postId: {type: String, required: true}
})

export const CommentsSchema = mongoose.model('comment', commentsScheme)