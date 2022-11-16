import {LikesInfoConstructor} from "./likesInfo-constructor";

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
        public likesInfo: LikesInfoConstructor,
        public postId: string
    ) {}
}

export type CommentsDBConstructor = CommentBDConstructor[]