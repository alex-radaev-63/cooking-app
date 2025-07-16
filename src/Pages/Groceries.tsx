import { FaChevronDown, FaPlus } from "react-icons/fa6";
import GroceryListFeed from "../Components/groceries/groceryListFeed";

const Groceries = () => {
  return (
    <div className="flex flex-col p-6 gap-6">
      <div className="flex flex-col gap-6 items-left">
        <h1 className="text-3xl font-medium text-white">Groceries</h1>
        <div className="flex justify-between w-full gap-3">
          <button className="flex items-center min-h-10 text-gray-200 gap-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700">
            September 2024
            <FaChevronDown size={12} className="ml-1 text-gray-400" />
          </button>
          <button className="btn-primary text-sm">
            <FaPlus size={14} className="mr-1.5 mt-0.5 " /> New List
          </button>
        </div>
      </div>

      <GroceryListFeed />
    </div>
  );
};

export default Groceries;
