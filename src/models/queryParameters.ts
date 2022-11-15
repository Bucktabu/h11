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