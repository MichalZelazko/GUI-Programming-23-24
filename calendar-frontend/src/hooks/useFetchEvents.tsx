import { useEffect, useState } from "react";

export type EventProps = {
  id: string;
  attributes: {
    title: string;
    start: Date;
    end: Date;
    category: string;
  };
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
        setEvents(data.data);
        console.log(data.data);
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
