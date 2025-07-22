export interface GroceryItem {
  id: number;
  name: string;
  checked: boolean;
}

export interface GroceryListProps {
  date: string;
  items: GroceryItem[];
  recipes: string[];
}

export const groceryData: GroceryListProps[] = [
  {
    date: "Sunday, Sep 22, 2024",
    items: [
      { id: 1, name: "2 lbs Chicken Breast", checked: false },
      { id: 2, name: "1 gallon Milk", checked: true },
      { id: 3, name: "1 head Broccoli", checked: false },
      { id: 4, name: "Potato Chips", checked: false },
    ],
    recipes: ["Chicken Alfredo", "Broccoli Cheddar Soup"],
  },
  {
    date: "Saturday, Sep 12, 2024",
    items: [
      { id: 1, name: "1 lb Ground Beef", checked: true },
      { id: 2, name: "Dozen Eggs", checked: true },
      { id: 3, name: "2 Avocados", checked: true },
      { id: 4, name: "Orange Juice", checked: false },
    ],
    recipes: ["Tacos", "Avocado Toast"],
  },
  {
    date: "Fri, Sep 5, 2024",
    items: [
      { id: 1, name: "1 Salmon Fillet", checked: false },
      { id: 2, name: "Cheddar Cheese", checked: false },
      { id: 3, name: "Onions", checked: false },
      { id: 4, name: "Paper Towels", checked: false },
    ],
    recipes: ["Grilled Salmon", "Mac and Cheese"],
  },
];
