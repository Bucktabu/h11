// export class QueryParameters {
//     constructor(
//         /**
//          *  Input query params
//          */
//         public searchNameTerm: string,
//         public searchLoginTerm: string,
//         public searchEmailTerm: string,
//         public sortBy: string,
//         public sortDirection: 'asc' | 'desc',
//         public pageNumber: string,
//         public pageSize: string,
//         public blogId: string
//     ) {}
// }

export type QueryParameters = {
      searchNameTerm: string,
      searchLoginTerm: string,
      searchEmailTerm: string,
      sortBy: string,
      sortDirection: 'asc' | 'desc',
      pageNumber: string,
      pageSize: string,
      blogId: string
}