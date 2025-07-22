import GroceryList from "./GroceryList";
import { groceryData } from "../../data/groceryData";

const GroceryFeed = () => {
  return (
    <div className="flex flex-col gap-4">
      {groceryData.map((list, listIndex) => (
        <GroceryList key={listIndex} {...list} />
      ))}
    </div>
  );
};

export default GroceryFeed;
