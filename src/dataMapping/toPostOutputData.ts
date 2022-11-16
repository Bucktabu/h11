import {PostConstructor} from "../types/posts-constructor";

export const postOutputType = (postsBD: PostConstructor) => {
    return {
        id: postsBD.id,
        title: postsBD.title,
        shortDescription: postsBD.shortDescription,
        content: postsBD.content,
        blogId: postsBD.blogId,
        blogName: postsBD.blogName,
        createdAt: postsBD.createdAt
    }
}