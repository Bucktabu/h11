import {Response} from "express";
import {CommentsService} from "../domain/comments-servise";
import {PostsService} from "../domain/posts-service";
import {CommentConstructor} from "../types/comment-constructor";
import {ContentPageConstructor} from "../types/contentPage-constructor";
import {PostConstructor} from "../types/posts-constructor";
import {RequestWithBody,
        RequestWithParams,
        RequestWithParamsAndBody,
        RequestWithParamsAndQuery,
        RequestWithQuery} from "../types/request-types";
import {CreateNewComment} from "../models/postCreateNewComment";
import {PostsCreateNewPost} from "../models/postsCreateNewPost";
import {PostsUpdatePost} from "../models/postsUpdatePost";
import {QueryParameters} from "../models/queryParameters";
import {URIParameters} from "../models/URIParameters";

export class PostsController {
    constructor(protected postsService: PostsService,
                protected commentsService: CommentsService) {}

    async getPostsPage(req: RequestWithQuery<QueryParameters>,
                       res: Response<ContentPageConstructor>) {
        const pageWithPosts: ContentPageConstructor = await this.postsService
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
                          res: Response<PostConstructor>) {
        const post = await this.postsService.givePostById(req.params.id)

        if (!post) {
            return res.sendStatus(404)
        }

        res.status(200).send(post)
    }

    async getCommentsPageByPostId(req: RequestWithParamsAndQuery<URIParameters, QueryParameters>,
                                  res: Response<ContentPageConstructor>) {
        const pageWithComments: ContentPageConstructor | null = await this.commentsService
            .giveCommentsPage(req.query.sortBy,
                              req.query.sortDirection,
                              req.query.pageNumber,
                              req.query.pageSize,
                              req.params.id,
                              req.headers.authorization)

        if (!pageWithComments) {
            return res.sendStatus(404)
        }

        return res.status(200).send(pageWithComments)
    }

    async createPost(req: RequestWithBody<PostsCreateNewPost>,
                     res: Response<PostConstructor | null>) {
        const newPost = await this.postsService
            .createNewPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)

        if (!newPost) {
            return res.sendStatus(404)
        }

        return res.status(201).send(newPost)
    }

    async createCommentByPostId(req: RequestWithParamsAndBody<URIParameters, CreateNewComment>,
                                res: Response) {
        const post = await this.postsService.givePostById(req.params.id)

        if (!post) {
            return res.sendStatus(404)
        }

        const createdComment = await this.commentsService
            .createNewComment(req.params.id, req.body.content, req.user!)

        if (!createdComment) {
            return res.sendStatus(404)
        }

        return res.status(201).send(createdComment)
    }

    async updatePostByPostId(req: RequestWithParamsAndBody<URIParameters, PostsUpdatePost>,
                             res: Response<PostConstructor | null>) {
        const isUpdate = await this.postsService
            .updatePost(req.params.id,
                req.body.title,
                req.body.shortDescription,
                req.body.content,
                req.body.blogId)

        if (!isUpdate) {
            return res.sendStatus(404)
        }

        const post = await this.postsService.givePostById(req.params.id)
        return res.status(204).send(post)
    }

    async deletePostByPostId(req: RequestWithParams<URIParameters>,
                             res: Response) {
        const isDeleted = await this.postsService.deletePostById(req.params.id)

        if (isDeleted) {
            return res.sendStatus(204)
        }

        return res.sendStatus(404)
    }
}