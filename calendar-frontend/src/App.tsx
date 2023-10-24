import useFetchCategories from "./hooks/useFetchCategories";
import useFetchEvents from "./hooks/useFetchEvents";
import { EventProps } from "./hooks/useFetchEvents";
import Header from "./components/header/Header";
import {
  CategoryTile,
  CategoryTileProps,
} from "./components/categoryTile/CategoryTile";
import "./App.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

function App() {
  const { categories, categoryLoading, categoryError } = useFetchCategories(
    "http://localhost:1337/api/categories"
  );

  const { events, eventLoading, eventError } = useFetchEvents(
    "http://localhost:1337/api/events"
  );

  return (
    <>
      <div className="h-screen flex flex-row font-sans">
        <div className="basis-1/6 bg-gray-100 border-r border-b border-gray-200">
          <Header title="Calendar" />
          <div className="w-full p-3">
            <h2 className="text-xl font-bold">Categories</h2>
            <ul className="mt-2 grid grid-cols-2 gap-1 text-center">
              {categories &&
                categories.map((category: CategoryTileProps) => (
                  <li key={category.id}>
                    <CategoryTile {...category} />
                  </li>
                ))}
              {events &&
                events.map((event: EventProps) => (
                  <li key={event.id}>
                    <p>{event.attributes.title}</p>
                    {/* <p>{event.attributes.start.toLocaleDateString()}</p>
                    <p>{event.attributes.end.toLocaleDateString()}</p> */}
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <div className="basis-5/6 font-mono py-5 px-10 h-full">
          {(categoryLoading || eventLoading) && (
            <div className="loading">Loading...</div>
          )}
          {(categoryError || eventError) && (
            <div className="error">Error...</div>
          )}
          {(categories || events) && (
            <>
              <FullCalendar
                initialView="dayGridMonth"
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                  left: "today",
                  center: "prev title next",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                // events={...events}
                allDaySlot={false}
                slotLabelFormat={{
                  hour12: false,
                  hour: "numeric",
                  minute: "2-digit",
                  omitZeroMinute: false,
                  meridiem: false,
                }}
                locale={"en-gb"}
                fixedWeekCount={false}
                firstDay={1}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
