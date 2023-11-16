import "./CategoryTile.css";

export type CategoryProps = {
  id: string;
  name: string;
  color: string;
};

function pickTextColorBasedOnBgColorAdvanced(
  bgColor: string,
  lightColor: string,
  darkColor: string
) {
  const color = bgColor.charAt(0) === "#" ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16); // hexToR
  const g = parseInt(color.substring(2, 4), 16); // hexToG
  const b = parseInt(color.substring(4, 6), 16); // hexToB
  const uicolors = [r / 255, g / 255, b / 255];
  const c = uicolors.map((col) => {
    if (col <= 0.03928) {
      return col / 12.92;
    }
    return Math.pow((col + 0.055) / 1.055, 2.4);
  });
  const L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  return L > 0.59 ? darkColor : lightColor;
}

export const CategoryTile = (category: CategoryProps) => {
  return (
    <>
      <div className="flex flex-row justify-start items-center gap-2 md:gap-4 border border-black bg-white rounded-md">
        <div
          id={category.id}
          className="h-10 w-10 rounded-md border-r border-black"
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
