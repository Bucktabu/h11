import {Router} from "express";
import {deleteCommentsRouterMiddleware,
        putCommentsRouterMiddleware} from "../middlewares/commentsRouter-middleware";
import {commentController, userController} from "../composition-root";
import {authentication} from "../middlewares/validation-middleware/authentication";

export const commentsRouter = Router({})

commentsRouter.get('/:id', commentController.getCommentByCommentId.bind(commentController))

commentsRouter.put('/:id',
    putCommentsRouterMiddleware, commentController.updateCommentByCommentId.bind(commentController))

commentsRouter.put('/:id/like-status',
    authentication, commentController.updateLikeStatus.bind(commentController))

commentsRouter.delete('/:id',
    deleteCommentsRouterMiddleware, commentController.deleteCommentByCommentId.bind(commentController))