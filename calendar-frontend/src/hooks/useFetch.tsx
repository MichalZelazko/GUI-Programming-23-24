import { useState, useEffect } from "react";
import { CategoryTileProps } from "../components/categoryTile/CategoryTile";

const useFetch = (url: string) => {
  const [data, setData] = useState<CategoryTileProps[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(url);
        const data = await response.json();
        setData(data.data as CategoryTileProps[]);
        setLoading(false);
        setError(null);
      } catch (error: any) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
