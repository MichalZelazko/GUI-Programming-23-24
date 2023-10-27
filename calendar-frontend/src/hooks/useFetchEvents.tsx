import { useEffect, useState } from "react";
import { CategoryProps } from "../components/categoryTile/CategoryTile";

export type EventProps = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  category: CategoryProps;
};

const useFetchEvents = (url: string) => {
  const [events, setEvents] = useState<null | EventProps[]>(null);
  const [eventError, setEventError] = useState<null | string>(null);
  const [eventLoading, setEventLoading] = useState(true);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    const fetchData = async () => {
      setEventLoading(true);
      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data.data);
        setEvents(data.data);
        setEventLoading(false);
        setEventError(null);
      } catch (error) {
        let message;
        if (error instanceof Error) message = error.message;
        else message = String(error);
        setEventError(message);
        setEventLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return { events, eventLoading, eventError };
};

export default useFetchEvents;
