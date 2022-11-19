import {likesRepository} from "../composition-root";
import {CommentBDConstructor, CommentsViewModel} from "../types/comment-constructor";

export const commentOutputDataForAuthorisationUser = async (comment: CommentBDConstructor, userId: string): Promise<CommentsViewModel> => {
    // const likesCount = await likesRepository.giveReactionsCount(comment.id, 'Like')
    // const dislikesCount = await likesRepository.giveReactionsCount(comment.id, 'Dislike')
    const likesCount = await likesRepository.getLikeReactionsCount(comment.id)
    const dislikesCount = await likesRepository.getDislikeReactionsCount(comment.id)

    let reaction = 'None'

    if (userId) {
        const result = await likesRepository.giveUserReaction(comment.id, userId)
        if (result) reaction = result.status
    }





    return {
        id: comment.id,
        content: comment.content,
        userId: comment.userId,
        userLogin: comment.userLogin,
        createdAt: comment.createdAt,
        likesInfo: {
            myStatus: reaction,
            likesCount: likesCount!,
            dislikesCount: dislikesCount!
        }
    }
}