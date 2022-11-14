export class BlogsCreateNewPost {
    constructor(
        /**
         * Create new post with title, shortDescription and content
         */
        public title: string,
        public shortDescription: string,
        public content: string
    ) {}
}