export class BlogsUpdateBlog {
    constructor(
        /**
         * Update blog`s name or youtubeUrl
         */
        public name: string,
        public youtubeUrl: string
    ) {}
}