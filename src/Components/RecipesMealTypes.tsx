interface Props {
  ImageURL: string;
  MealType: string;
}

const RecipesMealTypes = ({ ImageURL, MealType }: Props) => {
  return (
    <div className="flex gap-2 p-1 pr-4 items-center hover:bg-slate-700 rounded-lg transition-all duration-250ms ease-in-out">
      <img
        src={ImageURL}
        className="rounded-sm w-[40px] sm:w-[48px] aspect-square"
        alt={MealType}
      ></img>
      <span className="text-base">{MealType}</span>
    </div>
  );
};

export default RecipesMealTypes;
