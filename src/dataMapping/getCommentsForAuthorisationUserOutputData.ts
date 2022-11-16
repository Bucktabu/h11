import {CommentBDConstructor, CommentsDBConstructor} from "../types/comment-constructor";
import {likesInfoRepository, userLikesRepository} from "../composition-root";


export const getCommentsForAuthorisationUserOutputData = async (comment: CommentsDBConstructor, userId: string) => {
    return comment.map(async c => { // TODO ???
        const userReaction = await userLikesRepository.giveUserLike(userId, c.id)
        let likeInfo = await likesInfoRepository.giveLikeInfo(c.id)

        likeInfo!.myStatus = userReaction!.likeStatus
        c.likesInfo = likeInfo!

        return c
    })
}