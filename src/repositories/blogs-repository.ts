import {BlogSchema} from "../schemes/blog-scheme";
import {BlogsConstructor, BlogConstructor} from "../types/blogs-constructor";
import {giveSkipNumber} from "../helperFunctions";

export class BlogsRepository {
    async createNewBlog(newBlog: BlogConstructor): Promise<BlogConstructor | null> {
        try {
            await BlogSchema.create(newBlog)
            return newBlog
        } catch (e) {
            console.log('3', e)
            return null
        }
    }

    async giveBlogs(searchNameTerm: string,
                    sortBy: string,
                    sortDirection: string,
                    pageNumber: string,
                    pageSize: string): Promise<BlogsConstructor> {

        return BlogSchema
            .find({name: {$regex: searchNameTerm, $options: 'i'}}, {projection: {_id: false}})
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip(giveSkipNumber(pageNumber, pageSize))
            .limit(Number(pageSize))
            .lean()
    }

    async giveTotalCount(searchNameTerm: string): Promise<number> {
        return BlogSchema.countDocuments({name: {$regex: searchNameTerm, $options: 'i'}})
    }

    async giveBlogById(id: string): Promise<BlogConstructor | null> {
        return BlogSchema.findOne({id: id}, {projection: {_id: false}})
    }

    async updateBlog(blogId: string, name: string, youtubeUrl: string): Promise<boolean> {
        const result = await BlogSchema.updateOne({id: blogId}, {$set: {name: name, youtubeUrl: youtubeUrl}})

        return result.matchedCount === 1
    }

    async deleteBlogById(blogId: string): Promise<boolean> {
        const result = await BlogSchema.deleteOne({id: blogId})

        return result.deletedCount === 1
    }

    async deleteAllBlogs(): Promise<boolean> {
        try {
            await BlogSchema.deleteMany({})
            return true
        } catch (e) {
            console.log('BlogModel => deleteAllBlogs =>', e)
            return false
        }
    }
}