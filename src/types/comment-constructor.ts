export class CommentConstructor {
    constructor(
        public id: string,
        public content: string,
        public userId: string,
        public userLogin: string,
        public createdAt: string
    ) {}
}

export type CommentsType = CommentConstructor[]

export class CommentBDConstructor {
    constructor(
        public id: string,
        public content: string,
        public userId: string,
        public userLogin: string,
        public createdAt: string,
        public postId: string
    ) {}
}