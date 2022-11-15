export class LikesInfoConstructor {
    constructor(
        public myStatus: 'None' | 'Like' | 'Dislike',
        public likesCount: string[],
        public dislikesCount: string[]
    ) {}
}
