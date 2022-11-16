import {Router} from "express";
import {
        deleteCommentByIdMiddleware, likeStatusMiddleware,
        updateCommentMiddleware
} from "../middlewares/commentsRouter-middleware";
import {commentController} from "../composition-root";

export const commentsRouter = Router({})

commentsRouter.get('/:id', commentController.getCommentByCommentId.bind(commentController))

commentsRouter.put('/:id',
    ...updateCommentMiddleware, commentController.updateCommentByCommentId.bind(commentController))

commentsRouter.put('/:id/like-status',
    ...likeStatusMiddleware, commentController.updateLikeStatus.bind(commentController))

commentsRouter.delete('/:id',
    ...deleteCommentByIdMiddleware, commentController.deleteCommentByCommentId.bind(commentController))