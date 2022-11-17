export class UserLikeStatusConstructor {
    constructor(
        public userId: string,
        public commentId: string,
        public likeStatus: string
    ) {}
}