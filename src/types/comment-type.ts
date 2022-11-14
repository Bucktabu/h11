export class CommentType {
    constructor(
        public id: string,
        public content: string,
        public userId: string,
        public userLogin: string,
        public createdAt: string
    ) {}
}

export type CommentsType = CommentType[]

export class CommentBDType {
    constructor(
        public id: string,
        public content: string,
        public userId: string,
        public userLogin: string,
        public createdAt: string,
        public postId: string
    ) {}
}