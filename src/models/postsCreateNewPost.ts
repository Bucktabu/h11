export class PostsCreateNewPost {
    constructor(
        /**
         * Posts create new post with title, shortDescription, content and blogId:
         */
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string
    ) {}
}