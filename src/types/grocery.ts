export interface GroceryItem {
  id: string;
  name: string;
  checked: boolean;
}

export interface GroceryList {
  id: string;
  household_id: string;
  date: string;
  items: GroceryItem[];
  recipes: any[];
  total: number | null;
  created_at: string;
}