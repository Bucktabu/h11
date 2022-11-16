import {BlogConstructor} from "../types/blogs-constructor";

export const blogOutputType = (blogDB: BlogConstructor) => {
    return {
        id: blogDB.id,
        name: blogDB.name,
        youtubeUrl: blogDB.youtubeUrl,
        createdAt: blogDB.createdAt
    }
}