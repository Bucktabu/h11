import {likesInfoRepository, userLikesRepository} from "../composition-root";
import {CommentBDConstructor, CommentsBDType} from "../types/comment-constructor";

export const commentOutputDataForAuthorisationUser = async (comment: CommentBDConstructor, userId: string): Promise<CommentBDConstructor> => {
    const userReaction = await userLikesRepository.giveUserLike(userId, comment.id)

    let reaction = 'None'
    if (userReaction) {
        reaction = userReaction.likeStatus
    }

    const likeInfo = await likesInfoRepository.giveLikeInfo(comment.id)

    return {
        id: comment.id,
        content: comment.content,
        userId: comment.userId,
        userLogin: comment.userLogin,
        createdAt: comment.createdAt,
        likesInfo: {
            myStatus: reaction,
            likesCount: likeInfo!.likesCount,
            dislikesCount: likeInfo!.dislikesCount
        }
    }
}