export class LikesInfoConstructor {
    constructor(
        public commentId: string,
        public myStatus: string,
        public likesCount: number,
        public dislikesCount: number
    ) {}
}

export class LikesInfoOutputConstructor {
    constructor(
        public myStatus: string,
        public likesCount: number,
        public dislikesCount: number
    ) {}
}