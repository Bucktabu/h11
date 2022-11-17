import {likesInfoRepository, userLikesRepository} from "../composition-root";
import {CommentBDConstructor} from "../types/comment-constructor";

export const commentOutputDataForAuthorisationUser = async (comment: CommentBDConstructor, userId: string) => {
    const userReaction = await userLikesRepository.giveUserLike(userId, comment.id)

    let reaction = 'None'
    if (userReaction) {
        reaction = userReaction.likeStatus
    } // если пользователь авторизован, но коммент не лайкнут, userReaction вернет null

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