import { Injectable } from '@angular/core';
import { Order } from '../../interfaces/orders.interfaces';
import { SupabaseService } from '../../services/supabase.service';

/**
 * Service responsible for managing orders in the application.
 * Handles CRUD operations for orders using Supabase as the backend.
 */
@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private supabaseService: SupabaseService) {}

  /**
   * Adds a new order to the database.
   * @param order - The order object to be added
   * @returns Promise<Order> - The newly created order
   * @throws Error if the order could not be added
   */
  public async addOrder(order: Order): Promise<Order> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('orders')
      .insert(order)
      .select()
      .single();

    if (error) {
      throw new Error('could not add order: ' + error.message);
    }

    return data as Order;
  }

  /**
   * Removes an order from the database by its ID.
   * @param orderId - The ID of the order to be removed
   * @returns Promise<void>
   * @throws Error if the order could not be removed
   */
  public async removeOrder(orderId: number): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) {
      throw new Error('could not remove order: ' + error.message);
    }
  }
}
