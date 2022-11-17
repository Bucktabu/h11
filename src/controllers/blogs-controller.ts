import {Response} from "express";
import {BlogsService} from "../domain/blogs-service";
import {PostsService} from "../domain/posts-service";
import {BlogConstructor} from "../types/blogs-constructor";
import {ContentPageConstructor} from "../types/contentPage-constructor";
import {PostConstructor} from "../types/posts-constructor";
import {RequestWithBody,
        RequestWithParams,
        RequestWithParamsAndBody,
        RequestWithParamsAndQuery,
        RequestWithQuery} from "../types/request-types";
import {BlogsCreateNewBlog} from "../models/blogsCreateNewBlog";
import {BlogsCreateNewPost} from "../models/blogCreateNewPost";
import {BlogsUpdateBlog} from "../models/blogsUpdateBlog";
import {QueryParameters} from "../models/queryParameters";
import {URIParameters} from "../models/URIParameters";

export class BlogsController {
    constructor(protected blogsService: BlogsService,
                protected postsService: PostsService) {}

    async getBlogById(req: RequestWithParams<URIParameters>,
                      res: Response<BlogConstructor>) {
        const blog = await this.blogsService.giveBlogById(req.params.id)

        if (!blog) {
            return res.sendStatus(404)
        }

        res.status(200).send(blog)
    }

    async getBlogsPage(req: RequestWithQuery<QueryParameters>,
                       res: Response<ContentPageConstructor>) {
        const pageWithBlogs: ContentPageConstructor | null = await this.blogsService
            .giveBlogsPage(req.query.searchNameTerm,
                req.query.sortBy,
                req.query.sortDirection,
                req.query.pageNumber,
                req.query.pageSize)

        if (!pageWithBlogs) {
            return res.sendStatus(404)
        }

        res.status(200).send(pageWithBlogs)
    }

    async getPostsPageByBlogId(req: RequestWithParamsAndQuery<URIParameters, QueryParameters>,
                               res: Response<ContentPageConstructor>) {
        const blog: BlogConstructor | null = await this.blogsService.giveBlogById(req.params.id)

        if (!blog) {
            return res.sendStatus(404)
        }

        const pageWithPosts = await this.postsService
            .givePostsPage(req.query.sortBy,
                req.query.sortDirection,
                req.query.pageNumber,
                req.query.pageSize,
                req.params.id)

        res.status(200).send(pageWithPosts)
    }

    async createBlog(req: RequestWithBody<BlogsCreateNewBlog>, res: Response<BlogConstructor>) {
        const newBlog = await this.blogsService.createNewBlog(req.body.name, req.body.youtubeUrl)
        console.log('1', newBlog)
        if (!newBlog) {
            return res.sendStatus(404)
        }

        res.status(201).send(newBlog)
    }

    async createPostByBlogId(req: RequestWithParamsAndBody<URIParameters, BlogsCreateNewPost>,
                             res: Response<PostConstructor>) {
        const existsBlog = await this.blogsService.giveBlogById(req.params.id)

        if (!existsBlog) {
            return res.sendStatus(404)
        }

        const newPost = await this.postsService
            .createNewPost(req.body.title, req.body.shortDescription, req.body.content, req.params.id)

        res.status(201).send(newPost!)
    }

    async updateBlogById(req: RequestWithParamsAndBody<URIParameters, BlogsUpdateBlog>,
                         res: Response<BlogConstructor | null>) {
        const isUpdate = await this.blogsService.updateBlog(req.params.id, req.body.name, req.body.youtubeUrl)

        if (!isUpdate) {
            return res.sendStatus(404)
        }

        const blog = await this.blogsService.giveBlogById(req.params.id)
        return res.status(204).send(blog)
    }

    async deleteBlogById(req: RequestWithParams<URIParameters>, res: Response) {
        const isDeleted = await this.blogsService.deleteBlogById(req.params.id)

        if (!isDeleted) {
            return res.sendStatus(404)
        }

        return res.sendStatus(204)
    }
}