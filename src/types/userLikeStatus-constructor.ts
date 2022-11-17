export class UserLikeStatusConstructor {
    constructor(
        public userID: string,
        public commentID: string,
        public likeStatuses: string
    ) {
        this.userId = userID;
        this.likeStatus = likeStatuses;
        this.commentId = commentID
    }

    userId = ''
    commentId = ''
    likeStatus = ''
}