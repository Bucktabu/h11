export class UserLikesConstructor {
    constructor(
        public userId: string,
        public commentId: string,
        public likeStatus: string
    ) {}
}