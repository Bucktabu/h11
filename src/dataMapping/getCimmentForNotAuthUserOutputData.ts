import {CommentBDConstructor} from "../types/comment-constructor";
import {likesInfoRepository} from "../composition-root";

export const getCommentsForNotAuthorisationUserOutputData = async (comment: CommentBDConstructor): Promise<CommentBDConstructor> => {
    let likeInfo = await likesInfoRepository.giveLikeInfo(comment.id)

    return {
        id: comment.id,
        content: comment.content,
        userId: comment.userId,
        userLogin: comment.userLogin,
        createdAt: comment.createdAt,
        likesInfo: {
            myStatus: 'None',
            likesCount: likeInfo!.likesCount,
            dislikesCount: likeInfo!.dislikesCount
        }
    }
}