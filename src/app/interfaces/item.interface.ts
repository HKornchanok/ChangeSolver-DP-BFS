export interface Shoe {
  id?: number;
  name: string;
  price: number;
  description: string;
  created_at?: string;
}

export interface Pagination {
  page: number;
  total: number;
  complete: boolean;
  reset: boolean;
  shoes: Shoe[];
  searchTerm?: string;
}

export interface ItemsState {
  pagination: Pagination;
  loading: boolean;
}
