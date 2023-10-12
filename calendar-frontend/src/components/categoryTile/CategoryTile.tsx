import "./CategoryTile.css";

export type CategoryTileAttributes = {
  name: string;
  color: string;
};

export type CategoryTileProps = {
  id: string;
  attributes: CategoryTileAttributes;
};

export const CategoryTile = ({ id, attributes }: CategoryTileProps) => {
  return (
    <>
      <div
        id={id}
        className="category-tile"
        style={{ backgroundColor: attributes.color }}
      >
        <p>{attributes.name}</p>
      </div>
    </>
  );
};
