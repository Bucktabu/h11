import {BlogConstructor} from "../types/blogs-constructor";

export const blogOutputType = (blogDB: BlogConstructor) => {
    return {
        id: blogDB.id,
        name: blogDB.name,
        description: blogDB.description,
        websiteUrl: blogDB.websiteUrl,
        createdAt: blogDB.createdAt
    }
}