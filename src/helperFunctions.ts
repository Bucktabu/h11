import bcrypt from "bcrypt";
import {jwtService} from "./composition-root";
import {CommentBDConstructor} from "./types/comment-constructor";
import {commentOutputDataForNotAuthorisationUser} from "./dataMapping/getCommentForNotAuthUserOutputData";
import {commentOutputDataForAuthorisationUser} from "./dataMapping/commentOutputDataForAuthorisationUser";

export const giveSkipNumber = (pageNumber: string,
                               pageSize: string) => {

    return (Number(pageNumber) - 1) * Number(pageSize)
}

export const givePagesCount = (totalCount: number, pageSize: string) => {
    return Math.ceil(totalCount / Number(pageSize))
}

export const _generateHash = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt)
}

export const commentOutputData = async (comment: CommentBDConstructor, token?: string) => {
    if (!token) {
        return commentOutputDataForNotAuthorisationUser(comment)
    }

    const accessToken = (token.split(' '))[1]
    const tokenPayload = await jwtService.giveTokenPayload(accessToken)
    return commentOutputDataForAuthorisationUser(comment, tokenPayload.userId)
}