import { format } from "date-fns";
import {
  useEffect,
  useState,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { groceriesService } from "../../services/groceriesManageDB";
import type { GroceryItem, GroceryList } from "../../types/grocery";
import { produce } from "immer";
import { useAuth } from "./AuthContext";

interface GroceryContextType {
  groceryLists: GroceryList[];
  toggleItemChecked: (listId: string, itemId: string) => Promise<void>;
  isEditingList: { [id: string]: boolean };
  setIsEditingList: (
    listId: string,
    value: boolean,
    updatedItems?: GroceryItem[],
  ) => Promise<void>;
  updateItemName: (listId: string, itemId: string, newName: string) => void;
  addItemToList: (listId: string) => void;
  removeItemFromList: (listId: string, itemId: string) => void;
  setTotal: (listId: string, value: number) => void;

  isSavingList: { [id: string]: boolean };
  setIsSavingList: (listId: string, value: boolean) => void;

  saveErrors: { [id: string]: string | null };
  setSaveErrors: (listId: string, error: string | null) => void;

  createNewList: () => Promise<void>;
  deleteList: (listId: string, confirm: boolean) => Promise<void>;
}

// const householdId = "d97dc919-62c4-41bd-b4be-679aac06fd3b";

const GroceryContext = createContext<GroceryContextType | undefined>(undefined);

export const GroceryProvider = ({ children }: { children: ReactNode }) => {
  const [groceryLists, setGroceryLists] = useState<GroceryList[]>([]);
  const [isEditingList, setIsEditingListState] = useState<{
    [id: string]: boolean;
  }>({});
  const [isSavingList, setIsSavingListState] = useState<{
    [id: string]: boolean;
  }>({});
  const [saveErrors, setSaveErrorsState] = useState<{
    [id: string]: string | null;
  }>({});

  // Fetch lists once on mount
  const { user, householdId } = useAuth();

  console.log("User:", user);
  console.log("Household:", householdId);

  useEffect(() => {
    async function fetchLists() {
      // 1. If no auth → clear state and exit
      if (!user || !householdId) {
        setGroceryLists([]);
        setIsEditingListState({});
        setIsSavingListState({});
        setSaveErrorsState({});
        return;
      }

      try {
        const lists = await groceriesService.getAllLists(householdId);

        const sorted = lists.sort((a, b) => {
          const dateA = new Date(a.created_at || a.date).getTime();
          const dateB = new Date(b.created_at || b.date).getTime();
          return dateB - dateA;
        });

        setGroceryLists(sorted);

        const editingState = sorted.reduce(
          (acc, list) => {
            if (list.id) acc[list.id] = false;
            return acc;
          },
          {} as Record<string, boolean>,
        );

        setIsEditingListState(editingState);
        setIsSavingListState(editingState);

        setSaveErrorsState(
          sorted.reduce(
            (acc, list) => {
              if (list.id) acc[list.id] = null;
              return acc;
            },
            {} as Record<string, string | null>,
          ),
        );
      } catch (error) {
        console.error(error);
      }
    }

    fetchLists();
  }, [user, householdId]);

  // Setters for saving and errors by list id
  const setIsSavingList = (listId: string, value: boolean) => {
    setIsSavingListState((prev) => ({ ...prev, [listId]: value }));
  };

  const setSaveErrors = (listId: string, error: string | null) => {
    setSaveErrorsState((prev) => ({ ...prev, [listId]: error }));
  };

  const createNewList = async () => {
    if (!householdId) return;

    const hasEmptyList = groceryLists.some(
      (list) => list.items.length === 0 && list.recipes.length === 0,
    );

    if (hasEmptyList) {
      alert(
        "You already have an empty list. Please fill or delete it before adding a new one.",
      );
      return;
    }

    const formattedDate = format(new Date(), "MMMM d, yyyy");
    const newList: Omit<GroceryList, "id"> = {
      household_id: householdId,
      date: formattedDate,
      items: [],
      recipes: [],
      created_at: new Date().toISOString(),
      total: null,
    };

    try {
      const createdList = await groceriesService.createList(newList);
      setGroceryLists((prev) => [createdList, ...prev]);

      if (createdList.id) {
        setIsEditingListState((prev) => ({
          ...prev,
          [createdList.id!]: false,
        }));
        setIsSavingListState((prev) => ({ ...prev, [createdList.id!]: false }));
        setSaveErrorsState((prev) => ({ ...prev, [createdList.id!]: null }));
      }
    } catch (error) {
      console.error("Failed to create new list", error);
    }
  };

  const deleteList = async (listId: string, confirm: boolean) => {
    if (!confirm) return;

    try {
      await groceriesService.deleteList(listId);

      setGroceryLists((prev) => prev.filter((list) => list.id !== listId));

      // Remove per-list states for this id
      setIsEditingListState((prev) => {
        const copy = { ...prev };
        delete copy[listId];
        return copy;
      });

      setIsSavingListState((prev) => {
        const copy = { ...prev };
        delete copy[listId];
        return copy;
      });

      setSaveErrorsState((prev) => {
        const copy = { ...prev };
        delete copy[listId];
        return copy;
      });
    } catch (error) {
      console.error("Failed to delete list:", error);
    }
  };

  // Helper to find list by id and index
  const findListIndex = (listId: string) =>
    groceryLists.findIndex((list) => list.id === listId);

  // Check or uncheck grocery items
  const toggleItemChecked = async (listId: string, itemId: string) => {
    const idx = findListIndex(listId);
    if (idx === -1) return;

    setGroceryLists((prev) => {
      const updated = produce(prev, (draft) => {
        const item = draft[idx]?.items.find((i) => i.id === itemId);
        if (item) item.checked = !item.checked;
      });

      // Save updated list to DB immediately with fresh state
      groceriesService
        .updateList(listId, {
          household_id: updated[idx].household_id,
          date: updated[idx].date,
          items: updated[idx].items,
          recipes: updated[idx].recipes,
          total: updated[idx].total,
        })
        .catch((error) => {
          console.error("Failed to update item checked", error);
        });

      return updated;
    });
  };

  const updateItemName = (listId: string, itemId: string, newName: string) => {
    const idx = findListIndex(listId);
    if (idx === -1) return;

    setGroceryLists((prev) =>
      produce(prev, (draft) => {
        const item = draft[idx]?.items.find((i) => i.id === itemId);
        if (item) item.name = newName;
      }),
    );
  };

  const addItemToList = (listId: string) => {
    const idx = findListIndex(listId);
    if (idx === -1) return;

    setGroceryLists((prev) => {
      const updated = produce(prev, (draft) => {
        const currentItems = draft[idx].items;
        currentItems.push({
          id: crypto.randomUUID(),
          name: "",
          checked: false,
        });
      });

      return updated;
    });
  };

  const removeItemFromList = (listId: string, itemId: string) => {
    const idx = findListIndex(listId);
    if (idx === -1) return;

    setGroceryLists((prev) =>
      produce(prev, (draft) => {
        draft[idx].items = draft[idx].items.filter(
          (item) => item.id !== itemId,
        );
      }),
    );
  };

  const setTotal = (listId: string, value: number) => {
    const idx = findListIndex(listId);
    if (idx === -1) return;

    setGroceryLists((prev) =>
      produce(prev, (draft) => {
        draft[idx].total = value;
      }),
    );
  };

  const setIsEditingList = async (
    listId: string,
    isEditing: boolean,
    updatedItems?: GroceryItem[],
  ) => {
    const idx = findListIndex(listId);
    if (idx === -1) {
      console.warn(`No list found for ID ${listId}`);
      return;
    }

    if (isEditing) {
      // Enter edit mode — only this list editable
      setIsEditingListState((prev) =>
        Object.keys(prev).reduce(
          (acc, id) => {
            acc[id] = id === listId;
            return acc;
          },
          {} as Record<string, boolean>,
        ),
      );
      return;
    }

    // Exit edit mode and save
    setIsEditingListState((prev) => ({ ...prev, [listId]: false }));

    setGroceryLists((prev) => {
      const updated = produce(prev, (draft) => {
        if (updatedItems) {
          draft[idx].items = updatedItems.filter(
            (item) => item.name.trim() !== "",
          );
        }
      });

      setIsSavingList(listId, true);
      setSaveErrors(listId, null);

      groceriesService
        .updateList(listId, {
          household_id: updated[idx].household_id,
          date: updated[idx].date,
          items: updatedItems ?? updated[idx].items,
          recipes: updated[idx].recipes,
          total: updated[idx].total,
        })
        .catch((error) => {
          console.error("Failed to save grocery list to DB", error);
          setSaveErrors(listId, "Failed to save changes. Please try again.");
        })
        .finally(() => {
          setIsSavingList(listId, false);
        });

      return updated;
    });
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
        setTotal,

        isSavingList,
        setIsSavingList,
        saveErrors,
        setSaveErrors,

        createNewList,
        deleteList,
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
  return context as GroceryContextType;
};
