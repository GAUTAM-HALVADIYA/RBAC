export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
  search?:string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const getPaginationOptions = (query: Record<string, any>): PaginationOptions => {
  const page = parseInt(query.page as string, 10) || 1;
  const limit = parseInt(query.limit as string, 10) || 10;
  const sortBy = query.sortBy as string;
  const search = query.search as string;
  const sortOrder = (query.sortOrder as string) === 'desc' ? 'desc' : 'asc';

  const safeLimit = limit > 100 ? 100 : limit;
  const skip = (page - 1) * safeLimit;

  return {
    page,
    limit: safeLimit,
    skip,
    search,
    sortBy,
    sortOrder,
  };
};

export const getPaginatedMetadata = (
  totalRecords: number,
  page: number,
  limit: number
) => {
  const totalPages = Math.ceil(totalRecords / limit);
  return {
    totalRecords,
    totalPages,
    currentPage: page,
  };
};
