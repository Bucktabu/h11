import {LikesModel} from "../models/likes-model";
import {LikesInfoScheme} from "./likes-info";

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
        public likesInfo: LikesInfoScheme,
        public postId: string
    ) {}
}