import { supabase } from "../supabase-client";


export interface GroceryItem {
  id: number;
  name: string;
  checked: boolean;
}

export interface GroceryListProps {
  id?: string; // DB row uuid
  date: string;
  items: GroceryItem[];
  recipes: string[];
  created_at?: string;
}

const TABLE_NAME = 'grocery_lists';

export const groceriesService = {
  // Fetch all grocery lists from Supabase
  async getAllLists(): Promise<GroceryListProps[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('id, date, items, recipes, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching grocery lists:', error);
      throw error;
    }
    // data is array of rows matching GroceryListProps shape + id + created_at
    return data ?? [];
  },

  // Update a grocery list row by id with the full list data
  async updateList(listId: string, updatedList: Omit<GroceryListProps, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({
        date: updatedList.date,
        items: updatedList.items,
        recipes: updatedList.recipes,
      })
      .eq('id', listId)
      .select()
      .single();

    if (error) {
      console.error(`Error updating grocery list ${listId}:`, error);
      throw error;
    }
    return data;
  },

  // Create a new grocery list, returns the created row with id
  async createList(newList: Omit<GroceryListProps, 'id' | 'created_at'>): Promise<GroceryListProps> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert({
        date: newList.date,
        items: newList.items,
        recipes: newList.recipes,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating grocery list:', error);
      throw error;
    }
    return data;
  },

  // Delete a grocery list by id
  async deleteList(listId: string) {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', listId);

    if (error) {
      console.error(`Error deleting grocery list ${listId}:`, error);
      throw error;
    }
  },
};