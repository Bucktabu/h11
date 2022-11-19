import {v4 as uuidv4} from 'uuid';
import {JWTService} from "../application/jws-service";
import {CommentsRepository} from "../repositories/comments-repository";
import {CommentBDConstructor, CommentsBDType, CommentsViewModel} from "../types/comment-constructor";
import {ContentPageConstructor} from "../types/contentPage-constructor";
import {UserDBConstructor} from "../types/user-constructor";
import {paginationContentPage} from "../paginationContentPage";
import {commentOutputDataForAuthorisationUser} from "../dataMapping/commentOutputDataForAuthorisationUser";
import {
    commentOutputBeforeCreate,
    commentOutputDataForNotAuthorisationUser
} from "../dataMapping/getCommentForNotAuthUserOutputData";
import {LikesRepository} from "../repositories/likes-repository";
import {jwtService, likesRepository} from "../composition-root";

export class CommentsService {
    constructor(protected jwtService: JWTService,
                protected commentsRepository: CommentsRepository,
                protected likesRepository: LikesRepository) {
    }

    async createNewComment(postId: string, comment: string, user: UserDBConstructor): Promise<CommentsViewModel | null> {
        const commentId = uuidv4()

        let newComment = new CommentBDConstructor(
            commentId,
            comment,
            user.id,
            user.login,
            new Date().toISOString(),
            postId
        )

        try {
            await this.commentsRepository.createNewComment(newComment)
        } catch (e) {
            return null
        }

        return commentOutputBeforeCreate(newComment)
    }

    async updateComment(commentId: string, comment: string): Promise<boolean> {
        return await this.commentsRepository.updateComment(commentId, comment)
    }

    async giveCommentById(commentId: string, token?: string): Promise<CommentsViewModel | null> {
        const comment = await this.commentsRepository.giveCommentById(commentId)
        if (!comment) return null
        const userId = await this.getUserIdFromToken(token)
        return await this.addLikesInfoForComment(comment, userId)
    }

    async giveCommentsPage(sortBy: string,
                           sortDirection: 'asc' | 'desc',
                           pageNumber: string,
                           pageSize: string,
                           postId: string,
                           token?: string): Promise<ContentPageConstructor | null> {

        const commentsDB: CommentsBDType = await this.commentsRepository.giveComments(sortBy, sortDirection, pageNumber, pageSize, postId)
        const totalCount = await this.commentsRepository.giveTotalCount(postId)

        const userId = await this.getUserIdFromToken(token)
        const comments = await Promise.all(commentsDB.map(async c => await this.addLikesInfoForComment(c, userId)))

        // const test = []
        // for (const c of commentsDB){
        //     const comment = await this.addLikesInfoForComment(c, userId)
        //     test.push(comment)
        // }

        return paginationContentPage(pageNumber, pageSize, comments, totalCount)
    }

    async updateLikesInfo(userId: string, commentId: string, likeStatus: string): Promise<boolean> { //TODO
        return await this.likesRepository.updateUserReaction(commentId, userId, likeStatus)
    }

    async deleteCommentById(commentId: string): Promise<boolean> {
        return await this.commentsRepository.deleteCommentById(commentId)
    }

    private async addLikesInfoForComment (comment: CommentBDConstructor, userId: string | null) {
        let reaction = 'None'
        if (userId) {
            const result = await likesRepository.giveUserReaction(comment.id, userId)
            if (result) reaction = result.status
        }

        const likesCount = await likesRepository.getLikeReactionsCount(comment.id)
        const dislikesCount = await likesRepository.getDislikeReactionsCount(comment.id)

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

    private async getUserIdFromToken (token?: string): Promise<string | null> {
        let userId
        if (!token) userId = null
        else {
            const payload = await jwtService.giveTokenPayload(token.split(' ')[1])
            userId = payload.userId
        }
        return userId
    }
}