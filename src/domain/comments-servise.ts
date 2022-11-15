import {CommentsRepository} from "../repositories/comments-repository";
import {CommentBDConstructor, CommentConstructor} from "../types/comment-constructor";
import {ContentPageConstructor} from "../types/contentPage-constructor";
import {LikesInfoConstructor} from "../types/likesInfo-constructor";
import {UserDBConstructor} from "../types/user-constructor";
import {paginationContentPage} from "../paginationContentPage";
import {commentOutputType} from "../dataMapping/toCommentOutputType";

export class CommentsService {
    constructor(protected commentsRepository: CommentsRepository) {}

    async createNewComment(postId: string, comment: string, user: UserDBConstructor): Promise<CommentConstructor | null> {
        const likesInfo = new LikesInfoConstructor(
            'None',
            [],
            []
        )

        const newComment = new CommentBDConstructor(
            String(+new Date()),
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

    async deleteCommentById(commentId: string): Promise<boolean> {
        return await this.commentsRepository.deleteCommentById(commentId)
    }
}