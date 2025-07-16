import { groceryData } from "../../data/groceryData";
import GroceryListCard from "./groceryListCard";

const GroceryListFeed = () => {
  return (
    <div className="flex flex-col gap-6">
      {groceryData.map((list) => (
        <GroceryListCard
          key={list.week}
          week={list.week}
          items={list.items}
          recipes={list.recipes}
        />
      ))}
    </div>
  );
};

export default GroceryListFeed;
