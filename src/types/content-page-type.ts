import {BlogsType} from "./blogs-type";
import {CommentsType} from "./comment-type";
import {PostsType} from "./posts-type";
import {UsersType} from "./user-type";

export class ContentPageType {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: BlogsType | PostsType | UsersType | CommentsType
    ) {}
}