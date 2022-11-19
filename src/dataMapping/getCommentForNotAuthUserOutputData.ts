import {CommentBDConstructor, CommentsViewModel} from "../types/comment-constructor";
import {likesRepository} from "../composition-root";

export const commentOutputDataForNotAuthorisationUser = async (comment: CommentBDConstructor): Promise<CommentsViewModel> => {
    const likesCount = await likesRepository.giveReactionsCount(comment.id, 'Like')
    const dislikesCount = await likesRepository.giveReactionsCount(comment.id, 'Dislike')

    return {
        id: comment.id,
        content: comment.content,
        userId: comment.userId,
        userLogin: comment.userLogin,
        createdAt: comment.createdAt,
        likesInfo: {
            myStatus: 'None',
            likesCount: likesCount!,
            dislikesCount: dislikesCount!
        }
    }
}

export const commentOutputBeforeCreate = (comment: CommentBDConstructor): CommentsViewModel => {
    return {
        id: comment.id,
        content: comment.content,
        userId: comment.userId,
        userLogin: comment.userLogin,
        createdAt: comment.createdAt,
        likesInfo: {
            myStatus: 'None',
            likesCount: 0,
            dislikesCount: 0
        }
    }
}