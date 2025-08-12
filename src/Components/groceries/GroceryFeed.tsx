import { useGroceryContext } from "../context/GroceryContext";
import GroceryList from "./GroceryList";

const GroceryFeed = () => {
  const { groceryLists } = useGroceryContext();

  const sortedLists = [...groceryLists].sort((a, b) => {
    // Both dates could be undefined or strings, so parse safely
    const dateA = new Date(a.created_at || a.date).getTime();
    const dateB = new Date(b.created_at || b.date).getTime();
    return dateB - dateA; // descending order
  });

  return (
    <div className="flex flex-col gap-4">
      {sortedLists.map((list, listIndex) => (
        <GroceryList key={list.id} id={list.id!} index={listIndex} {...list} />
      ))}
    </div>
  );
};

export default GroceryFeed;
