import {givePagesCount} from "./helperFunctions";
import {BlogsConstructor} from "./types/blogs-constructor";
import {PostsConstructor} from "./types/posts-constructor";
import {UsersType} from "./types/user-constructor";
import {CommentBDConstructor, CommentsBDType, CommentsType, CommentsViewModel} from "./types/comment-constructor";

export const paginationContentPage = (pageNumber: string,
                                      pageSize: string,
                                      content: BlogsConstructor | PostsConstructor | UsersType | CommentsViewModel[],
                                      totalCount: number) => {

    return {
        "pagesCount": givePagesCount(totalCount, pageSize),
        "page": Number(pageNumber),
        "pageSize": Number(pageSize),
        "totalCount": totalCount,
        "items": content
    }
}