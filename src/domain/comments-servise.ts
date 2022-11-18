import {v4 as uuidv4} from 'uuid';
import {CommentsRepository} from "../repositories/comments-repository";
import {CommentBDConstructor, CommentConstructor} from "../types/comment-constructor";
import {ContentPageConstructor} from "../types/contentPage-constructor";
import {LikesInfoConstructor} from "../types/likesInfo-constructor";
import {UserDBConstructor} from "../types/user-constructor";
import {paginationContentPage} from "../paginationContentPage";
import {commentOutputType} from "../dataMapping/toCommentOutputData";
import {LikesInfoRepository} from "../repositories/likesInfo-repository";
import {UserLikesRepository} from "../repositories/userLikes-repositiry";
import {commentOutputDataForNotAuthorisationUser} from "../dataMapping/getCommentForNotAuthUserOutputData";
import {JWTService} from "../application/jws-service";
import {commentOutputDataForAuthorisationUser} from "../dataMapping/commentOutputDataForAuthorisationUser";
import {UserLikeStatusConstructor} from "../types/userLikeStatus-constructor";

export class CommentsService {
    constructor(protected jwtService: JWTService,
                protected commentsRepository: CommentsRepository,
                protected likesInfoRepository: LikesInfoRepository,
                protected userLikesRepository: UserLikesRepository) {}

    async createNewComment(postId: string, comment: string, user: UserDBConstructor): Promise<CommentConstructor | null> {
        const commentId = uuidv4()

        const likesInfo = new LikesInfoConstructor(
            commentId,
            'None',
            0,
            0
        )

        const newComment = new CommentBDConstructor(
            commentId,
            comment,
            user.id,
            user.login,
            new Date().toISOString(),
            likesInfo,
            postId
        )

        const createdComment = await this.commentsRepository.createNewComment(newComment)
        await this.likesInfoRepository.createLikeInfo(likesInfo)

        if (!createdComment) {
            return null
        }

        return commentOutputDataForNotAuthorisationUser(createdComment)
    }

    async updateComment(commentId: string, comment: string): Promise<boolean> {
        return await this.commentsRepository.updateComment(commentId, comment)
    }

    async giveCommentById(commentId: string): Promise<CommentConstructor | null> {

        const comment = await this.commentsRepository.giveCommentById(commentId)

        if (!comment) {
            return null
        }

        return commentOutputType(comment)
    }

    async giveCommentsPage(sortBy: string,
                           sortDirection: 'asc' | 'desc',
                           pageNumber: string,
                           pageSize: string,
                           postId: string,
                           token?: string): Promise<ContentPageConstructor | null> {
        console.log(sortBy, sortDirection, pageNumber, pageSize, postId)
        const commentsDB = await this.commentsRepository.giveComments(sortBy, sortDirection, pageNumber, pageSize, postId)

        if (!commentsDB!.length) {
            return null
        }

        let comments
        if (!token) {
            comments = commentsDB!.map(async c => await commentOutputDataForNotAuthorisationUser(c))
        } else {
            const accessToken = (token.split(' '))[1]
            const tokenPayload = await this.jwtService.giveTokenPayload(accessToken)
            comments = commentsDB!.map(async c => await commentOutputDataForAuthorisationUser(c, tokenPayload.userId))
        }

        const totalCount = await this.commentsRepository.giveTotalCount(postId)

        // @ts-ignore
        return paginationContentPage(pageNumber, pageSize, comments, totalCount)
    }

    async giveComment(commentId: string) {
        return this.commentsRepository.giveCommentById(commentId)
    }

    async giveCommentOutputModel(token: string, commentDB: CommentBDConstructor) {
        if (!token) {
            return await commentOutputDataForNotAuthorisationUser(commentDB)
        }

        const accessToken = (token.split(' '))[1]
        const tokenPayload = await this.jwtService.giveTokenPayload(accessToken)

        return await commentOutputDataForAuthorisationUser(commentDB, tokenPayload.userId)
    }

    async updateLikesInfo(userId: string, commentId: string, likeStatus: string): Promise<boolean> {
        const isReacted = await this.userLikesRepository.giveUserLike(userId, commentId)

        if (!isReacted) {
            if (likeStatus === 'None') {
                return true
            }

            let newComment = new UserLikeStatusConstructor(userId, commentId, likeStatus)
            const newReact = await this.userLikesRepository.addUserReact(newComment)

            if (!newReact) {
                return false
            }

            let field = 'dislikesCount'
            if (likeStatus === 'Like') {
                field = 'likesCount'
            }

            return await this.likesInfoRepository.updateLikeOrDislikeCount(commentId, field)
        }

        if (isReacted.likeStatus === likeStatus) {
            return true
        }

        let field = 'dislikesCount'
        if (isReacted.likeStatus === 'Like') {
            field = 'likesCount'
        }

        const likeIsRemoved = await this.likesInfoRepository.removeLikeOrDislike(commentId, field)

        if (!likeIsRemoved) {
            return false
        }

        return await this.userLikesRepository.deleteUserReaction(userId)
    }

    async deleteCommentById(commentId: string): Promise<boolean> {
        return await this.commentsRepository.deleteCommentById(commentId)
    }
}