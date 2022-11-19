export class BlogsCreateNewBlog {
    constructor(
        /**
         * Create new blog with name and youtubeUrl
         */
        public name: string,
        public description: string,
        public websiteUrl: string
    ) {}
}