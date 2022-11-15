import {v4 as uuidv4} from 'uuid';
import {CommentsRepository} from "../repositories/comments-repository";
import {CommentBDConstructor, CommentConstructor} from "../types/comment-constructor";
import {ContentPageConstructor} from "../types/contentPage-constructor";
import {LikesInfoConstructor} from "../types/likesInfo-constructor";
import {UserDBConstructor} from "../types/user-constructor";
import {paginationContentPage} from "../paginationContentPage";
import {commentOutputType} from "../dataMapping/toCommentOutputType";
import {LikesInfoRepository} from "../repositories/likesInfo-repository";
import {UserLikesRepository} from "../repositories/userLikes-repositiry";

export class CommentsService {
    constructor(protected commentsRepository: CommentsRepository,
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

        if (!createdComment) {
            return null
        }

        return commentOutputType(createdComment)
    }

    async updateComment(commentId: string, comment: string): Promise<boolean> {
        return await this.commentsRepository.updateComment(commentId, comment)
    }

    async giveCommentById(commentId: string): Promise<CommentConstructor | null> {

        const comment = await this.commentsRepository.giveCommentById(commentId)

        if (!comment) {
            return null
        }

        return comment
    }

    async giveCommentsPage(sortBy: string,
                           sortDirection: 'asc' | 'desc',
                           pageNumber: string,
                           pageSize: string,
                           userId: string): Promise<ContentPageConstructor | null> {

        const commentsDB = await this.commentsRepository.giveComments(sortBy, sortDirection, pageNumber, pageSize, userId)

        if (!commentsDB!.length) {
            return null
        }

        const comments = commentsDB!.map(c => commentOutputType(c))
        const totalCount = await this.commentsRepository.giveTotalCount(userId)

        return paginationContentPage(pageNumber, pageSize, comments, totalCount)
    }

    async updateLikesInfo(userId: string, commentId: string, status: string) {
        const commentLiked = await this.userLikesRepository.checkUserLike(userId, commentId)

        if (!commentLiked) {
            await this.userLikesRepository.addUserLike(userId, commentId, status)
        }

        if (status === 'None') {
            await this.userLikesRepository.updateUserLikeStatus(userId, status)

            let field = 'dislikesCount'
            if (commentLiked!.likeStatus === 'Like') {
                field = 'likesCount'
            }

            await this.likesInfoRepository.removeLikeOrDislike(commentId, field)
        }
        let field = 'dislikesCount'
        if (status === 'Like') {
            field = 'likesCount'
        }

        await this.likesInfoRepository.updateLikeOrDislikeCount(commentId, field)
    } // TODO остановился здесь

    async deleteCommentById(commentId: string): Promise<boolean> {
        return await this.commentsRepository.deleteCommentById(commentId)
    }
}