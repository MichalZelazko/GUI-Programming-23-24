export type EventUpdateProps = {
  id: string;
  start?: Date;
  end?: Date;
  title?: string;
};

const updateEvent = async (url: string, eventData: EventUpdateProps) => {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update event: ${response.statusText}`);
  }
};

export default updateEvent;
