import {v4 as uuidv4} from 'uuid';
import {JWTService} from "../application/jws-service";
import {CommentsRepository} from "../repositories/comments-repository";
import {CommentBDConstructor,
        CommentsBDType,
        CommentsViewModel} from "../types/comment-constructor";
import {ContentPageConstructor} from "../types/contentPage-constructor";
import {UserDBConstructor} from "../types/user-constructor";
import {paginationContentPage} from "../paginationContentPage";
import {commentOutputData} from "../helperFunctions";
import {commentOutputDataForAuthorisationUser} from "../dataMapping/commentOutputDataForAuthorisationUser";
import {commentOutputBeforeCreate,
        commentOutputDataForNotAuthorisationUser} from "../dataMapping/getCommentForNotAuthUserOutputData";
import {LikesRepository} from "../repositories/likes-repository";

export class CommentsService {
    constructor(protected jwtService: JWTService,
                protected commentsRepository: CommentsRepository,
                protected likesRepository: LikesRepository) {}

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

        if (!comment) {
            return null
        }

        return commentOutputData(comment, token)
    }

    async giveCommentsPage(sortBy: string,
                           sortDirection: 'asc' | 'desc',
                           pageNumber: string,
                           pageSize: string,
                           postId: string,
                           token?: string): Promise<ContentPageConstructor | null> {
        console.log(sortBy, sortDirection, pageNumber, pageSize, postId)
        const commentsDB: CommentsBDType | null = await this.commentsRepository.giveComments(sortBy, sortDirection, pageNumber, pageSize, postId)

        if (!commentsDB!.length) {
            return null
        }

        let comments: CommentsViewModel[]
        if (!token) {
            // @ts-ignore
            comments = commentsDB!.map(async c => await commentOutputDataForNotAuthorisationUser(c))
        } else {
            const accessToken = (token.split(' '))[1]
            const tokenPayload = await this.jwtService.giveTokenPayload(accessToken)
            // @ts-ignore
            comments = commentsDB!.map(async c => await commentOutputDataForAuthorisationUser(c, tokenPayload.userId))
        }

        const totalCount = await this.commentsRepository.giveTotalCount(postId)

        return paginationContentPage(pageNumber, pageSize, comments, totalCount)
    }

    async updateLikesInfo(userId: string, commentId: string, likeStatus: string): Promise<boolean> {
        return await this.likesRepository.updateUserReaction(commentId, userId, likeStatus)
    }

    async deleteCommentById(commentId: string): Promise<boolean> {
        return await this.commentsRepository.deleteCommentById(commentId)
    }
}