import {likesRepository} from "../composition-root";
import {CommentBDConstructor, CommentsViewModel} from "../types/comment-constructor";

export const commentOutputDataForAuthorisationUser = async (comment: CommentBDConstructor, userId: string): Promise<CommentsViewModel> => {
    const likesCount = await likesRepository.giveReactionsCount(comment.id, 'Like')
    const dislikesCount = await likesRepository.giveReactionsCount(comment.id, 'Dislike')
    let userReaction = await likesRepository.giveUserReaction(comment.id, userId) // TODO ??? Прошу вернуть одно поле, а возвращает весь объект
    console.log(userReaction)

    let reaction = 'None'
    if (userReaction) {
        reaction = userReaction!.status
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