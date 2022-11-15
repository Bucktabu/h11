import {CommentBDConstructor} from "./comment-constructor";

export class PostConstructor {
    constructor(
        public id: string,
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public createdAt: string
    ) {}
}

export type PostsConstructor = PostConstructor[]