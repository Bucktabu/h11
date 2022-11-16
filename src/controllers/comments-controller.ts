import {Response} from "express";
import {CommentsService} from "../domain/comments-servise";
import {UsersService} from "../domain/users-service";
import {URIParameters} from "../models/URIParameters";
import {CommentConstructor} from "../types/comment-constructor";
import {RequestWithParams, RequestWithParamsAndBody} from "../types/request-types";
import {getCommentsForAuthorisationUserOutputData} from "../dataMapping/getCommentsForAuthorisationUserOutputData";
import {JWTService} from "../application/jws-service";
import {LikeStatusConstructor} from "../types/likeStatus-constructor";

export class CommentsController {
    constructor(protected commentsService: CommentsService,
                protected jwtService: JWTService,
                protected usersService: UsersService) {}

    async getCommentByCommentId(req: RequestWithParams<URIParameters>,
                                res: Response<CommentConstructor>) {
        const comment = await this.commentsService.giveComment(req.params.id)

        if (!comment) {
            return res.sendStatus(404)
        }

        if (req.headers.accessToken) {
            const tokenPayload = await this.jwtService.giveTokenPayload(req.headers.accessToken as string)
            const commentWithLikeStatus = getCommentsForAuthorisationUserOutputData([comment], tokenPayload.userId)
            console.log('-----> commentWithLikeStatus: ' + commentWithLikeStatus)
            return res.status(200)/*.send(commentWithLikeStatus)*/
        }

        return res.status(200).send(comment)
    }

    async updateCommentByCommentId(req: RequestWithParamsAndBody<URIParameters, CommentConstructor>,
                                   res: Response<CommentConstructor>) {
        const isUpdate = await this.commentsService.updateComment(req.params.id, req.body.content)

        if (!isUpdate) {
            return res.sendStatus(404)
        }

        const comment = await this.commentsService.giveCommentById(req.params.id)

        return res.status(204).send(comment!)
    }

    async updateLikeStatus(req: RequestWithParamsAndBody<URIParameters, LikeStatusConstructor>, res: Response) {
        const comment = await this.commentsService.giveCommentById(req.params.id)

        if (!comment) {
            res.sendStatus(404)
        }

        await this.commentsService.updateLikesInfo(req.user!.id, req.params.id, req.body.likeStatus)

        return res.sendStatus(204)
    }

    async deleteCommentByCommentId(req: RequestWithParams<URIParameters>,
                                   res: Response) {
        const isDeleted = await this.commentsService.deleteCommentById(req.params.id)

        if (!isDeleted) {
            return res.sendStatus(404)
        }

        return res.sendStatus(204)
    }
}