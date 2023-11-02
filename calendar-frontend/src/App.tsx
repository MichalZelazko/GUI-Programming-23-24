import { useEffect, useState } from "react";
import useFetchCategories from "./hooks/useFetchCategories";
import useFetchEvents from "./hooks/useFetchEvents";
import updateEvent, { EventUpdateProps } from "./hooks/updateEvent";
import Header from "./components/header/Header";
import {
  CategoryTile,
  CategoryProps,
} from "./components/categoryTile/CategoryTile";
import "./App.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, {
  EventResizeDoneArg,
} from "@fullcalendar/interaction";
import toast, { Toaster } from "react-hot-toast";
import AddEventForm from "./components/addEventForm/AddEventForm";
import { EventDropArg } from "@fullcalendar/core/index.js";

export type CalendarEventProps = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  backgroundColor: string;
};

function App() {
  const { categories, categoryLoading, categoryError } = useFetchCategories(
    "http://localhost:1337/api/categories"
  );

  const { events, eventLoading, eventError } = useFetchEvents(
    "http://localhost:1337/api/events?populate=category"
  );

  const [calendarEvents, setCalendarEvents] = useState<
    CalendarEventProps[] | null
  >([] as CalendarEventProps[]);

  useEffect(() => {
    if (events) {
      const updatedEvents = events.map((event) => ({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        backgroundColor: event.category.color,
      }));
      setCalendarEvents(updatedEvents);
    }
  }, [events]);

  const updateCalendarEvent = async (
    info: EventResizeDoneArg | EventDropArg
  ) => {
    try {
      updateEvent(`http://localhost:1337/api/events/${info.event.id}`, {
        id: info.event.id,
        end: info.event.end,
      } as EventUpdateProps);

      toast.success("Event updated!", {
        position: "bottom-center",
      });
    } catch (error) {
      toast.error("Event update failed!", {
        position: "bottom-center",
      });
    }
  };

  if (categoryLoading || eventLoading) {
    return (
      <>
        <div className="w-screen h-screen text-3xl flex items-center justify-center">
          Loading...
        </div>
      </>
    );
  } else if (categoryError || eventError) {
    return (
      <>
        <div className="w-screen h-screen text-3xl flex items-center justify-center">
          Error...
        </div>
      </>
    );
  } else {
    return (
      <>
        <div>
          <Toaster />
        </div>
        <div className="h-screen flex flex-row font-sans">
          <div className="basis-1/6 bg-gray-100 border-r border-b border-gray-200">
            <Header title="Calendar" />
            <AddEventForm
              categories={categories}
              events={calendarEvents}
              setEvents={setCalendarEvents}
            />
            <div className="w-full p-3">
              <h2 className="text-xl font-bold">Categories</h2>
              <ul className="mt-2 flex flex-col gap-1 text-center">
                {categories &&
                  categories.map((category: CategoryProps) => (
                    <li key={category.id}>
                      <CategoryTile {...category} />
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <div className="basis-5/6 font-sans py-5 px-10 h-full">
            {(categories || events) && (
              <>
                <FullCalendar
                  initialView="timeGridWeek"
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  headerToolbar={{
                    left: "today",
                    center: "prev title next",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                  }}
                  events={calendarEvents ? calendarEvents : []}
                  allDaySlot={false}
                  slotLabelFormat={{
                    hour12: false,
                    hour: "numeric",
                    minute: "2-digit",
                    omitZeroMinute: false,
                    meridiem: false,
                  }}
                  slotDuration={"00:15:00"}
                  nowIndicator={true}
                  locale={"en-gb"}
                  fixedWeekCount={false}
                  firstDay={1}
                  editable={true}
                  eventResize={(info) => {
                    updateCalendarEvent(info);
                  }}
                  eventDrop={(info) => {
                    updateCalendarEvent(info);
                  }}
                  eventOverlap={true}
                />
              </>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default App;
