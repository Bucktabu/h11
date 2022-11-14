export class BlogType {
    constructor(
        public id: string,
        public name: string,
        public youtubeUrl: string,
        public createdAt: string
    ) {}
}

export type BlogsType = BlogType[]