import pickTextColorBasedOnBgColorAdvanced from "../../commons/PickTextColorBasedOnBgColorAdvanced";
import "./CategoryTile.css";

export type CategoryProps = {
  id: string;
  name: string;
  color: string;
};

export const CategoryTile = (category: CategoryProps) => {
  return (
    <>
      <div className="flex flex-row justify-start items-center gap-1 md:gap-4 border border-black bg-white rounded-md">
        <div
          id={category.id}
          className="w-3 h-10 md:w-10 rounded-md border-r border-black"
          style={{
            backgroundColor: category.color,
            color: pickTextColorBasedOnBgColorAdvanced(
              category.color,
              "#fff",
              "#000"
            ),
          }}
        ></div>
        <p className="text-md md:text-lg">{category.name}</p>
      </div>
    </>
  );
};
