import {BlogsConstructor} from "./blogs-constructor";
import {CommentBDConstructor, CommentsBDType} from "./comment-constructor";
import {PostsConstructor} from "./posts-constructor";
import {UsersType} from "./user-constructor";

export class ContentPageConstructor {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: BlogsConstructor | PostsConstructor | UsersType | CommentBDConstructor[]
    ) {}
}