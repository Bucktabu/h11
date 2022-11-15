import mongoose from "mongoose";
import {BlogConstructor} from "../types/blogs-constructor";

const blogScheme = new mongoose.Schema<BlogConstructor>({
    id: {type: String, required: true},
    name: {type: String, required: true},
    youtubeUrl: {type: String, required: true},
    createdAt: {type: String, required: true}
})

export const BlogSchema = mongoose.model('blogs', blogScheme)