import { createContext, useContext, useState, type ReactNode } from "react";
import { groceryData as originalData } from "../../data/groceryData";
import type { GroceryListProps } from "../../data/groceryData";
import { produce } from "immer";

interface GroceryContextType {
  groceryLists: GroceryListProps[];
  toggleItemChecked: (listIndex: number, itemId: number) => void;
  isEditingList: { [index: number]: boolean };
  setIsEditingList: (index: number, value: boolean) => void;
}

const GroceryContext = createContext<GroceryContextType | undefined>(undefined);

export const GroceryProvider = ({ children }: { children: ReactNode }) => {
  const [groceryLists, setGroceryLists] = useState(originalData);
  const [isEditingList, setIsEditingListState] = useState<{
    [index: number]: boolean;
  }>(Object.fromEntries(originalData.map((_, index) => [index, false])));

  const toggleItemChecked = (listIndex: number, itemId: number) => {
    setGroceryLists((prev) =>
      produce(prev, (draft) => {
        const item = draft[listIndex]?.items.find((i) => i.id === itemId);
        if (item) item.checked = !item.checked;
      })
    );
  };

  const setIsEditingList = (index: number, value: boolean) => {
    if (value) {
      // Turn on editing for one list, disable all others
      setIsEditingListState(
        Object.fromEntries(originalData.map((_, i) => [i, i === index]))
      );
    } else {
      // Just turn off editing for the specified list
      setIsEditingListState((prev) => ({
        ...prev,
        [index]: false,
      }));
    }
  };

  return (
    <GroceryContext.Provider
      value={{
        groceryLists,
        toggleItemChecked,
        isEditingList,
        setIsEditingList,
      }}
    >
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
