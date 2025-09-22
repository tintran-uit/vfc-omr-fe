interface Sort {
  key: string;
  order: 'asc' | 'desc';
}

type Filters = Record<string, any>;

export function buildQueryString(
  page,
  itemsPerPage,
  filters?:Filters,
  sort?:Sort
): string {
  const query: Record<string, any> = {};

  query.page = page;
  query.limit = itemsPerPage;

  if (sort) {
    query[sort.key] = sort.order
  }

  // Convert object thành query string
  const params = new URLSearchParams();
  for (const key in query) {
    const value = query[key];
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else if (value !== undefined && value !== null) {
      params.append(key, value);
    }
  }

  return params.toString();
}
