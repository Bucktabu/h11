import {postsRepository} from "../repositories/posts-repository";
import {blogsRepository} from "../repositories/blogs-repository";
import {PostConstructor} from "../types/posts-constructor";
import {ContentPageConstructor} from "../types/contentPage-constructor";

import {paginationContentPage} from "../paginationContentPage";
import {postOutputType} from "../dataMapping/toPostOutputType";

class PostsService {
    async createNewPost(title: string,
                        shortDescription: string,
                        content: string,
                        blogId: string): Promise<PostConstructor | null> {

        const newPost = new PostConstructor(
            String(+new Date()),
            title,
            shortDescription,
            content,
            blogId,
            await this.giveBlogName(blogId),
            new Date().toISOString()
        )

        const createdNewPost = await postsRepository.createNewPost(newPost)

        if (!createdNewPost) {
            return null
        }

        return postOutputType(createdNewPost)
    }

    async giveBlogName(id: string): Promise<string> {
        const blog = await blogsRepository.giveBlogById(id)

        if (!blog) {
            return ''
        }

        return blog.name
    }

    async givePostsPage(sortBy: string,
                        sortDirection: 'asc' | 'desc',
                        pageNumber: string,
                        pageSize: string,
                        blogId?: string): Promise<ContentPageConstructor> {

        const content = await postsRepository.givePosts(sortBy, sortDirection, pageNumber, pageSize, blogId)
        const totalCount = await postsRepository.giveTotalCount(blogId)

        return paginationContentPage(pageNumber, pageSize, content, totalCount)
    }

    async givePostById(postId: string): Promise<PostConstructor | null> {
        return await postsRepository.givePostById(postId)
    }

    async updatePost(id: string,
                     title: string,
                     shortDescription: string,
                     content: string,
                     blogId: string): Promise<boolean> {

        return await postsRepository.updatePost(id, title, shortDescription, content, blogId)
    }

    async deletePostById(id: string): Promise<boolean> {
        return await postsRepository.deletePostById(id)
    }
}

export const postsService = new PostsService()