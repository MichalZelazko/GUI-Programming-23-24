import { useState, useEffect } from "react";
import { CategoryTileProps } from "../components/categoryTile/CategoryTile";

const useFetchCategories = (url: string) => {
  const [categories, setCategories] = useState<null | CategoryTileProps[]>(
    null
  );
  const [categoryError, setCategoryError] = useState<null | string>(null);
  const [categoryLoading, setCategoryLoading] = useState(true);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    const fetchData = async () => {
      setCategoryLoading(true);
      try {
        const response = await fetch(url);
        const data = await response.json();
        setCategories(data.data as CategoryTileProps[]);
        setCategoryLoading(false);
        setCategoryError(null);
      } catch (error) {
        let message;
        if (error instanceof Error) message = error.message;
        else message = String(error);
        setCategoryError(message);
        setCategoryLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return { categories, categoryLoading, categoryError };
};

export default useFetchCategories;
