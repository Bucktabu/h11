import {likesInfoRepository, userLikesRepository} from "../composition-root";
import {CommentBDConstructor} from "../types/comment-constructor";

export const commentOutputDataForAuthorisationUser = async (comment: CommentBDConstructor, userId: string) => {
    const userReaction = await userLikesRepository.giveUserLike(userId, comment.id)
    console.log('userReaction: ' + userReaction)
    const likeInfo = await likesInfoRepository.giveLikeInfo(comment.id)

    return {
        id: comment.id,
        content: comment.content,
        userId: comment.userId,
        userLogin: comment.userLogin,
        createdAt: comment.createdAt,
        likesInfo: {
            myStatus: userReaction!.likeStatus,
            likesCount: likeInfo!.likesCount,
            dislikesCount: likeInfo!.dislikesCount
        }
    }
}