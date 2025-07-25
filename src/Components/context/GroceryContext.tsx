import { createContext, useContext, useState, type ReactNode } from "react";
import { groceryData as originalData } from "../../data/groceryData";
import type { GroceryListProps } from "../../data/groceryData";
import { produce } from "immer";

interface GroceryContextType {
  groceryLists: GroceryListProps[];
  toggleItemChecked: (listIndex: number, itemId: number) => void;
  isEditingList: { [index: number]: boolean };
  setIsEditingList: (index: number, value: boolean) => void;
  updateItemName: (listIndex: number, itemId: number, newName: string) => void;
  addItemToList: (listIndex: number) => void;
  removeItemFromList: (listIndex: number, itemId: number) => void;
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

  const updateItemName = (
    listIndex: number,
    itemId: number,
    newName: string
  ) => {
    setGroceryLists((prev) =>
      produce(prev, (draft) => {
        const item = draft[listIndex]?.items.find((i) => i.id === itemId);
        if (item) item.name = newName;
      })
    );
  };

  const addItemToList = (listIndex: number) => {
    setGroceryLists((prev) =>
      produce(prev, (draft) => {
        const currentItems = draft[listIndex].items;
        const nextId =
          currentItems.length > 0
            ? Math.max(...currentItems.map((item) => item.id)) + 1
            : 1;

        currentItems.push({
          id: nextId,
          name: "",
          checked: false,
        });
      })
    );
  };

  const removeItemFromList = (listIndex: number, itemId: number) => {
    setGroceryLists((prevLists) =>
      produce(prevLists, (draft) => {
        draft[listIndex].items = draft[listIndex].items.filter(
          (item) => item.id !== itemId
        );
      })
    );
  };

  const setIsEditingList = (index: number, value: boolean) => {
    if (value) {
      setGroceryLists((prev) =>
        produce(prev, (draft) => {
          draft.forEach((list) => {
            list.items = list.items.filter((item) => item.name.trim() !== "");
          });
        })
      );

      // Enable editing for the selected list, disable others
      setIsEditingListState((prev) => {
        const newState = { ...prev };
        Object.keys(newState).forEach((key) => {
          newState[+key] = +key === index;
        });
        return newState;
      });
    } else {
      // Turn off editing for just this list
      setIsEditingListState((prev) => ({
        ...prev,
        [index]: false,
      }));

      //Cleanup for empty items on save
      setGroceryLists((prev) =>
        produce(prev, (draft) => {
          draft.forEach((list) => {
            list.items = list.items.filter((item) => item.name.trim() !== "");
          });
        })
      );
    }
  };

  return (
    <GroceryContext.Provider
      value={{
        groceryLists,
        toggleItemChecked,
        isEditingList,
        setIsEditingList,
        updateItemName,
        addItemToList,
        removeItemFromList,
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
