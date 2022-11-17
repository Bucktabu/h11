export class UserLikeStatusConstructor {
    constructor(
        public userId: string,
        public commentId: string,
        public likeStatus: string
    ) {
        this.userId = userId;
        this.likeStatus = likeStatus;
        this.commentId = commentId
    }

    userId = ''
    commentId = ''
    likeStatus = ''
}