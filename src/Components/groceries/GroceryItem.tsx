import { useState } from "react";
import type { GroceryItem as GroceryItemType } from "../../data/groceryData";
import { useGroceryContext } from "../context/GroceryContext";

import { IoClose } from "react-icons/io5";

interface Props {
  item: GroceryItemType;
  listIndex: number;
}

const GroceryItem = ({ item, listIndex }: Props) => {
  const { toggleItemChecked, isEditingList } = useGroceryContext();
  const [name, setName] = useState(item.name);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <>
      {!isEditingList[listIndex] ? (
        <label className="flex flex-row gap-3 items-center min-h-[28px]">
          <input
            type="checkbox"
            checked={item.checked}
            onChange={() => toggleItemChecked(listIndex, item.id)}
            className="accent-green-300 min-h-5 min-w-5"
          />
          <span className={item.checked ? "text-slate-500" : ""}>{name}</span>
        </label>
      ) : (
        <div className="relative">
          <input
            type="text"
            placeholder="Grocery Item"
            value={name}
            onChange={handleChange}
            className="min-h-[40px] w-full bg-slate-700 text-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-400 focus:text-white"
          />
          <button className="absolute right-2 top-2 text-gray-400 hover:text-white hover:cursor-pointer">
            <IoClose size={24} />
          </button>
        </div>
      )}
    </>
  );
};

export default GroceryItem;
