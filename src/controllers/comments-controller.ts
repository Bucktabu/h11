import {RequestWithParams, RequestWithParamsAndBody} from "../types/request-types";
import {URIParameters} from "../models/URIParameters";
import {Response} from "express";
import {CommentConstructor} from "../types/comment-constructor";
import {CommentsService} from "../domain/comments-servise";
import {LikesModel} from "../models/likes-model";
import {LikeStatusConstructor} from "../types/likeStatus-constructor";
import {UsersService} from "../domain/users-service";

export class CommentsController {
    constructor(protected commentsService: CommentsService,
                protected usersService: UsersService) {}

    async getCommentByCommentId(req: RequestWithParams<URIParameters>,
                                res: Response<CommentConstructor>) {
        const comment = await this.commentsService.giveCommentById(req.params.id)

        if (!comment) {
            return res.sendStatus(404)
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
        const likeStatus = Object.values(LikesModel)

        if (!likeStatus.includes(req.body.likeStatus as LikesModel)) { // TODO ??? Просто принудительно типизировал
            return res.sendStatus(400)
        }

        const comment = await this.commentsService.giveCommentById(req.params.id)

        if (!comment) {
            res.sendStatus(404)
        }

        await this.commentsService.updateLikesInfo(req.user!.id, req.params.id, req.body.likeStatus)
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