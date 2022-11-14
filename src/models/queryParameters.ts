export class QueryParameters {
    constructor(
        /**
         *  Input query params
         */
        public searchNameTerm: string,
        public searchLoginTerm: string,
        public searchEmailTerm: string,
        public sortBy: string,
        public sortDirection: 'asc' | 'desc',
        public pageNumber: string,
        public pageSize: string,
        public blogId: string
    ) {}
}