export class BlogConstructor {
    constructor(
        public id: string,
        public name: string,
        public youtubeUrl: string,
        public createdAt: string
    ) {}
}

export type BlogsConstructor = BlogConstructor[]