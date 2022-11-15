import {Response, Router} from "express";

import {commentsService} from "../domain/comments-servise";
import {CommentConstructor} from "../types/comment-constructor";
import {RequestWithParams, RequestWithParamsAndBody} from "../types/request-types";
import {URIParameters} from "../models/URIParameters";
import {deleteCommentsRouterMiddleware,
        putCommentsRouterMiddleware} from "../middlewares/commentsRouter-middleware";

export const commentsRouter = Router({})

class CommentController {
    async getCommentByCommentId(req: RequestWithParams<URIParameters>,
                                res: Response<CommentConstructor>) {
        const comment = await commentsService.giveCommentById(req.params.id)

        if (!comment) {
            return res.sendStatus(404)
        }

        return res.status(200).send(comment)
    }

    async updateCommentByCommentId(req: RequestWithParamsAndBody<URIParameters, CommentConstructor>,
                                   res: Response<CommentConstructor>) {
        const isUpdate = await commentsService.updateComment(req.params.id, req.body.content)

        if (!isUpdate) {
            return res.sendStatus(404)
        }

        const comment = await commentsService.giveCommentById(req.params.id)

        return res.status(204).send(comment!)
    }

    async deleteCommentByCommentId(req: RequestWithParams<URIParameters>,
                                   res: Response) {
        const isDeleted = await commentsService.deleteCommentById(req.params.id)

        if (!isDeleted) {
            return res.sendStatus(404)
        }

        return res.sendStatus(204)
    }
}

const commentControllerInstance = new CommentController()

commentsRouter.get('/:id', commentControllerInstance.getCommentByCommentId)

commentsRouter.put('/:id',
    putCommentsRouterMiddleware, commentControllerInstance.updateCommentByCommentId)

commentsRouter.delete('/:id',
    deleteCommentsRouterMiddleware, commentControllerInstance.deleteCommentByCommentId)