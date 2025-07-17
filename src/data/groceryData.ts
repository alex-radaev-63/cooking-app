export interface GroceryItem {
  name: string;
  checked: boolean;
}

export interface GroceryListCardProps {
  week: string;
  items: GroceryItem[];
  recipes: string[];
}

export const groceryData: GroceryListCardProps[] = [
  {
    week: "Sunday, Sep 22, 2024",
    items: [
      { name: "2 lbs Chicken Breast", checked: false },
      { name: "1 gallon Milk", checked: true },
      { name: "1 head Broccoli", checked: false },
      { name: "Potato Chips", checked: false },
    ],
    recipes: ["Chicken Alfredo", "Broccoli Cheddar Soup"],
  },
  {
    week: "Saturday, Sep 12, 2024",
    items: [
      { name: "1 lb Ground Beef", checked: true },
      { name: "Dozen Eggs", checked: true },
      { name: "2 Avocados", checked: true },
      { name: "Orange Juice", checked: false },
    ],
    recipes: ["Tacos", "Avocado Toast"],
  },
  {
    week: "Friday, Sep 5, 2024",
    items: [
      { name: "1 Salmon Fillet", checked: false },
      { name: "Cheddar Cheese", checked: false },
      { name: "Onions", checked: false },
      { name: "Paper Towels", checked: false },
    ],
    recipes: ["Grilled Salmon", "Mac and Cheese"],
  },
];
