import { Injectable } from '@angular/core';
import { Pagination, Shoe } from '../../interfaces/item.interface';
import { SupabaseService } from '../../services/supabase.service';

/**
 * Helper function to calculate pagination range
 * @param page - Current page number (0-based)
 * @param size - Number of items per page
 * @returns Object containing 'from' and 'to' indices for pagination
 */
export const getPagination = (page: number, size: number) => {
  const limit = size ? size : 10;
  const from = page === 0 ? 0 : page * limit - 1;
  const to = page ? from + size : size - 1;

  return { from, to };
};

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  constructor(private supabaseService: SupabaseService) {}

  /**
   * Browse shoes with pagination and search functionality
   * @param paginations - Pagination parameters including page number and search term
   * @param forceReset - Force reset pagination to first page
   * @returns Updated pagination object with shoes data
   */
  public async browse(paginations: Pagination, forceReset = false): Promise<Pagination> {
    const limit = 16; // Number of items per page

    let reset = false;
    let page = paginations.page;

    // Reset pagination if force reset is true or search term is provided
    if (forceReset) {
      reset = true;
      page = 0;
    }

    if (paginations.searchTerm) {
      reset = true;
      page = 0;
    }

    const { from, to } = getPagination(page, limit);

    // Initialize base query
    let query = this.supabaseService.getClient().from('shoe').select('*', { count: 'exact' });

    // Add search filter if search term exists
    if (paginations.searchTerm) {
      query = query.ilike('name', `%${paginations.searchTerm}%`);
    }

    // Execute query with pagination and sorting
    const { data, error, count } = await query
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error('could not browse shoes: ' + error.message);
    }

    const shoes = data as Shoe[];

    // Calculate pagination metadata
    const total = count || 0;
    const complete = total === 0 || (page + 1) * limit >= total;

    const newPagination = {
      shoes: shoes,
      page: page + 1,
      total: total,
      complete: complete,
      reset: reset,
      searchTerm: paginations.searchTerm,
    };

    return newPagination;
  }

  /**
   * Add a new shoe item to the database
   * @param item - Shoe object to be added
   * @returns The newly created shoe object
   */
  public async addItem(item: Shoe): Promise<Shoe> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('shoe')
      .insert(item)
      .select()
      .single();

    if (error) {
      throw new Error('could not add shoe: ' + error.message);
    }

    return data as Shoe;
  }
}
