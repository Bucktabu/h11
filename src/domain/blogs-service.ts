import {BlogsRepository} from "../repositories/blogs-repository";
import {BlogConstructor} from "../types/blogs-constructor";
import {ContentPageConstructor} from "../types/contentPage-constructor";
import {paginationContentPage} from "../paginationContentPage";
import {blogOutputType} from "../dataMapping/toBlogOutputData";

export class BlogsService {
    constructor(protected blogsRepository: BlogsRepository) {}

    async createNewBlog(name: string, description: string, websiteUrl: string): Promise<BlogConstructor | null> {

        const newBlog = new BlogConstructor(
            String(+new Date()),
            name,
            description,
            websiteUrl,
            new Date().toISOString()
        )

        const createdBlog = await this.blogsRepository.createNewBlog(newBlog)

        if (!createdBlog) {
            return null
        }

        return blogOutputType(createdBlog)
    }

    async giveBlogsPage(searchNameTerm: string,
                        sortBy: string,
                        sortDirection: string,
                        pageNumber: string,
                        pageSize: string): Promise<ContentPageConstructor | null> {

        const blogs = await this.blogsRepository
            .giveBlogs(searchNameTerm, sortBy, sortDirection, pageNumber, pageSize)

        if (!blogs) {
            return null
        }

        const totalCount = await this.blogsRepository.giveTotalCount(searchNameTerm)

        return paginationContentPage(pageNumber, pageSize, blogs, totalCount)
    }

    async giveBlogById(blogId: string): Promise<BlogConstructor | null> {
        return await this.blogsRepository.giveBlogById(blogId)
    }

    async updateBlog(blogId: string, name: string, youtubeUrl: string): Promise<boolean> {
        return await this.blogsRepository.updateBlog(blogId, name, youtubeUrl)
    }

    async deleteBlogById(blogId: string): Promise<boolean> {
        return await this.blogsRepository.deleteBlogById(blogId)
    }
}