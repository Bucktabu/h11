import {CommentConstructor} from "../types/comment-constructor";

export const commentOutputType = (commentBD: CommentConstructor) => { // непонимаю передаю БД тип, а писать нужно обычный
    return {
        id: commentBD.id,
        content: commentBD.content,
        userId: commentBD.userId,
        userLogin: commentBD.userLogin,
        createdAt: commentBD.createdAt
    }
}