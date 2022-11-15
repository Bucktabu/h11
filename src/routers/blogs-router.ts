import {Response, Router} from "express";

import {blogsService} from "../domain/blogs-service";
import {postsService} from "../domain/posts-service";

import {BlogsCreateNewBlog} from "../models/blogsCreateNewBlog";
import {BlogsUpdateBlog} from "../models/blogsUpdateBlog";
import {QueryParameters} from "../models/queryParameters";
import {BlogsCreateNewPost} from "../models/blogCreateNewPost";
import {URIParameters} from "../models/URIParameters";

import {BlogConstructor} from "../types/blogs-constructor";
import {PostConstructor} from "../types/posts-constructor";
import {ContentPageConstructor} from "../types/contentPage-constructor";
import {RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery} from "../types/request-types";
import {
    createPostForBlogsRouterMiddleware, deleteBlogsRouterMiddleware,
    getBlogsRouterMiddleware, getPostForBlogsRouterMiddleware,
    postBlogsRouterMiddleware, putBlogsRouterMiddleware
} from "../middlewares/blogsRouterMiddleware";

export const blogsRouter = Router({})

class BlogController {
    async getBlogById(req: RequestWithParams<URIParameters>,
                      res: Response<BlogConstructor>) {
        const blog = await blogsService.giveBlogById(req.params.id)

        if (!blog) {
            return res.sendStatus(404)
        }

        res.status(200).send(blog)
    }

    async getBlogsPage(req: RequestWithQuery<QueryParameters>,
                       res: Response<ContentPageConstructor>) {
        const pageWithBlogs: ContentPageConstructor | null = await blogsService
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
        const blog: BlogConstructor | null = await blogsService.giveBlogById(req.params.id)

        if (!blog) {
            return res.sendStatus(404)
        }

        const pageWithPosts = await postsService
            .givePostsPage(req.query.sortBy,
                req.query.sortDirection,
                req.query.pageNumber,
                req.query.pageSize,
                req.params.id)

        res.status(200).send(pageWithPosts)
    }

    async createBlog(req: RequestWithBody<BlogsCreateNewBlog>, res: Response<BlogConstructor>) {
        const newBlog = await blogsService.createNewBlog(req.body.name, req.body.youtubeUrl)

        if (!newBlog) {
            return res.sendStatus(404)
        }

        res.status(201).send(newBlog)
    }

    async createPostByBlogId(req: RequestWithParamsAndBody<URIParameters, BlogsCreateNewPost>,
                             res: Response<PostConstructor>) {
        const existsBlog = await blogsService.giveBlogById(req.params.id)

        if (!existsBlog) {
            return res.sendStatus(404)
        }

        const newPost = await postsService
            .createNewPost(req.body.title, req.body.shortDescription, req.body.content, req.params.id)

        res.status(201).send(newPost!)
    }

    async updateBlogById(req: RequestWithParamsAndBody<URIParameters, BlogsUpdateBlog>,
                         res: Response<BlogConstructor | null>) {
        const isUpdate = await blogsService.updateBlog(req.params.id, req.body.name, req.body.youtubeUrl)

        if (!isUpdate) {
            return res.sendStatus(404)
        }

        const blog = await blogsService.giveBlogById(req.params.id)
        return res.status(204).send(blog)
    }

    async deleteBlogById(req: RequestWithParams<URIParameters>, res: Response) {
        const isDeleted = await blogsService.deleteBlogById(req.params.id)

        if (!isDeleted) {
            return res.sendStatus(404)
        }

        return res.sendStatus(204)
    }
}

const blogControllerInstance = new BlogController()

blogsRouter.get('/',
    ...getBlogsRouterMiddleware, blogControllerInstance.getBlogsPage)

blogsRouter.get('/:id', blogControllerInstance.getBlogById)

blogsRouter.get('/:id/posts',
    ...getPostForBlogsRouterMiddleware, blogControllerInstance.getPostsPageByBlogId)

blogsRouter.post('/',
    postBlogsRouterMiddleware, blogControllerInstance.createBlog)

blogsRouter.post('/:id/posts', // blogId
    createPostForBlogsRouterMiddleware, blogControllerInstance.createPostByBlogId)

blogsRouter.put('/:id',
    putBlogsRouterMiddleware, blogControllerInstance.updateBlogById)

blogsRouter.delete('/:id',
    deleteBlogsRouterMiddleware, blogControllerInstance.deleteBlogById)