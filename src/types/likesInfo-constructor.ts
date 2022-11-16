export class LikesInfoConstructor {
    constructor(
        public commentId: string,
        public myStatus: 'None' | 'Like' | 'Dislike',
        public likesCount: number,
        public dislikesCount: number
    ) {}
}

export class LikesInfoOutputConstructor {
    constructor(
        public myStatus: 'None' | 'Like' | 'Dislike',
        public likesCount: number,
        public dislikesCount: number
    ) {}
}