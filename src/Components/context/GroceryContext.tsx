import { createContext, useContext, useState, type ReactNode } from "react";
import { groceryData as originalData } from "../../data/groceryData";
import type { GroceryListProps } from "../../data/groceryData";
import { produce } from "immer";

interface GroceryContextType {
  groceryLists: GroceryListProps[];
  toggleItemChecked: (listIndex: number, itemId: number) => void;
}

const GroceryContext = createContext<GroceryContextType | undefined>(undefined);

export const GroceryProvider = ({ children }: { children: ReactNode }) => {
  const [groceryLists, setGroceryLists] = useState(originalData);

  const toggleItemChecked = (listIndex: number, itemId: number) => {
    setGroceryLists((prev) =>
      produce(prev, (draft) => {
        const item = draft[listIndex]?.items.find((i) => i.id === itemId);
        if (item) item.checked = !item.checked;
      })
    );
  };

  return (
    <GroceryContext.Provider value={{ groceryLists, toggleItemChecked }}>
      {children}
    </GroceryContext.Provider>
  );
};

export const useGroceryContext = () => {
  const context = useContext(GroceryContext);
  if (!context)
    throw new Error("useGroceryContext must be used within GroceryProvider");
  return context;
};
