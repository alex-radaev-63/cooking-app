import { useGroceryContext } from "../context/GroceryContext";
import GroceryList from "./GroceryList";

const GroceryFeed = () => {
  const { groceryLists } = useGroceryContext();

  return (
    <div className="flex flex-col gap-4">
      {groceryLists.map((list) => (
        <GroceryList key={list.id} id={list.id!} {...list} />
      ))}
    </div>
  );
};

export default GroceryFeed;
