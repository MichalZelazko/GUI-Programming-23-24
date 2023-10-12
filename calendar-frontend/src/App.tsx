import useFetch from "./hooks/useFetch";
import {
  CategoryTile,
  CategoryTileAttributes,
} from "./components/categoryTile/CategoryTile";
import "./App.css";

function App() {
  const { data, loading, error } = useFetch(
    "http://localhost:1337/api/categories"
  );

  return (
    <>
      <h1>Calendar GUI</h1>
      <div>
        {loading && <div>Loading...</div>}
        {error && <div>Error...</div>}
        <div className="category-tile-container">
          {data &&
            data.map(({ id, attributes }) => (
              <CategoryTile
                key={id}
                id={id}
                attributes={attributes as CategoryTileAttributes}
              />
            ))}
        </div>
      </div>
    </>
  );
}

export default App;
