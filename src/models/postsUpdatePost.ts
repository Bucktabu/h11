export class PostsUpdatePost {
    constructor(
        /**
         * Update post`s title, sortDescription content: string,
         *     blogId:
         */
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string
    ) {}
}