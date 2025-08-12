import type { GroceryItem as GroceryItemType } from "../../data/groceryData";
import { useGroceryContext } from "../context/GroceryContext";

import { IoClose } from "react-icons/io5";

interface Props {
  item: GroceryItemType;
  listId: string; // changed from listIndex:number to listId:string
}

const GroceryItem = ({ item, listId }: Props) => {
  const {
    toggleItemChecked,
    isEditingList,
    removeItemFromList,
    updateItemName,
  } = useGroceryContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateItemName(listId, item.id, e.target.value);
  };

  return (
    <>
      {!isEditingList[listId] ? (
        <label className="flex flex-row gap-3 items-center min-h-[28px]">
          <input
            type="checkbox"
            checked={item.checked}
            onChange={() => toggleItemChecked(listId, item.id)}
            className="accent-green-300 min-h-5 min-w-5"
          />
          <span className={item.checked ? "text-slate-500" : ""}>
            {item.name}
          </span>
        </label>
      ) : (
        <div className="relative">
          <input
            type="text"
            placeholder="Grocery Item"
            value={item.name}
            onChange={handleChange}
            className="min-h-[40px] w-full bg-slate-700 text-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-400 focus:text-white"
          />
          <button
            onClick={() => removeItemFromList(listId, item.id)}
            className="absolute right-2 top-2 text-gray-400 hover:text-white hover:cursor-pointer"
          >
            <IoClose size={24} />
          </button>
        </div>
      )}
    </>
  );
};

export default GroceryItem;
