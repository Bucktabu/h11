import {Response, Router} from "express";

import {commentsService} from "../domain/comments-servise";
import {postsService} from "../domain/posts-service";

import {CreateNewComment} from "../models/postCreateNewComment"
import {QueryParameters} from "../models/queryParameters";
import {PostsCreateNewPost} from "../models/postsCreateNewPost";
import {PostsUpdatePost} from "../models/postsUpdatePost";
import {URIParameters} from "../models/URIParameters";

import {CommentType} from "../types/comment-type";
import {ContentPageType} from "../types/content-page-type";
import {PostType} from "../types/posts-type";
import {RequestWithBody,
        RequestWithParams,
        RequestWithParamsAndBody,
        RequestWithParamsAndQuery,
        RequestWithQuery} from "../types/request-types";
import {createCommentForPostsRouterMiddleware,
        postsRouterMiddleware,
        getPostsRouterMiddleware,
        deletePostsRouterMiddleware} from "../middlewares/postsRouter-middleware";

export const postsRouter = Router({})

class PostController {
    async getPostsPage(req: RequestWithQuery<QueryParameters>,
                       res: Response<ContentPageType>) {
        const pageWithPosts: ContentPageType = await postsService
            .givePostsPage(req.query.sortBy,
                req.query.sortDirection,
                req.query.pageNumber,
                req.query.pageSize,
                req.query.blogId)

        if (!pageWithPosts) {
            return res.sendStatus(404)
        }

        res.status(200).send(pageWithPosts)
    }

    async getPostByPostId(req: RequestWithParams<URIParameters>,
                          res: Response<PostType>) {
        const post = await postsService.givePostById(req.params.id)

        if (!post) {
            return res.sendStatus(404)
        }

        res.status(200).send(post)
    }

    async getCommentsPageByPostId(req: RequestWithParamsAndQuery<URIParameters, QueryParameters>,
                                  res: Response<ContentPageType>) {
        const pageWithComments: ContentPageType | null = await commentsService
            .giveCommentsPage(req.query.sortBy,
                req.query.sortDirection,
                req.query.pageNumber,
                req.query.pageSize,
                req.params.id)

        if (!pageWithComments) {
            return res.sendStatus(404)
        }

        res.status(200).send(pageWithComments)
    }

    async createPost(req: RequestWithBody<PostsCreateNewPost>,
                     res: Response<PostType | null>) {
        const newPost = await postsService
            .createNewPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)

        if (!newPost) {
            return res.sendStatus(404)
        }

        return res.status(201).send(newPost)
    }

    async createCommentByPostId(req: RequestWithParamsAndBody<URIParameters, CreateNewComment>,
                                res: Response<CommentType>) {
        const post = await postsService.givePostById(req.params.id)

        if (!post) {
            return res.sendStatus(404)
        }

        const createdComment = await commentsService
            .createNewComment(req.params.id, req.body.content, req.user!)

        if (!createdComment) {
            return res.sendStatus(404)
        }

        return res.status(201).send(createdComment)
    }

    async updatePostByPostId(req: RequestWithParamsAndBody<URIParameters, PostsUpdatePost>,
                              res: Response<PostType | null>) {
        const isUpdate = await postsService
            .updatePost(req.params.id,
                req.body.title,
                req.body.shortDescription,
                req.body.content,
                req.body.blogId)

        if (!isUpdate) {
            return res.sendStatus(404)
        }

        const post = await postsService.givePostById(req.params.id)
        res.status(204).send(post)
    }

    async deletePostByPostId(req: RequestWithParams<URIParameters>,
                             res: Response) {
        const isDeleted = await postsService.deletePostById(req.params.id)

        if (isDeleted) {
            return res.sendStatus(204)
        }

        res.sendStatus(404)
    }
}

const postControllerInstance = new PostController()

postsRouter.get('/',
    ...getPostsRouterMiddleware,postControllerInstance.getPostsPage)

postsRouter.get('/:id', postControllerInstance.getPostByPostId)

postsRouter.get('/:id/comments',
    ...getPostsRouterMiddleware, postControllerInstance.getCommentsPageByPostId)

postsRouter.post('/',
    postsRouterMiddleware, postControllerInstance.createPost)

postsRouter.post('/:id/comments',
    createCommentForPostsRouterMiddleware, postControllerInstance.createCommentByPostId)

postsRouter.put('/:id',
    postsRouterMiddleware, postControllerInstance.updatePostByPostId)

postsRouter.delete('/:id',
    deletePostsRouterMiddleware, postControllerInstance.deletePostByPostId)